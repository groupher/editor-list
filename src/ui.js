import { make, moveCaretToEnd } from "@groupher/editor-utils";

import iconList from "./icons";

export default class Ui {
  constructor({ api, data, config, setTune }) {
    this.api = api;
    this.config = config;

    this._data = {};
    this.element = null;

    this.hello = "fuck";

    this.settings = iconList;
    this.setTune = setTune;
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

      // wrapperOrdered: "cdx-list--ordered",
      // wrapperUnordered: "cdx-list--unordered",

      // checklist
      checklistWrapper: "cdx-checklist",
      checklistItem: "cdx-checklist__item",
      checklistItemChecked: "cdx-checklist__item--checked",
      checklistBox: "cdx-checklist__item-checkbox",
      checklistTextField: "cdx-checklist__item-text"
    };
  }

  getCSS(type, key) {
    const N = {
      unOrderList: {
        textField: "listTextField",
        item: "listItem"
      },
      orderList: {
        textField: "listTextField",
        item: "listItem"
      },
      checklist: {
        textField: "checklistTextField",
        item: "checklistItem"
      }
    };

    return this.CSS[N[type][key]];
  }

  // 构建列表
  buildList(items, listType = "unOrderList") {
    this._data.items = items;

    const wrapper = make("div", [this.CSS.baseBlock, this.CSS.listWrapper]);

    if (this._data.items.length) {
      this._data.items.forEach(item => {
        const newItem = this.createListItem(item, listType);

        // this._elements.items.push(newItem);
        wrapper.appendChild(newItem);
      });
    } else {
      const newItem = this.createListItem(null, listType);

      this._data.items.push(newItem);
      wrapper.appendChild(newItem);
    }

    if (listType === "orderList") {
      setTimeout(() => this.rebuildListIndex(wrapper), 100);
    }

    this.bindKeyDownEvent(wrapper, listType);

    return wrapper;
  }

  // 待办项
  buildCheckList(items) {
    console.log("init items: ", items);
    this._data.items = items;

    const wrapper = make("div", [this.CSS.baseBlock, this.CSS.listWrapper]);

    if (this._data.items.length) {
      this._data.items.forEach(item => {
        const newItem = this.createChecklistItem(item);

        // this._elements.items.push(newItem);
        wrapper.appendChild(newItem);
      });
    } else {
      const newItem = this.createChecklistItem();

      this._data.items.push(newItem);
      wrapper.appendChild(newItem);
    }

    this.bindKeyDownEvent(wrapper, "checklist");

    wrapper.addEventListener("click", event => {
      this.toggleCheckbox(event);
    });

    return wrapper;
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
      event => {
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
    const lastItem = items[lastItemIndex].querySelector(`.${textFieldClass}`);
    const lastItemText = lastItem.innerHTML.replace("<br>", " ").trim();

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
      case "checklist": {
        newItem = this.createChecklistItem();
        break;
      }
      case "orderList": {
        newItem = this.createListItem(null, "orderList");
        break;
      }
      case "unOrderList": {
        newItem = this.createListItem(null, "unOrderList");
        break;
      }
      default: {
        newItem = this.createChecklistItem();
      }
    }

    /**
     * Find closest list item
     */
    let currentItem = currentNode.parentNode.closest(`.${itemClass}`);

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
    items.splice(currentIndex, 0, newItem);

    /**
     * Move caret to contentEditable textField of new checklist item
     */
    moveCaretToEnd(newItem.querySelector(`.${textFieldClass}`));

    if (type === "orderList") {
      this.rebuildListIndex(node);
    }
  }

  /**
   * Create Checklist items
   * @param {ChecklistData} item - data.item
   * @return {HTMLElement} checkListItem - new element of checklist
   */
  createListItem(item = null, listType = "orderList") {
    const prefixClass =
      listType === "orderList"
        ? this.CSS.orderListPrefix
        : this.CSS.unorderListPrefix;

    const checkListItem = make("div", this.CSS.listItem);
    const prefix = make("span", prefixClass);
    const textField = make("div", this.CSS.listTextField, {
      innerHTML: item ? item.text : "",
      contentEditable: true
    });

    // TODO:  if ordered
    // if (item.checked) {
    //   checkListItem.classList.add(this.CSS.checklistItemChecked);
    // }

    checkListItem.appendChild(prefix);
    checkListItem.appendChild(textField);

    return checkListItem;
  }

  /**
   * Create Checklist items
   * @param {ChecklistData} item - data.item
   * @return {HTMLElement} checkListItem - new element of checklist
   */
  createChecklistItem(item = {}) {
    const checkListItem = make("div", this.CSS.checklistItem);
    const checkbox = make("span", this.CSS.checklistBox);
    const textField = make("div", this.CSS.checklistTextField, {
      innerHTML: item.text ? item.text : "",
      contentEditable: true
    });

    if (item.checked) {
      checkListItem.classList.add(this.CSS.checklistItemChecked);
    }

    checkListItem.appendChild(checkbox);
    checkListItem.appendChild(textField);

    return checkListItem;
  }

  /**
   * Toggle checklist item state
   * @param event
   */
  toggleCheckbox(event) {
    const checkListItem = event.target.closest(`.${this.CSS.checklistItem}`);
    const checkbox = checkListItem.querySelector(`.${this.CSS.checklistBox}`);

    if (checkbox.contains(event.target)) {
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
  backspace(event, type = "unOrderList") {
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
    const wrapper = make("div", [this.CSS.settingsWrapper], {});

    // this.clearSettingHighlight();
    this.settings.forEach(item => {
      const itemEl = make("div", this.CSS.settingsButton, {
        innerHTML: item.icon
      });

      this.api.tooltip.onHover(itemEl, item.title, { placement: "top" });

      if (this._data.type === item.style) {
        itemEl.classList.add(this.CSS.settingsButtonActive);
      }

      itemEl.addEventListener("click", () => {
        this.setTune(item.name);

        this.clearSettingHighlight(wrapper);
        // mark active
        itemEl.classList.toggle(this.CSS.settingsButtonActive);
      });

      if (this._data.type === item.name) {
        itemEl.classList.add(this.CSS.settingsButtonActive);
      }

      wrapper.appendChild(itemEl);
    });

    return wrapper;
  }

  // TODO:  use utils function
  /**
   * clear highlight for all settings
   * @private
   */
  clearSettingHighlight(node) {
    // clear other buttons
    const buttons = node.querySelectorAll("." + this.CSS.settingsButton);
    Array.from(buttons).forEach(button =>
      button.classList.remove(this.CSS.settingsButtonActive)
    );
  }
}
