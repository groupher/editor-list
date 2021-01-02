import tippy, { hideAll } from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

import {
  make,
  moveCaretToEnd,
  debounce,
  findIndex,
  clazz,
  isDOM,
} from "@groupher/editor-utils";

import OrgLabel from "./orgLabel";
import {
  LABEL_TYPE,
  SORT,
  SORT_DEFAULT,
  SORT_DOWN,
  SORT_ENUM,
  ORG_MODE,
  UNORDERED_LIST,
  ORDERED_LIST,
  CHECKLIST,
  MAX_INDENT_LEVEL,
} from "./constant";

import iconList from "./icons";

import {
  canItemIndent,
  indentElement,
  canItemUnIndent,
  unIndentElement,
  getIndentClass,
  parseIndentBlocks,
  setOrderListPrefixItem,
  indentIfNeed,
  getFamilyTree,
  findNextSameIndentLevelIndex,
} from "./helper";

/**
 * @typedef {Object} ListData
 * @description Tool's input and output data format
 * @property {String} text — list item's content
 * @property {Boolean} checked — this item checked or not
 * @property {String} labelType — label type: default | red | green | warn
 * @property {String} label — label content
 * @property {Number} hideLabel - has label or not
 */

export default class UI {
  constructor({ api, data, config, setTune, setData }) {
    this.api = api;
    this.config = config;

    this.VALID_INDENT_LEVELS = [0, 1, 2, 3];

    this._data = null;
    this.element = null;

    this.settings = iconList;
    this.setTune = setTune;
    this.setData = setData;

    this.sortType = SORT_DEFAULT;
    // all the textField's data-index array
    this.textFieldsIndexes = [];

    this.defaultLabelTypeValue = "default";
    this.orgLabel = new OrgLabel({
      api: this.api,
    });

    this.draggingElements = [];
    this.draggingFamilyTreeItems = null;
  }

  setType(type) {
    this._data.type = type;
  }

  /**
   * CSS classes
   * @constructor
   */
  get CSS() {
    return {
      baseBlock: this.api.styles.block,
      // settings
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
      settingsButtonRotate: "cdx-setting-button-rotate",

      // list
      listWrapper: "cdx-list",
      listItem: "cdx-list__item",
      listTextField: "cdx-list__item-text",
      unorderListPrefix: "cdx-list__item-unorder-prefix",
      orderListPrefix: "cdx-list__item-order-prefix",
      listPrefixIndex: "cdx-list__item-prefix-index",

      // list
      listUnOrderPrefix: "cdx-list__item-order-prefix",

      // label
      listLabel: "cdx-list-label",
      labelGreen: "cdx-list-label__green",
      labelRed: "cdx-list-label__red",
      labelWarn: "cdx-list-label__warn",
      labelDefault: "cdx-list-label__default",

      // checklist
      checklistWrapper: "cdx-checklist",
      checklistItem: "cdx-checklist__item",
      checklistItemChecked: "cdx-checklist__item--checked",
      checklistBox: "cdx-checklist__item-checkbox",
      checklistBracket: "cdx-checklist__item-bracket",
      checklistBracketRight: "cdx-checklist__item-bracket-right",
      checklistBracketCheckSign: "cdx-checklist__item-check-sign",
      checklistBracketCheckSignChecked: "cdx-checklist__item-check-sign-active",
      checklistTextField: "cdx-checklist__item-text",

      // label
      labelPopover: "label-popover",

      // drag
      listDragIcon: "cdx-list-drag-icon",
      listDragOver: "cdx-list-drag-over",
      listDragStart: "cdx-list-drag-start",
    };
  }

  getCSS(type, key) {
    const N = {
      [UNORDERED_LIST]: {
        textField: "listTextField",
        item: "listItem",
      },
      [ORDERED_LIST]: {
        textField: "listTextField",
        item: "listItem",
      },
      [CHECKLIST]: {
        textField: "checklistTextField",
        item: "checklistItem",
      },
    };

    return this.CSS[N[type][key]];
  }

  _hasLabelInList(visible = false) {
    for (let index = 0; index < this._data.items.length; index++) {
      const element = this._data.items[index];
      if (isDOM(element)) {
        const LabelList = element.querySelector(`.${this.CSS.listLabel}`);
        if (visible && LabelList) {
          return LabelList.style.display === "block";
        }
        if (LabelList) return true;
      }
    }
    return false;
  }

