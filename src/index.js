import { make } from "@groupher/editor-utils";

import "./index.css";
import Ui from "./ui";

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
      title: this.i18n === "en" ? "List" : "列表类"
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
    this.elements = {
      wrapper: null
    };

    /**
     * Tool's data
     * @type {ListData}
     * */
    this._data = {
      type: "unordered",
      items: []
    };

    this.api = api;
    this.i18n = config.i18n || "en";
    // this.data = data;

    /**
     * Module for working with UI
     */
    this.ui = new Ui({
      api,
      config: this.config,
      data: this._data,
      setTune: this.setTune.bind(this)
    });
  }

  // handle setting option change
  setTune(type) {
    console.log("setTune type: ", type);
    // console.log("setTune this.elements: ", this.elements.wrapper);

    // this._data.type = type;
    this.ui.setType(type);
    switch (type) {
      case "unordered": {
        const unorderedList = this.ui.buildNormalList(
          this._data.items,
          "unordered"
        );

        this.replaceElement(unorderedList);
        return false;
      }
      case "ordered": {
        const orderedList = this.ui.buildNormalList(
          this._data.items,
          "ordered"
        );

        this.replaceElement(orderedList);
        return false;
      }
      default:
        return;
    }
  }

  /**
   * replace element wrapper with new html element
   * @param {HTMLElement} node
   */
  replaceElement(node) {
    this.elements.wrapper.replaceWith(node);
    this.elements.wrapper = node;

    this.bindKeyDown(this.elements.wrapper);

    this.api.tooltip.hide();
    this.api.toolbar.close();
  }

  bindKeyDown(node) {
    // detect keydown on the last item to escape List
    node.addEventListener(
      "keydown",
      event => {
        const [ENTER] = [13]; // key codes

        switch (event.keyCode) {
          case ENTER:
            this.getOutOfList(event);
            break;
        }
      },
      false
    );
  }

  /**
   * Returns list tag with items
   * @return {Element}
   * @public
   */
  render() {
    this.elements.wrapper = this.ui.buildNormalList(
      this._data.items,
      "unordered"
    );

    this.bindKeyDown(this.elements.wrapper);

    return this.elements.wrapper;
  }

  /**
   * @return {ListData}
   * @public
   */
  save() {
    return this.data;
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
      export: data => {
        return data.items.join(". ");
      },
      /**
       * To create a list from other block's string, just put it at the first item
       * @param string
       * @return {ListData}
       */
      import: string => {
        return {
          items: [string],
          type: "unordered"
        };
      }
    };
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      type: {},
      items: {
        br: true
      }
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
      baseBlock: this.api.styles.block,
      wrapper: "cdx-list",
      wrapperOrdered: "cdx-list--ordered",
      wrapperUnordered: "cdx-list--unordered",
      listItem: "cdx-list__item"
    };
  }

  /**
   * List data setter
   * @param {ListData} listData
   */
  set data(listData) {
    if (!listData) {
      listData = {};
    }

    this._data.type =
      listData.type ||
      this.ui.settings.find(tune => tune.default === true).name;
    this._data.items = listData.items || [];

    const oldView = this.elements.wrapper;

    if (oldView) {
      oldView.parentNode.replaceChild(this.render(), oldView);
    }
  }

  /**
   * Return List data
   * @return {ListData}
   */
  get data() {
    this._data.items = [];

    const items = this.elements.wrapper.querySelectorAll(
      `.${this.CSS.listItem}`
    );

    for (let i = 0; i < items.length; i++) {
      const value = items[i].innerHTML.replace("<br>", " ").trim();

      if (value) {
        this._data.items.push(items[i].innerHTML);
      }
    }

    return this._data;
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
