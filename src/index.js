import { make } from "@groupher/editor-utils";

import "./index.css";
import Ui from "./ui";

/**
 * @typedef {object} ListData
 * @property {string} style - can be ordered or unordered
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
    this._elements = {
      wrapper: null
    };

    /**
     * Module for working with UI
     */
    this.ui = new Ui({
      api,
      config: this.config
    });

    /**
     * Tool's data
     * @type {ListData}
     * */
    this._data = {
      style: this.ui.settings.find(tune => tune.default === true).name,
      items: []
    };

    this.api = api;
    this.i18n = config.i18n || "en";
    this.data = data;
  }

  /**
   * Returns list tag with items
   * @return {Element}
   * @public
   */
  render() {
    const style =
      this._data.style === "ordered"
        ? this.CSS.wrapperOrdered
        : this.CSS.wrapperUnordered;

    this._elements.wrapper = make(
      "ul",
      [this.CSS.baseBlock, this.CSS.wrapper, style],
      {
        contentEditable: true
      }
    );

    // fill with data
    if (this._data.items.length) {
      this._data.items.forEach(item => {
        this._elements.wrapper.appendChild(
          make("li", this.CSS.item, {
            innerHTML: item
          })
        );
      });
    } else {
      this._elements.wrapper.appendChild(make("li", this.CSS.item));
    }

    // detect keydown on the last item to escape List
    this._elements.wrapper.addEventListener(
      "keydown",
      event => {
        const [ENTER, BACKSPACE] = [13, 8]; // key codes

        switch (event.keyCode) {
          case ENTER:
            this.getOutofList(event);
            break;
          case BACKSPACE:
            this.backspace(event);
            break;
        }
      },
      false
    );

    return this._elements.wrapper;
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
          style: "unordered"
        };
      }
    };
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      style: {},
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
   * On paste callback that is fired from Editor
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(event) {
    const list = event.detail.data;

    this.data = this.pasteHandler(list);
  }

  /**
   * List Tool on paste configuration
   * @public
   */
  static get pasteConfig() {
    return {
      tags: ["OL", "UL", "LI"]
    };
  }

  /**
   * Toggles List style
   * @param {string} style - 'ordered'|'unordered'
   */
  toggleTune(style) {
    this._elements.wrapper.classList.toggle(
      this.CSS.wrapperOrdered,
      style === "ordered"
    );
    this._elements.wrapper.classList.toggle(
      this.CSS.wrapperUnordered,
      style === "unordered"
    );

    this._data.style = style;
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
      item: "cdx-list__item"
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

    this._data.style =
      listData.style ||
      this.ui.settings.find(tune => tune.default === true).name;
    this._data.items = listData.items || [];

    const oldView = this._elements.wrapper;

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

    const items = this._elements.wrapper.querySelectorAll(`.${this.CSS.item}`);

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
  get currentItem() {
    let currentNode = window.getSelection().anchorNode;

    if (currentNode.nodeType !== Node.ELEMENT_NODE) {
      currentNode = currentNode.parentNode;
    }

    return currentNode.closest(`.${this.CSS.item}`);
  }

  /**
   * Get out from List Tool
   * by Enter on the empty last item
   * @param {KeyboardEvent} event
   */
  getOutofList(event) {
    const items = this._elements.wrapper.querySelectorAll("." + this.CSS.item);
    /**
     * Save the last one.
     */
    if (items.length < 2) {
      return;
    }

    const lastItem = items[items.length - 1];
    const currentItem = this.currentItem;

    /** Prevent Default li generation if item is empty */
    if (currentItem === lastItem && !lastItem.textContent.trim().length) {
      /** Insert New Block and set caret */
      currentItem.parentElement.removeChild(currentItem);
      this.api.blocks.insertNewBlock();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /**
   * Handle backspace
   * @param {KeyboardEvent} event
   */
  backspace(event) {
    const items = this._elements.wrapper.querySelectorAll("." + this.CSS.item),
      firstItem = items[0];

    if (!firstItem) {
      return;
    }

    /**
     * Save the last one.
     */
    if (items.length < 2 && !firstItem.innerHTML.replace("<br>", " ").trim()) {
      event.preventDefault();
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
      currentItem = currentNode.closest("." + this.CSS.item),
      range = new Range();

    range.selectNodeContents(currentItem);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Handle UL, OL and LI tags paste and returns List data
   *
   * @param {HTMLUListElement|HTMLOListElement|HTMLLIElement} element
   * @returns {ListData}
   */
  pasteHandler(element) {
    const { tagName: tag } = element;
    let type;

    switch (tag) {
      case "OL":
        type = "ordered";
        break;
      case "UL":
      case "LI":
        type = "unordered";
    }

    const data = {
      type,
      items: []
    };

    if (tag === "LI") {
      data.items = [element.innerHTML];
    } else {
      const items = Array.from(element.querySelectorAll("LI"));

      data.items = items.map(li => li.innerHTML).filter(item => !!item.trim());
    }

    return data;
  }
}