  // get init label state when editor load
  getInitLabelState(item) {
    const labelClassMap = {
      green: [this.CSS.listLabel, this.CSS.labelGreen],
      red: [this.CSS.listLabel, this.CSS.labelRed],
      warn: [this.CSS.listLabel, this.CSS.labelWarn],
      default: [this.CSS.listLabel, this.CSS.labelDefault],
    };

    // 当插入新行的时候需要判断是否其他的行已经有 label, 如果有的话返回默认的 label
    if (!item) {
      return this._hasLabelInList()
        ? {
            hasLabel: true,
            label: this.orgLabel.getDefaultLabelTypeValue(),
            labelClass: labelClassMap[LABEL_TYPE.DEFAULT],
          }
        : { hasLabel: false };
    }
    const hasLabel = item.label && item.labelType;

    return {
      hasLabel,
      labelClass: hasLabel ? labelClassMap[item.labelType] : null,
      label: item.label,
    };
  }

  // drop empty item when convert to other type of list
  // otherwise will cause strange behavior
  dropEmptyItem(items) {
    let rawItems = [];
    for (let index = 0; index < items.length; index += 1) {
      const element = items[index];

      if (element.innerText !== "") {
        rawItems.push(element);
      }
    }

    return rawItems;
  }

  // TODO:
  dropRawItem(items) {
    let rawItems = [];
    for (let index = 0; index < items.length; index += 1) {
      const element = items[index];

      if (isDOM(element)) {
        rawItems.push(element);
      }
    }

    return rawItems;
  }

  // 构建列表
  /**
   * draw order or unorder list
   *
   * @param {data: ListData, listType: UNORDERED_LIST}
   * @returns {HTMLElement}
   * @memberof UI
   */
  drawList(data, listType = UNORDERED_LIST) {
    this._data = data;
    this._data.items = this.dropEmptyItem(data.items);

    const Wrapper = make("div", [this.CSS.baseBlock, this.CSS.listWrapper]);

    // exist items
    if (data.items.length) {
      // this._data.items = this.dropEmptyItem(data.items);
      // data.items = this.dropEmptyItem(data.items);
      this._data = { items: [], type: listType };

      data.items.forEach((item, index) => {
        const NewItem = this.createListItem(item, listType, index);

        this._data.items.push(NewItem);
        Wrapper.appendChild(NewItem);
      });
      this._data.items = this.dropRawItem(this._data.items);
    } else {
      // this._data.items = this.dropEmptyItem(data.items);
      const NewItem = this.createListItem(null, listType);

      this._data.items.push(NewItem);
      Wrapper.appendChild(NewItem);
    }

    if (listType === ORDERED_LIST) {
      setTimeout(() => this.rebuildOrderListIndex(Wrapper), 100);
    }

    this.bindKeyDownEvent(Wrapper, listType);

    this.element = Wrapper;
    this.orgLabel.setElement(this.element);
    return Wrapper;
  }

  // 待办项
  drawCheckList(data) {
    this._data = data;
    this._data.items = this.dropEmptyItem(data.items);

    const Wrapper = make("div", [this.CSS.baseBlock, this.CSS.listWrapper]);

    if (data.items.length) {
      this._data = { items: [], type: CHECKLIST };

      data.items.forEach((item, index) => {
        const NewItem = this.createChecklistItem(item, index);

        this._data.items.push(NewItem);
        Wrapper.appendChild(NewItem);
      });
    } else {
      const NewItem = this.createChecklistItem(null);

      this._data.items.push(NewItem);
      Wrapper.appendChild(NewItem);
    }

    this.bindKeyDownEvent(Wrapper, CHECKLIST);

    Wrapper.addEventListener("click", (event) => {
      this.toggleCheckbox(event);
    });

    this.element = Wrapper;
    this.orgLabel.setElement(this.element);
    return Wrapper;
  }

  /**
   * bind keydown event for add and backspace
   *
   * @param {HTMLElement} node
   * @param {string} type, orderList / unOrderList / checklist
   * @memberof Ui
   */
  bindKeyDownEvent(node, type) {
    node.addEventListener(
      "keydown",
      (event) => {
        const [ENTER, BACKSPACE] = [13, 8]; // key codes

        switch (event.keyCode) {
          case ENTER:
            this.addNewItem(event, node, type);
            break;
          case BACKSPACE:
            this.backspace(event, type);
            break;
        }
      },
      false
    );
  }

