import { make } from "@groupher/editor-utils";

import "./index.css";
import Ui from "./ui";
import LN from "./LN";

/**
 * @typedef {object} ListData
 * @property {string} type - can be ordered or unordered
 * @property {array} items - li elements
 */

/**
 * List Tool for the Editor.js 2.0
 */
export default class List {
  /**
   * Allow to use native Enter behaviour
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon:
        '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
      title: this.i18n === "en" ? "List" : "列表类",
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: ListData, config: object, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   */
  constructor({ data, config, api }) {
    /**
     * HTML nodes
     * @private
     */
    this.element = null;

    /**
     * Tool's data
     * @type {ListData}
     * */
    // the default
    const defaultData = {
      type: LN.UNORDERED_LIST,
      items: [],
    };

    this._data = this.isValidListData(data) ? data : defaultData;

    this.api = api;
    this.i18n = config.i18n || "en";

    /**
     * Module for working with UI
     */
    this.ui = new Ui({
      api,
      config: this.config,
      data: this._data,
      setTune: this.setTune.bind(this),
      setData: this.setData.bind(this),
    });
  }

  // handle setting option change
  setTune(type, data) {
    // functional type
    if (type === LN.ORG_MODE || type === LN.SORT) {
      console.log("oo data: ", data.items);

      this._data.items = data.items.map((item) => {
        // console.log("each item.hideLabel: ", item.hideLabel);
        return {
          ...item,
          hideLabel: !item.hideLabel,
        };
      });

      console.log("after this._data: ", this._data.items);

      const listElement = this.buildList(this._data.type);
      this.replaceElement(listElement);

      return false;
    }

    this.ui.setType(type);
    const listElement = this.buildList(type);
    this.replaceElement(listElement);
  }

  setData(data) {
    this._data = data;
  }

  // check is the data is valid
  isValidListData(data) {
    if (!(data && data.type && data.items && Array.isArray(data.items))) {
      return false;
    }

    for (let index = 0; index < data.items.length; index++) {
      const item = data.items[index];
      if (!item.text) return false;
    }

    return (
      data.type === LN.UNORDERED_LIST ||
      data.type === LN.ORDERED_LIST ||
      data.type === LN.CHECKLIST
    );
  }

  /**
   * replace element wrapper with new html element
   * @param {HTMLElement} node
   */
  replaceElement(node) {
    this.element.replaceWith(node);
    this.element = node;

    this.api.tooltip.hide();
    this.api.toolbar.close();
  }

  /**
   * build list element for render
   * @param {string} type list type
   * @return {HTMLElement} listElement
   */
  buildList(type) {
    switch (type) {
      case LN.UNORDERED_LIST: {
        return this.ui.buildList(this._data);
      }
      case LN.ORDERED_LIST: {
        return this.ui.buildList(this._data, type);
      }
      case LN.CHECKLIST: {
        return this.ui.buildCheckList(this._data, type);
      }
      default:
        return make("div", null, { innerHTML: "wrong list type" });
    }
  }

  /**
   * Returns list tag with items
   * @return {Element}
   * @public
   */
  render() {
    const { type } = this._data;
    this.element = this.buildList(type);

    return this.element;
  }

  /**
   * @return {ListData}
   * @public
   */
  save() {
    console.log("saving data: ", this.ui.data);
    return this.ui.data; // this.data;
  }

  /**
   * Allow List Tool to be converted to/from other block
   */
  static get conversionConfig() {
    return {
      /**
       * To create exported string from list, concatenate items by dot-symbol.
       * @param {ListData} data
       * @return {string}
       */
      export: (data) => {
        // return data.items.join(". ");
        return data.items[0].text;
      },
      /**
       * To create a list from other block's string, just put it at the first item
       * @param string
       * @return {ListData}
       */
      import: (string) => {
        return {
          items: [string],
          type: "unordered",
        };
      },
    };
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      type: {},
      items: {
        br: true,
      },
    };
  }

  /**
   * Settings
   * @public
   */
  renderSettings() {
    return this.ui.renderSettings();
  }

  /**
   * Styles
   * @private
   */
  get CSS() {
    return {
      wrapper: "cdx-list",
      listItem: "cdx-list__item",
    };
  }

  /**
   * List data setter
   * @param {ListData} listData
   */
  set data(listData) {
    console.log("set data: ", listData);
    // if (!listData) {
    //   listData = {};
    // }

    // this._data.type =
    //   listData.type ||
    //   this.ui.settings.find(tune => tune.default === true).name;
    // this._data.items = listData.items || [];

    // const oldView = this.elements.wrapper;

    // if (oldView) {
    //   oldView.parentNode.replaceChild(this.render(), oldView);
    // }
  }

  /**
   * Returns current List item by the caret position
   * @return {Element}
   */
  get currentLi() {
    let currentNode = window.getSelection().anchorNode;

    if (currentNode.nodeType !== Node.ELEMENT_NODE) {
      currentNode = currentNode.parentNode;
    }

    return currentNode.closest(`.${this.CSS.listItem}`);
  }

  /**
   * Get out from List Tool
   * by Enter on the empty last item
   * @param {KeyboardEvent} event
   */
  getOutOfList(event) {
    const items = this.elements.wrapper.querySelectorAll(
      "." + this.CSS.listItem
    );
    /**
     * Save the last one.
     */
    if (items.length < 2) return;

    const lastItem = items[items.length - 1];
    const currentLi = this.currentLi;

    /** Prevent Default li generation if item is empty */
    if (currentLi === lastItem && !lastItem.textContent.trim().length) {
      /** Insert New Block and set caret */
      currentLi.parentElement.removeChild(currentLi);
      this.api.blocks.insertNewBlock();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /**
   * Select LI content by CMD+A
   * @param {KeyboardEvent} event
   */
  selectItem(event) {
    event.preventDefault();

    const selection = window.getSelection(),
      currentNode = selection.anchorNode.parentNode,
      currentLi = currentNode.closest("." + this.CSS.listItem),
      range = new Range();

    range.selectNodeContents(currentLi);

    selection.removeAllRanges();
    selection.addRange(range);
  }
}
