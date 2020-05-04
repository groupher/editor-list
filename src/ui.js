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
import LN from "./LN";
import iconList from "./icons";

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

    // all the textField's data-index array
    this.textFieldsIndexes = [];

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
      settingsWrapper: "cdx-custom-settings",
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,

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
      checklistTextField: "cdx-checklist__item-text",

      // label
      labelPopover: "label-popover",
    };
  }

  getCSS(type, key) {
    const N = {
      [LN.UNORDERED_LIST]: {
        textField: "listTextField",
        item: "listItem",
      },
      [LN.ORDERED_LIST]: {
        textField: "listTextField",
        item: "listItem",
      },
      [LN.CHECKLIST]: {
        textField: "checklistTextField",
        item: "checklistItem",
      },
    };

    return this.CSS[N[type][key]];
  }

  // get init label state when editor load
  getInitLabelState(item) {
    const labelClassMap = {
      green: [this.CSS.listLabel, this.CSS.labelGreen],
      red: [this.CSS.listLabel, this.CSS.labelRed],
      warn: [this.CSS.listLabel, this.CSS.labelWarn],
      default: [this.CSS.listLabel, this.CSS.labelDefault],
    };

    // console.log("# -> getInitLabelState this._date.items: ", this._data.items);
    let hasLabelInGroup = false;
    for (let index = 0; index < this._data.items.length; index++) {
      const element = this._data.items[index];
      // console.log("is current element: ", element);
      if (isDOM(element) && element.querySelector(`.${this.CSS.listLabel}`)) {
        hasLabelInGroup = true;
      }
    }

    // 当插入新行的时候需要判断是否其他的行已经有 label, 如果有的话返回默认的 label
    if (!item) {
      return hasLabelInGroup
        ? {
            hasLabel: true,
            label: "default",
            labelClass: labelClassMap["default"],
          }
        : { hasLabel: false };
    }
    // console.log("# -> getInitLabelState: ", item);
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
  buildList(data, listType = LN.UNORDERED_LIST) {
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

    if (listType === LN.ORDERED_LIST) {
      setTimeout(() => this.rebuildListIndex(Wrapper), 100);
    }

    this.bindKeyDownEvent(Wrapper, listType);

    this.element = Wrapper;
    this.orgLabel.setElement(this.element);
    return Wrapper;
  }

  // 待办项
  buildCheckList(data) {
    this._data = data;
    // console.log("buildCheckList data: ", data);
    this._data.items = this.dropEmptyItem(data.items);
    const Wrapper = make("div", [this.CSS.baseBlock, this.CSS.listWrapper]);

    if (data.items.length) {
      this._data = { items: [{}], type: LN.CHECKLIST };

      data.items.forEach((item, index) => {
        const NewItem = this.createChecklistItem(item, index);

        this._data.items.push(NewItem);
        Wrapper.appendChild(NewItem);
      });
      console.log("-> after build: ", this._data.items);
    } else {
      const NewItem = this.createChecklistItem(null);

      this._data.items.push(NewItem);
      Wrapper.appendChild(NewItem);
    }

    this.bindKeyDownEvent(Wrapper, LN.CHECKLIST);

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
     * Prevent checklist item generation if last item is empty and get out of checklist
     */
    if (currentNode === lastItem && !lastItemText) {
      // TODO:  extract goOutOfItem

      /** Insert New Block and set caret */
      const currentItem = event.target.closest(`.${itemClass}`);
      currentItem.remove();
      this._data.items = items.slice(0, items.length - 1);

      const nextBlockIndex = this.api.blocks.getCurrentBlockIndex() + 1;
      this.api.blocks.insert("paragraph", {}, {}, nextBlockIndex);
      this.api.caret.setToBlock(nextBlockIndex, "start");

      event.stopPropagation();
      return;
    }

    /**
     * Create new checklist item
     */
    let newItem;
    switch (type) {
      case LN.CHECKLIST: {
        newItem = this.createChecklistItem(null, newItemIndex);
        break;
      }
      case LN.ORDERED_LIST: {
        newItem = this.createListItem(null, type, newItemIndex);
        break;
      }
      case LN.UNORDERED_LIST: {
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

    if (type === LN.ORDERED_LIST) {
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

  // popover content
  labelPopover(item, active = "green") {
    const Wrapper = make("div", this.CSS.labelPopover);

    const Selectors = this.orgLabel.buildLabelSelectors(item, active);
    const Input = this.orgLabel.buildLabelInput(item, active);

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

  /**
   * Create Checklist items
   * @param {ChecklistData} item - data.item
   * @return {HTMLElement} checkListItem - new element of checklist
   */
  createListItem(item = null, listType = LN.ORDERED_LIST, itemIndex = 0) {
    const prefixClass =
      listType === LN.ORDERED_LIST
        ? this.CSS.orderListPrefix
        : this.CSS.unorderListPrefix;

    const ListItem = make("div", this.CSS.listItem);
    const Prefix = make("span", prefixClass);

    const TextField = make("div", this.CSS.listTextField, {
      innerHTML: item ? item.text : "",
      "data-index": itemIndex,
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

    let Label = null;
    const labelState = this.getInitLabelState(item);

    if (labelState.hasLabel) {
      Label = make("div", labelState.labelClass, {
        innerHTML: labelState.label,
        "data-index": itemIndex,
      });
    }

    ListItem.appendChild(Prefix);
    if (labelState.hasLabel) {
      ListItem.appendChild(Label);
      tippy(Label, this.labelPopover(ListItem));
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
    });
    const Checkbox = make("div", this.CSS.checklistBox);
    const TextField = make("div", this.CSS.checklistTextField, {
      innerHTML: item ? item.text : "",
      contentEditable: true,
    });

    if (item && item.checked) {
      ListItem.classList.add(this.CSS.checklistItemChecked);
      this._data.items[itemIndex].checked = true;
    }

    let Label = null;
    const labelState = this.getInitLabelState(item);

    if (labelState.hasLabel) {
      Label = make("div", labelState.labelClass, {
        innerHTML: labelState.label,
        "data-index": itemIndex,
      });
    }

    TextField.addEventListener("input", (ev) => {
      this._data.items[itemIndex].text = ev.target.innerHTML;
    });

    ListItem.appendChild(Checkbox);
    if (labelState.hasLabel) {
      ListItem.appendChild(Label);
      tippy(Label, this.labelPopover(ListItem));
    }
    ListItem.appendChild(TextField);

    return ListItem;
  }

  /**
   * Toggle checklist item state
   * @param event
   */
  toggleCheckbox(event) {
    const checkListItem = event.target.closest(`.${this.CSS.checklistItem}`);
    // null means clicked label selector, just ignore it
    if (!checkListItem) return false;

    const checkbox = checkListItem.querySelector(`.${this.CSS.checklistBox}`);

    const itemIndex = checkListItem.dataset.index;
    if (checkbox.contains(event.target)) {
      const curCheckState = this._data.items[itemIndex].checked;
      this._data.items[itemIndex].checked = !curCheckState;
      checkListItem.classList.toggle(this.CSS.checklistItemChecked);
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
  backspace(event, type = LN.UNORDERED_LIST) {
    const textFieldClass = this.getCSS(type, "textField");
    const itemClass = this.getCSS(type, "item");

    const currentItem = event.target.closest(`.${itemClass}`);
    const currentIndex = this._data.items.indexOf(currentItem);
    const currentItemText = currentItem
      .querySelector(`.${textFieldClass}`)
      .innerHTML.replace("<br>", " ")
      .trim();
    const firstItem = this._data.items[0];
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
    const Wrapper = make("div", [this.CSS.settingsWrapper], {});

    // this.clearSettingHighlight();
    this.settings.forEach((item) => {
      const itemEl = make("div", this.CSS.settingsButton, {
        innerHTML: item.icon,
      });

      this.api.tooltip.onHover(itemEl, item.title, { placement: "top" });

      if (this._data.type === item.name) {
        itemEl.classList.add(this.CSS.settingsButtonActive);
      }

      itemEl.addEventListener("click", () => {
        this.setTune(item.name);

        this.clearSettingHighlight(Wrapper);
        // mark active
        itemEl.classList.toggle(this.CSS.settingsButtonActive);
      });

      Wrapper.appendChild(itemEl);
    });

    return Wrapper;
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
  parseContent(item) {
    const textFieldClass = this.getCSS(this._data.type, "textField");
    return item.querySelector(`.${textFieldClass}`).innerHTML;
  }

  // parse label type
  parseLabelType(item) {
    if (item.querySelector(`.${this.CSS.labelGreen}`)) return "green";
    if (item.querySelector(`.${this.CSS.labelRed}`)) return "red";
    if (item.querySelector(`.${this.CSS.labelWarn}`)) return "warn";
    if (item.querySelector(`.${this.CSS.labelDefault}`)) return "default";

    return null;
  }

  // parse label info
  parseLabel(item) {
    const label = item.querySelector(`.${this.CSS.listLabel}`);
    if (label) return label.innerText;

    return null;
  }

  // parse checked or not
  parseCheck(item) {
    if (item.className.indexOf(this.CSS.checklistItemChecked) >= 0) {
      return true;
    }

    return false;
  }

  get data() {
    const data = {};
    data.type = this._data.type;
    const items = [];

    for (let index = 0; index < this._data.items.length; index += 1) {
      const item = this._data.items[index];

      if (isDOM(item)) {
        items.push({
          text: this.parseContent(item),
          label: this.parseLabel(item),
          labelType: this.parseLabelType(item),
          checked: this.parseCheck(item),
        });
      }
    }
    data.items = items;
    console.log("before up: ", data.items);
    this.setData(data);

    return data;
  }
}