  /**
   * Append new elements to the list by pressing Enter
   * @param {KeyboardEvent} event
   */
  addNewItem(event, node, type) {
    event.preventDefault();

    const textFieldClass = this.getCSS(type, "textField");
    const itemClass = this.getCSS(type, "item");

    const items = this._data.items;

    const currentNode = window.getSelection().anchorNode;
    const lastItemIndex = items.length === 0 ? 0 : items.length - 1;

    const lastItem = items[lastItemIndex].querySelector
      ? items[lastItemIndex].querySelector(`.${textFieldClass}`)
      : make("div", textFieldClass, { innerHTML: items[lastItemIndex].text });

    const lastItemText = lastItem.innerHTML.replace("<br>", " ").trim();
    const newItemIndex = lastItemIndex + 1;

    /**
     * Prevent checklist item generation if last item is empty and get out of block
     */
    if (currentNode === lastItem && !lastItemText) {
      const currentItem = event.target.closest(`.${itemClass}`);
      currentItem.remove();
      this._data.items = items.slice(0, items.length - 1);

      /** Insert New Block and set caret */
      const nextBlockIndex = this.api.blocks.getCurrentBlockIndex() + 1;
      this.api.blocks.insert("paragraph", {}, {}, nextBlockIndex);
      this.api.caret.setToBlock(nextBlockIndex, "start");

      event.stopPropagation();
      return;
    }

    /**
     * Create new list item
     */
    let newItem;
    switch (type) {
      case CHECKLIST: {
        newItem = this.createChecklistItem(null, newItemIndex);
        break;
      }
      case ORDERED_LIST: {
        newItem = this.createListItem(null, type, newItemIndex);
        break;
      }
      case UNORDERED_LIST: {
        newItem = this.createListItem(null, type, newItemIndex);
        break;
      }
      default: {
        console.log("wrong error type: ", type);
        return false;
      }
    }

    /**
     * Find closest list item
     */
    let currentItem = currentNode.parentNode.closest(`.${itemClass}`);
    // console.log("currentItem: ", currentItem);

    /**
     * Insert new list item as sibling to currently selected item
     */
    node.insertBefore(newItem, currentItem.nextSibling);

    /**
     * Index of newly inserted checklist item
     */
    const currentIndex = items.indexOf(currentItem) + 1;

    /**
     * Add new list item to tags array
     */
    this._data.items.splice(currentIndex, 0, newItem);
    // return false;

    /**
     * Move caret to contentEditable textField of new checklist item
     */
    moveCaretToEnd(newItem.querySelector(`.${textFieldClass}`));

    /**
     * indent if need
     */
    indentIfNeed(newItem);

    if (type === ORDERED_LIST) {
      this.rebuildOrderListIndex(node);
    }
  }

  /**
   * indent current list type
   *
   * @param {HTMLElementEvent} e
   * @param {string} listType
   * @memberof UI
   */
  onIndent(e, listType) {
    e.preventDefault();
    const ListItemEl = e.target.parentNode;

    if (e.code === "Tab") {
      this.api.toolbar.close();
      e.target.focus();

      // DEBUG
      if (canItemIndent(this._data.items, ListItemEl)) {
        indentElement(ListItemEl);

        if (listType === ORDERED_LIST) {
          setTimeout(() => this.rebuildOrderListIndex(this.element), 100);
        }
      }
      // DEBUG end
    }

    // shift && tab
    if (canItemUnIndent(ListItemEl) && e.shiftKey && e.keyCode == 9) {
      unIndentElement(ListItemEl);
      if (listType === ORDERED_LIST) {
        setTimeout(() => this.rebuildOrderListIndex(this.element), 100);
      }
    }
  }

  /**
   * fetch all the textField's data-index
   * @return void
   */
  refreshTextFieldsIndexes() {
    if (!this.element) return;
    const allTextFields = this.element.querySelectorAll(
      `.${this.CSS.listTextField}`
    );

    const textFieldsIndexes = [];
    for (let index = 0; index < allTextFields.length; index++) {
      const field = allTextFields[index];

      textFieldsIndexes.push(field.dataset.index);
    }

    this.textFieldsIndexes = textFieldsIndexes;
  }

