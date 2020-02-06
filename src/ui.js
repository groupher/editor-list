import { make } from "@groupher/editor-utils";

import iconList from "./icons";

export default class Ui {
  constructor({ api, config }) {
    this.api = api;
    this.config = config;

    this._data = {};
    this.element = null;

    this.settings = iconList;
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
      wrapperOrdered: "cdx-list--ordered",
      wrapperUnordered: "cdx-list--unordered",
      listItem: "cdx-list__item"
    };
  }

  // 标准 ul/list 类条目
  buildNormalList(items, type = "unordered") {
    const WRAPPER_TAG = "ul";

    const listClass =
      type === "ordered" ? this.CSS.wrapperOrdered : this.CSS.wrapperUnordered;

    const wrapper = make(
      WRAPPER_TAG,
      [this.CSS.baseBlock, this.CSS.listWrapper, listClass],
      {
        contentEditable: true
      }
    );

    // fill with data
    if (items.length) {
      items.forEach(item => {
        wrapper.appendChild(
          make("li", this.CSS.listItem, {
            innerHTML: item
          })
        );
      });
    } else {
      wrapper.appendChild(make("li", this.CSS.listItem));
    }

    return wrapper;
  }

  /**
   * render Setting buttons
   * @public
   */
  renderSettings() {
    const wrapper = make("div", [this.CSS.settingsWrapper], {});

    this.settings.forEach(item => {
      const itemEl = make("div", this.CSS.settingsButton, {
        innerHTML: item.icon
      });

      this.api.tooltip.onHover(itemEl, item.title, { placement: "top" });

      itemEl.addEventListener("click", () => {
        this.toggleTune(item.name);

        // clear other buttons
        const buttons = itemEl.parentNode.querySelectorAll(
          "." + this.CSS.settingsButton
        );

        Array.from(buttons).forEach(button =>
          button.classList.remove(this.CSS.settingsButtonActive)
        );

        // mark active
        itemEl.classList.toggle(this.CSS.settingsButtonActive);
      });

      if (this._data.style === item.name) {
        itemEl.classList.add(this.CSS.settingsButtonActive);
      }

      wrapper.appendChild(itemEl);
    });

    return wrapper;
  }
}
