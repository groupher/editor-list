import { make } from "@groupher/editor-utils";

import LN from "./LN";

export default class OrgLabel {
  constructor({ api, config, element, setElement }) {
    this.api = api;
    // this.config = config;

    // this._data = null;
    this.element = null;
    // all the textField's data-index array
  }

  setElement(element) {
    this.element = element;
  }

  /**
   * CSS classes
   * @constructor
   */
  get CSS() {
    return {
      // label
      listLabel: "cdx-list-label",
      labelGreen: "cdx-list-label__green",
      labelRed: "cdx-list-label__red",
      labelWarn: "cdx-list-label__warn",
      labelDefault: "cdx-list-label__default",
      // wrapperOrdered: "cdx-list--ordered",
      // wrapperUnordered: "cdx-list--unordered",

      // label
      labelPopover: "label-popover",
      labelPopoverInput: "label-popover-input",
      labelPopoverInputGreen: "label-popover-input__green",
      labelPopoverInputRed: "label-popover-input__red",
      labelPopoverInputWarn: "label-popover-input__warn",
      labelPopoverInputDefault: "label-popover-input__default",
      labelPopoverRow: "label-popover-row",
      labelPopoverSpotActive: "label-popover-row-spot--active",
      labelPopoverRowSpot: "label-popover-row-spot",
      labelPopoverRowSpotGreen: "label-popover-row-spot__green",
      labelPopoverRowSpotRed: "label-popover-row-spot__red",
      labelPopoverRowSpotWarn: "label-popover-row-spot__warn",
      labelPopoverRowSpotDefault: "label-popover-row-spot__default",
    };
  }

  findTargetLabel(targetIndex) {
    let targetClass = this.CSS.listLabel;

    const targetLabels = this.element.querySelectorAll(`.${targetClass}`);

    for (let index = 0; index < targetLabels.length; index += 1) {
      const label = targetLabels[index];

      if (label.dataset.index === String(targetIndex)) {
        return label;
      }
    }

    return null;
  }

  getCurLabelClass(color) {
    let targetClass;
    switch (color) {
      case "red": {
        return this.CSS.labelRed;
      }
      case "warn": {
        return this.CSS.labelWarn;
      }
      case "default": {
        return this.CSS.labelDefault;
      }
      default:
        return this.CSS.labelGreen;
    }
  }

  // highlight label in texts and popover selector
  highlightCurrentLabel(item, color = "green") {
    const curIndex = item.dataset.index;
    const TargetLabel = this.findTargetLabel(curIndex, color);

    // highlight in texts
    TargetLabel.classList.remove(this.CSS.labelGreen);
    TargetLabel.classList.remove(this.CSS.labelRed);
    TargetLabel.classList.remove(this.CSS.labelWarn);
    TargetLabel.classList.remove(this.CSS.labelDefault);
    TargetLabel.classList.add(this.getCurLabelClass(color));

    // highlight in popover
    const LabelSelectors = this.element.querySelector(
      `.${this.CSS.labelPopoverRow}`
    );
    const LabelInput = this.element.querySelector(
      `.${this.CSS.labelPopoverInput}`
    );

    LabelSelectors.replaceWith(this.buildLabelSelectors(item, color));
    LabelInput.replaceWith(this.buildLabelInput(item, color));
  }

  // get the current label's default state
  _getActiveLabel(item) {
    const CurLabel = item.querySelector(`.${this.CSS.listLabel}`);
    const value = CurLabel.innerText;
    let color = null;

    if (CurLabel.className.indexOf(this.CSS.labelGreen) >= 0) {
      color = "green";
    } else if (CurLabel.className.indexOf(this.CSS.labelRed) >= 0) {
      color = "red";
    } else if (CurLabel.className.indexOf(this.CSS.labelWarn) >= 0) {
      color = "warn";
    } else {
      color = "default";
    }

    return { value, color };
  }

  // label input component
  buildLabelInput(item, active = "green") {
    let inputClass;

    switch (this._getActiveLabel(item).color) {
      case "red": {
        inputClass = this.CSS.labelPopoverInputRed;
        break;
      }
      case "warn": {
        inputClass = this.CSS.labelPopoverInputWarn;
        break;
      }
      case "green": {
        inputClass = this.CSS.labelPopoverInputGreen;
        break;
      }
      default: {
        inputClass = this.CSS.labelPopoverInputDefault;
        break;
      }
    }

    const InputBox = make("input", [this.CSS.labelPopoverInput, inputClass], {
      value: this._getActiveLabel(item).value,
    });
    // TODO:  Input onChange

    return InputBox;
  }

  // label type selector component
  buildLabelSelectors(item, active = "green") {
    const Wrapper = make("div", this.CSS.labelPopoverRow);
    const SpotGreen = make("div", [
      this.CSS.labelPopoverRowSpot,
      this.CSS.labelPopoverRowSpotGreen,
    ]);
    const SpotRed = make("div", [
      this.CSS.labelPopoverRowSpot,
      this.CSS.labelPopoverRowSpotRed,
    ]);
    const SpotWarn = make("div", [
      this.CSS.labelPopoverRowSpot,
      this.CSS.labelPopoverRowSpotWarn,
    ]);
    const SpotDefault = make("div", [
      this.CSS.labelPopoverRowSpot,
      this.CSS.labelPopoverRowSpotDefault,
    ]);

    SpotGreen.addEventListener("click", () =>
      this.highlightCurrentLabel(item, "green")
    );
    SpotRed.addEventListener("click", () =>
      this.highlightCurrentLabel(item, "red")
    );
    SpotWarn.addEventListener("click", () =>
      this.highlightCurrentLabel(item, "warn")
    );
    SpotDefault.addEventListener("click", () =>
      this.highlightCurrentLabel(item, "default")
    );

    Wrapper.appendChild(SpotGreen);
    Wrapper.appendChild(SpotRed);
    Wrapper.appendChild(SpotWarn);
    Wrapper.appendChild(SpotDefault);

    const ActiveDot = make("div", this.CSS.labelPopoverSpotActive, {
      innerHTML:
        '<svg t="1581913245157" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5676" width="200" height="200"><path d="M853.333333 256L384 725.333333l-213.333333-213.333333" p-id="5677"></path></svg>',
    });
    switch (this._getActiveLabel(item).color) {
      case "red": {
        SpotRed.appendChild(ActiveDot);
        break;
      }
      case "warn": {
        SpotWarn.appendChild(ActiveDot);
        break;
      }
      case "green": {
        SpotGreen.appendChild(ActiveDot);
        break;
      }
      default: {
        SpotDefault.appendChild(ActiveDot);
        break;
      }
    }

    return Wrapper;
  }

  rebuildListIndex(node) {
    const indexElements = node.parentNode.querySelectorAll(
      "." + this.CSS.orderListPrefix
    );

    Array.from(indexElements).forEach((item, index) => {
      item.innerHTML = `${index + 1}.`;
    });
  }
}