  // label popover content
  labelPopover(item, active = "green") {
    const Wrapper = make("div", this.CSS.labelPopover);

    const Selectors = this.orgLabel.drawLabelSelectors(item, active);
    const Input = this.orgLabel.drawLabelInput(item, active);

    Wrapper.appendChild(Input);
    Wrapper.appendChild(Selectors);

    return {
      content: Wrapper,
      theme: "light",
      // delay: 200,
      trigger: "click",
      placement: "bottom",
      // allowing you to hover over and click inside them.
      interactive: true,
    };
  }

  //
  /**
   * item's hideLabel dataset value set to true or false
   * 当前 Item 的 hideLabel 标志位，需要根据初始状态，当前列表中是否已经有 Label 等状态综合判断
   *
   * @param {HTMLElement} item - GeneralListElement (ListItem or CheckListItem)
   */
  _shouldHideLabel(item) {
    if (!item) {
      return this._hasLabelInList(true) ? false : true;
    } else {
      return !!item.hideLabel;
    }
  }

  /**
   * Create Checklist items
   * @param {ChecklistData} item - data.item
   * @return {HTMLElement} checkListItem - new element of checklist
   */
  createListItem(item = null, listType = ORDERED_LIST, itemIndex = 0) {
    const prefixClass =
      listType === ORDERED_LIST
        ? this.CSS.orderListPrefix
        : this.CSS.unorderListPrefix;

    const indentClass = item ? getIndentClass(item.indent) : "";
    const listClass = [this.CSS.listItem, indentClass];

    const ListItem = make("div", listClass, {
      "data-index": itemIndex,
      "data-indent": item ? item.indent : 0,
      // "data-hideLabel": item ? !!item.hideLabel : "false",
      "data-hideLabel": this._shouldHideLabel(item),
      draggable: "true",
    });

    this._addDraggable(ListItem);
    ListItem.addEventListener("keyup", (e) => this.onIndent(e, listType));

    const TextField = make("div", this.CSS.listTextField, {
      innerHTML: item ? item.text : "",
      contentEditable: true,
    });

    TextField.addEventListener(
      "input",
      debounce(({ target }) => {
        const allTextFields = this.element.querySelectorAll(
          `.${this.CSS.listTextField}`
        );

        this.refreshTextFieldsIndexes();

        const updateIndex = findIndex(
          this.textFieldsIndexes,
          (i) => i === target.dataset.index
        );
        this._data.items[updateIndex].text = target.innerHTML;
      }, 300)
    );

    // 保留 checked 状态
    if (item && item.checked) {
      ListItem.dataset.checked = true;
    }

    const DragHandEl = make("div", this.CSS.listDragIcon, {
      innerHTML:
        '<svg t="1609572080769" width="12px" height="12px" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4278" width="200" height="200"><path d="M553.13 98.512l87.565 73.476c13.538 11.36 15.304 31.545 3.944 45.083l-7.713 9.192c-11.36 13.539-31.544 15.305-45.083 3.945L548 193.419v282.58h282.58l-36.79-43.844c-11.36-13.538-9.593-33.722 3.945-45.082l9.193-7.714c13.538-11.36 33.722-9.594 45.082 3.944l73.47 87.558c19.964 23.792 19.964 58.484 0 82.276l-73.47 87.558c-11.246 13.403-31.141 15.268-44.674 4.281l-0.408-0.337-9.193-7.713c-13.538-11.36-15.304-31.544-3.944-45.083L830.58 548H548v282.58l43.843-36.788c13.539-11.36 33.723-9.594 45.083 3.944l7.713 9.193c11.247 13.403 9.628 33.32-3.541 44.739l-0.403 0.343-87.558 73.47c-23.792 19.964-58.484 19.964-82.276 0l-87.558-73.47c-13.538-11.36-15.304-31.544-3.944-45.082l7.714-9.193c11.246-13.403 31.141-15.268 44.674-4.281l0.408 0.337L476 830.58V547.999H193.418l36.79 43.844c11.246 13.403 9.628 33.32-3.542 44.74l-0.403 0.343-9.192 7.713c-13.403 11.247-33.32 9.628-44.74-3.541l-0.343-0.403-73.469-87.558c-19.964-23.792-19.964-58.484 0-82.276l73.47-87.558c11.36-13.538 31.544-15.304 45.082-3.944l9.192 7.714c13.404 11.246 15.269 31.14 4.282 44.674l-0.338 0.408-36.79 43.844H476V193.366l-43.905 36.841c-13.403 11.247-33.32 9.63-44.739-3.54l-0.343-0.404-7.714-9.192c-11.251-13.4-9.633-33.316 3.537-44.735l0.403-0.344c0.001-0.001 0.003-0.002 0.008 0.001l87.616-73.489c23.792-19.956 58.478-19.953 82.267 0.008z" p-id="4279"></path></svg>',
    });

    const PrefixEl = make("div", prefixClass);
    ListItem.appendChild(DragHandEl);
    ListItem.appendChild(PrefixEl);

    const { need, LabelEl } = this._appendLabelIfNeed(item, itemIndex);
    if (need) {
      ListItem.appendChild(LabelEl);
      tippy(LabelEl, this.labelPopover(ListItem));
    }

    ListItem.appendChild(TextField);
    return ListItem;
  }

