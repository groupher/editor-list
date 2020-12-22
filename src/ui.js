import tippy, { hideAll } from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";

import {
  make,
  moveCaretToEnd,
  debounce,
  findIndex,
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
} from "./constant";
import iconList from "./icons";

/**
 * @typedef {Object} ListData
 * @description Tool's input and output data format
 * @property {String} text — list item's content
 * @property {Boolean} checked — this item checked or not
 * @property {String} labelType — label type: default | red | green | warn
 * @property {String} label — label content
 * @property {Number} hideLabel - has label or not
 */

const isDOM = (el) => el instanceof Element;

export default class Ui {
  constructor({ api, data, config, setTune, setData }) {
    this.api = api;
    this.config = config;

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
      listItem: "cdx-list__item",
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
      // console.log("is current element: ", element);
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

    if (data.items.length) {
      // this._data.items = this.dropEmptyItem(data.items);
      // data.items = this.dropEmptyItem(data.items);
      this._data = { items: [], type: listType };

      data.items.forEach((item, index) => {
        const NewItem = this.createListItem(item, listType, index);

        this._data.items.push(NewItem);
        Wrapper.appendChild(NewItem);
      });
      // console.log("this._data.items: ", this._data.items);
      // this._data.items = this.dropRawItem(data.items);
      this._data.items = this.dropRawItem(this._data.items);
    } else {
      // this._data.items = this.dropEmptyItem(data.items);
      const NewItem = this.createListItem(null, listType);

      this._data.items.push(NewItem);
      Wrapper.appendChild(NewItem);
    }

    if (listType === ORDERED_LIST) {
      setTimeout(() => this.rebuildListIndex(Wrapper), 100);
    }

    this.bindKeyDownEvent(Wrapper, listType);

    this.element = Wrapper;
    this.orgLabel.setElement(this.element);
    return Wrapper;
  }

  // 待办项
  drawCheckList(data) {
    this._data = data;
    // console.log("drawCheckList data: ", data);
    this._data.items = this.dropEmptyItem(data.items);
    const Wrapper = make("div", [this.CSS.baseBlock, this.CSS.listWrapper]);

    if (data.items.length) {
      this._data = { items: [{}], type: CHECKLIST };

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
    // console.log("items: ", items);
    // console.log("this._data.items: ", this._data.items);

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

    if (type === ORDERED_LIST) {
      this.rebuildListIndex(node);
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

    const ListItem = make("div", this.CSS.listItem, {
      "data-index": itemIndex,
      // "data-hideLabel": item ? !!item.hideLabel : "false",
      "data-hideLabel": this._shouldHideLabel(item),
    });
    const Prefix = make("div", prefixClass);

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

    ListItem.appendChild(Prefix);

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
    const ListItem = make("div", this.CSS.checklistItem, {
      "data-index": itemIndex,
      "data-hideLabel": this._shouldHideLabel(item),
    });

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
        '<svg t="1592048015933" width="15px" height="15px" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2908" width="200" height="200"><path d="M430.08 204.8h163.84v81.92H512v450.56h81.92v81.92H430.08z" p-id="2909"></path></svg>',
    });
    const CheckSign = make("div", this.CSS.checklistBracketCheckSign, {
      innerHTML:
        '<svg t="1592049095081" width="20px" height="20px" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9783" width="200" height="200"><path d="M853.333333 256L384 725.333333l-213.333333-213.333333" p-id="9784"></path></svg>',
      // must set this contentEditable, this is a workaround for editorjs's plus icon apear and jumpy
      // 这里必须设置 contentEditable, 否则 editorjs 的增加按钮会闪现
      contentEditable: true,
    });

    const RightBracket = make("div", this.CSS.checklistBracketRight, {
      innerHTML:
        '<svg t="1592048041260" width="15px" height="15px" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3043" width="200" height="200"><path d="M593.92 204.8H430.08v81.92h81.92v450.56H430.08v81.92h163.84z" p-id="3044"></path></svg>',
    });

    const Checkbox = make("div", this.CSS.checklistBox);
    Checkbox.appendChild(LeftBracket);
    Checkbox.appendChild(CheckSign);
    Checkbox.appendChild(RightBracket);

    return Checkbox;
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

  rebuildListIndex(node) {
    const indexElements = node.parentNode.querySelectorAll(
      "." + this.CSS.orderListPrefix
    );

    Array.from(indexElements).forEach((item, index) => {
      item.innerHTML = `${index + 1}.`;
    });
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
        });
      }
    }

    data.items = items;
    return data;
  }

  get data() {
    const data = this.exportData();

    this.setData(data);
    return data;
  }
}