  /**
   * Create Checklist items
   * @param {ChecklistData} item - data.item
   * @return {HTMLElement} checkListItem - new element of checklist
   */
  createChecklistItem(item = null, itemIndex = 0) {
    const indentClass = item ? getIndentClass(item.indent) : "";
    const listClass = [this.CSS.checklistItem, indentClass];

    const ListItem = make("div", listClass, {
      "data-index": itemIndex,
      "data-indent": item ? item.indent : 0,
      "data-hideLabel": this._shouldHideLabel(item),
      draggable: "true",
    });

    this._addDraggable(ListItem);
    ListItem.addEventListener("keyup", (e) => this.onIndent(e));

    const Checkbox = this._drawCheckBox();
    const TextField = make("div", this.CSS.checklistTextField, {
      innerHTML: item ? item.text : "",
      contentEditable: true,
    });

    TextField.addEventListener(
      "input",
      debounce(({ target }) => {
        this._data.items[itemIndex].text = target.innerHTML;
      })
    );

    if (item && item.checked) {
      Checkbox.classList.add(this.CSS.checklistBracketCheckSignChecked);
      ListItem.classList.add(this.CSS.checklistItemChecked);
      this._data.items[itemIndex].checked = true;
      ListItem.dataset.checked = true;
    }

    const DragHandEl = make("div", this.CSS.listDragIcon, {
      innerHTML:
        '<svg t="1609572080769" width="12px" height="12px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4278" width="200" height="200"><path d="M553.13 98.512l87.565 73.476c13.538 11.36 15.304 31.545 3.944 45.083l-7.713 9.192c-11.36 13.539-31.544 15.305-45.083 3.945L548 193.419v282.58h282.58l-36.79-43.844c-11.36-13.538-9.593-33.722 3.945-45.082l9.193-7.714c13.538-11.36 33.722-9.594 45.082 3.944l73.47 87.558c19.964 23.792 19.964 58.484 0 82.276l-73.47 87.558c-11.246 13.403-31.141 15.268-44.674 4.281l-0.408-0.337-9.193-7.713c-13.538-11.36-15.304-31.544-3.944-45.083L830.58 548H548v282.58l43.843-36.788c13.539-11.36 33.723-9.594 45.083 3.944l7.713 9.193c11.247 13.403 9.628 33.32-3.541 44.739l-0.403 0.343-87.558 73.47c-23.792 19.964-58.484 19.964-82.276 0l-87.558-73.47c-13.538-11.36-15.304-31.544-3.944-45.082l7.714-9.193c11.246-13.403 31.141-15.268 44.674-4.281l0.408 0.337L476 830.58V547.999H193.418l36.79 43.844c11.246 13.403 9.628 33.32-3.542 44.74l-0.403 0.343-9.192 7.713c-13.403 11.247-33.32 9.628-44.74-3.541l-0.343-0.403-73.469-87.558c-19.964-23.792-19.964-58.484 0-82.276l73.47-87.558c11.36-13.538 31.544-15.304 45.082-3.944l9.192 7.714c13.404 11.246 15.269 31.14 4.282 44.674l-0.338 0.408-36.79 43.844H476V193.366l-43.905 36.841c-13.403 11.247-33.32 9.63-44.739-3.54l-0.343-0.404-7.714-9.192c-11.251-13.4-9.633-33.316 3.537-44.735l0.403-0.344c0.001-0.001 0.003-0.002 0.008 0.001l87.616-73.489c23.792-19.956 58.478-19.953 82.267 0.008z" p-id="4279"></path></svg>',
    });

    ListItem.appendChild(DragHandEl);
    ListItem.appendChild(Checkbox);

    const { need, LabelEl } = this._appendLabelIfNeed(item, itemIndex);
    if (need) {
      ListItem.appendChild(LabelEl);
      tippy(LabelEl, this.labelPopover(ListItem));
    }

    ListItem.appendChild(TextField);

    return ListItem;
  }

  _drawCheckBox() {
    const LeftBracket = make("div", this.CSS.checklistBracket, {
      innerHTML:
        '<svg t="1592048015933" width="15px" height="15px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2908" width="200" height="200"><path d="M430.08 204.8h163.84v81.92H512v450.56h81.92v81.92H430.08z" p-id="2909"></path></svg>',
    });
    const CheckSign = make("div", this.CSS.checklistBracketCheckSign, {
      innerHTML:
        '<svg t="1592049095081" width="20px" height="20px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9783" width="200" height="200"><path d="M853.333333 256L384 725.333333l-213.333333-213.333333" p-id="9784"></path></svg>',
      // must set this contentEditable, this is a workaround for editorjs's plus icon apear and jumpy
      // 这里必须设置 contentEditable, 否则 editorjs 的增加按钮会闪现
      contentEditable: true,
    });

    const RightBracket = make("div", this.CSS.checklistBracketRight, {
      innerHTML:
        '<svg t="1592048041260" width="15px" height="15px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3043" width="200" height="200"><path d="M593.92 204.8H430.08v81.92h81.92v450.56H430.08v81.92h163.84z" p-id="3044"></path></svg>',
    });

    const Checkbox = make("div", this.CSS.checklistBox);
    Checkbox.appendChild(LeftBracket);
    Checkbox.appendChild(CheckSign);
    Checkbox.appendChild(RightBracket);

    return Checkbox;
  }

  /**
   * add drag ability to list item (include checklist item)
   * see example: https://www.javascripttutorial.net/web-apis/javascript-drag-and-drop/
   * @param {HTMLElement} listItem
   * @memberof UI
   */
  _addDraggable(ListItem) {
    ListItem.addEventListener("dragstart", (e) => {
      const familyTree = getFamilyTree(e.target);
      // add drag-start css to all children
      familyTree.forEach((item) => {
        this.draggingElements.push(item.cloneNode(true));
        item.classList.add(this.CSS.listDragStart);
        item.setAttribute("data-delete-sign", true);
      });

      this.draggingFamilyTreeItems = familyTree;
    });

    ListItem.addEventListener("dragenter", (e) => {
      e.preventDefault();
      e.target.classList.remove(this.CSS.listDragOver);
    });

    ListItem.addEventListener("dragover", (e) => {
      e.preventDefault();

      const itemClass = this.CSS.listItem;
      // 确保 item 作为一个整体，否则 drag-over 可能添加到 label 或者 prefix 上
      const ItemEl = clazz.has(e.target, itemClass)
        ? e.target
        : e.target.parentNode;

      ItemEl.classList.add(this.CSS.listDragOver);
    });

    ListItem.addEventListener("dragleave", (e) => {
      const itemClass = this.CSS.listItem;
      const ItemEl = clazz.has(e.target, itemClass)
        ? e.target
        : e.target.parentNode;

      ItemEl.classList.remove(this.CSS.listDragOver);
    });

    ListItem.addEventListener("drop", (e) => {
      const itemClass = this.CSS.listItem;
      const ItemEl = clazz.has(e.target, itemClass)
        ? e.target
        : e.target.parentNode;

      ItemEl.classList.remove(this.CSS.listDragOver);

      //跳过目标 item 的所有 children
      const targetIndex = findNextSameIndentLevelIndex(
        ItemEl,
        this._data.items
      );

      const insertIndex = findIndex(
        this._data.items,
        (item) => item.dataset.index === targetIndex
      );

      const dropElIndent = parseInt(ItemEl.dataset.indent);
      const dragParentElIndent = parseInt(
        this.draggingElements[0].dataset.indent
      );

      const indentOffset = dragParentElIndent - dropElIndent;

      this.draggingElements.reverse();
      this.draggingElements.forEach((item) => {
        const curElIndent = parseInt(item.dataset.indent);
        const draggedIndent = Math.min(
          MAX_INDENT_LEVEL,
          curElIndent - indentOffset
        );

        // 如果超出最大缩进，就按照最大缩进设置
        item.setAttribute("data-indent", draggedIndent);

        this._data.items.splice(insertIndex, 0, item);
        item.classList.remove(this.CSS.listDragStart);
      });

      this._data.items = this._data.items.filter(
        (item) => !Boolean(item.dataset.deleteSign)
      );

      this.setTune(this._data.type, this.exportData(), this.sortType);
      this.draggingElements = [];
    });

    ListItem.addEventListener("dragend", (e) => {
      e.target.classList.remove(this.CSS.listDragStart);
      e.target.classList.remove(this.CSS.listDragOver);

      this.draggingFamilyTreeItems.forEach((item) => {
        item.classList.remove(this.CSS.listDragStart);
        item.setAttribute("data-delete-sign", false);
      });
    });
  }

  /**
   * is the Label Element should add to current LitItem
   * 根据当前列表项是否需要添加 Label 前缀，如果是在不同 ListType 之间切换，则需要控制 Label 的显示以便保留 Label 相关状态
   *
   * @param { HTMLElement } item - GeneralListElement (ListItem or CheckListItem)
   * @param { Number } itemIndex - index of current list item
   * @return {{ need: boolean, LabelEl: HTMLElement | null }}
   */
  _appendLabelIfNeed(item, itemIndex) {
    const labelState = this.getInitLabelState(item);

    if (labelState.hasLabel) {
      const Label = make("div", labelState.labelClass, {
        innerHTML: labelState.label,
        "data-index": itemIndex,
      });

      // NOTE: this only works on existed item, if item is null, means new insert
      if (item) {
        // hide or show label
        !item.hideLabel
          ? (Label.style.display = "block")
          : (Label.style.display = "none");
      } else {
        this._hasLabelInList(true)
          ? (Label.style.display = "block")
          : (Label.style.display = "none");
      }

      return { need: true, LabelEl: Label };
    }
    return { need: false, LabelEl: null };
  }

  /**
   * Toggle checklist item state
   * @param event
   */
  toggleCheckbox(event) {
    const CheckListItem = event.target.closest(`.${this.CSS.checklistItem}`);
    // null means clicked label selector, just ignore it
    if (!CheckListItem) return false;

    const Checkbox = CheckListItem.querySelector(`.${this.CSS.checklistBox}`);

    const itemIndex = CheckListItem.dataset.index;
    if (Checkbox.contains(event.target)) {
      const curCheckState = this._data.items[itemIndex].checked;
      this._data.items[itemIndex].checked = !curCheckState;
      // 当切换到非 checklist 的时候保留切换状态
      Checkbox.classList.toggle(this.CSS.checklistBracketCheckSignChecked);
      CheckListItem.classList.toggle(this.CSS.checklistItemChecked);
      CheckListItem.dataset.checked = !curCheckState;
    }
  }

  /**
   * rebuild the order list index
   * @param {HTMLElement} node
   * @memberof UI
   */
  rebuildOrderListIndex(node) {
    for (let index = 0; index < this.VALID_INDENT_LEVELS.length; index++) {
      const level = this.VALID_INDENT_LEVELS[index];

      const blocks = parseIndentBlocks(node, level);
      setOrderListPrefixItem(level, blocks);
    }
  }

  /**
   * Handle backspace
   * @param {KeyboardEvent} event
   */
  backspace(event, type = UNORDERED_LIST) {
    const textFieldClass = this.getCSS(type, "textField");
    const itemClass = this.getCSS(type, "item");

    const currentItem = event.target.closest(`.${itemClass}`);
    const currentIndex = this._data.items.indexOf(currentItem);
    const currentItemText = currentItem
      .querySelector(`.${textFieldClass}`)
      .innerHTML.replace("<br>", " ")
      .trim();

    const DomList = this._data.items.filter((item) => isDOM(item));
    const firstItem = DomList[0];
    const firstItemText = firstItem
      .querySelector(`.${textFieldClass}`)
      .innerHTML.replace("<br>", " ")
      .trim();

    if (!firstItemText) {
      event.preventDefault();
      currentItem.remove();
      return;
    }

    /**
     * If not first checklist item and item has no text
     */
    if (currentIndex && !currentItemText) {
      event.preventDefault();
      currentItem.remove();

      if (type === ORDERED_LIST) {
        setTimeout(() => this.rebuildOrderListIndex(this.element), 100);
      }

      /**
       * Delete checklist item from tags array
       */
      this._data.items.splice(currentIndex, 1);

      /**
       * After deleting the item, move move caret to previous item if it exists
       */
      if (this._data.items[currentIndex - 1] !== "undefined") {
        moveCaretToEnd(
          this._data.items[currentIndex - 1].querySelector(`.${textFieldClass}`)
        );
      }
    }
  }

  /**
   * render Setting buttons
   * @public
   */
  renderSettings() {
    const Wrapper = make("div");

    this.settings.forEach((item) => {
      const itemEl = make("div", this.CSS.settingsButton, {
        innerHTML: item.icon,
      });

      if (item.name !== SORT) {
        this.api.tooltip.onHover(itemEl, item.title, { placement: "top" });
      }

      if (this._data.type === item.name) {
        itemEl.classList.add(this.CSS.settingsButtonActive);
      }

      if (item.name === ORG_MODE && this._hasLabelInList(true)) {
        itemEl.classList.add(this.CSS.settingsButtonActive);
      }

      if (item.name === SORT) {
        const curSortTypeIndex = SORT_ENUM.indexOf(this.sortType);
        const nextSortTypeIndex =
          curSortTypeIndex >= SORT_ENUM.length - 1 ? 0 : curSortTypeIndex + 1;
        const nextSortType = SORT_ENUM[nextSortTypeIndex];

        this.api.tooltip.onHover(itemEl, item[nextSortType], {
          placement: "top",
        });
        this._hasLabelInList(true)
          ? (itemEl.style.visibility = "visible")
          : (itemEl.style.visibility = "hidden");

        if (nextSortType === SORT_DOWN) {
          itemEl.classList.add(this.CSS.settingsButtonRotate);
        }

        if (nextSortType === SORT_DEFAULT) {
          itemEl.classList.add(this.CSS.settingsButtonActive);
        }
      }

      itemEl.addEventListener("click", () => {
        this.setTune(item.name, this.exportData(), this.sortType);

        this.clearSettingHighlight(Wrapper);
        // mark active
        itemEl.classList.toggle(this.CSS.settingsButtonActive);
      });

      Wrapper.appendChild(itemEl);
    });

    return Wrapper;
  }

  // set sort icon type in settings menu
  setSortType(type) {
    this.sortType = type;
  }

  // TODO:  use utils function
  /**
   * clear highlight for all settings
   * @private
   */
  clearSettingHighlight(node) {
    // clear other buttons
    const buttons = node.querySelectorAll("." + this.CSS.settingsButton);
    Array.from(buttons).forEach((button) =>
      button.classList.remove(this.CSS.settingsButtonActive)
    );
  }

  // parse item's innerHTML as content
  _parseContent(item) {
    const textFieldClass = this.getCSS(this._data.type, "textField");
    return item.querySelector(`.${textFieldClass}`).innerHTML;
  }

  // parse label type
  _parseLabelType(item) {
    if (item.querySelector(`.${this.CSS.labelGreen}`)) return LABEL_TYPE.GREEN;
    if (item.querySelector(`.${this.CSS.labelRed}`)) return LABEL_TYPE.RED;
    if (item.querySelector(`.${this.CSS.labelWarn}`)) return LABEL_TYPE.WARN;
    if (item.querySelector(`.${this.CSS.labelDefault}`))
      return LABEL_TYPE.DEFAULT;

    return null;
  }

  // parse label info
  _parseLabel(item) {
    const label = item.querySelector(`.${this.CSS.listLabel}`);
    if (label) return label.innerText;

    return null;
  }

  // parse checked or not
  _parseCheck(item) {
    if (item.dataset.checked && item.dataset.checked === "true") {
      return true;
    }

    return false;
  }

  exportData() {
    const data = {};
    data.type = this._data.type;
    const items = [];

    for (let index = 0; index < this._data.items.length; index += 1) {
      const item = this._data.items[index];

      if (isDOM(item)) {
        items.push({
          text: this._parseContent(item),
          label: this._parseLabel(item),
          labelType: this._parseLabelType(item),
          checked: this._parseCheck(item),
          hideLabel: item.dataset.hidelabel === "true" ? true : false, // NOTE:  dataset is not case sensitive
          indent: parseInt(item.dataset.indent) || 0,
        });
      }
    }

    // console.log("# exportData: ", items);
    data.items = items;
    return data;
  }

  get data() {
    const data = this.exportData();

    this.setData(data);
    return data;
  }
}
