import { make } from "@groupher/editor-utils";

import { debounce } from "@groupher/editor-utils";

import LN from "./LN";

export default class OrgLabel {
  constructor({ api, config, element, setElement }) {
    this.api = api;
    // this.config = config;

    // this._data = null;
    this.element = null;
    this.labelValueMap = {};
    // all the textField's data-index array
  }

  setElement(element) {
    this.element = element;
  }

  getDefaultLabelTypeValue() {
    return this.labelValueMap["default"] || LN.DEFAULT_LABEL;
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

  _getCurLabelTypeClass(type) {
    let targetClass;
    switch (type) {
      case LN.RED: {
        return this.CSS.labelRed;
      }
      case LN.WARN: {
        return this.CSS.labelWarn;
      }
      case LN.DEFAULT: {
        return this.CSS.labelDefault;
      }
      default:
        return this.CSS.labelGreen;
    }
  }

  // highlight label in texts and popover selector
  highlightCurrentLabel(item, type) {
    const curIndex = item.dataset.index;
    const TargetLabel = this.findTargetLabel(curIndex, type);

    // highlight in texts
    TargetLabel.classList.remove(this.CSS.labelGreen);
    TargetLabel.classList.remove(this.CSS.labelRed);
    TargetLabel.classList.remove(this.CSS.labelWarn);
    TargetLabel.classList.remove(this.CSS.labelDefault);
    TargetLabel.classList.add(this._getCurLabelTypeClass(type));

    // highlight in popover
    const LabelSelectors = this.element.querySelector(
      `.${this.CSS.labelPopoverRow}`
    );
    const LabelInput = this.element.querySelector(
      `.${this.CSS.labelPopoverInput}`
    );

    LabelSelectors.replaceWith(this.drawLabelSelectors(item, type));
    LabelInput.replaceWith(this.drawLabelInput(item, type));

    const curType = this._parseTypeByClassName(TargetLabel.className);

    if (this.labelValueMap[curType]) {
      const CurInput = this.element.querySelector(
        `.${this.CSS.labelPopoverInput}`
      );
      CurInput.value = this.labelValueMap[curType];
      TargetLabel.innerText = this.labelValueMap[curType];
    }
  }

  _parseTypeByClassName(className) {
    if (className.indexOf(this.CSS.labelGreen) >= 0) {
      return LN.GREEN;
    } else if (className.indexOf(this.CSS.labelRed) >= 0) {
      return LN.RED;
    } else if (className.indexOf(this.CSS.labelWarn) >= 0) {
      return LN.WARN;
    } else {
      return LN.DEFAULT;
    }
  }

  // get the current label's default state
  _getActiveLabelState(item) {
    const CurLabel = item.querySelector(`.${this.CSS.listLabel}`);
    const value = CurLabel.innerText;
    const type = this._parseTypeByClassName(CurLabel.className);

    return { value, type };
  }

  // change all the label with the same type
  _labelInputOnChange(item, value) {
    const curLabel = this._getActiveLabelState(item);
    const labelTypeClass = this._getCurLabelTypeClass(curLabel.type);

    const someLabelNodeList = item.parentNode.querySelectorAll(
      `.${labelTypeClass}`
    );

    for (let index = 0; index < someLabelNodeList.length; index++) {
      const element = someLabelNodeList[index];
      element.innerText = value;
    }
  }

  // label input component
  drawLabelInput(item) {
    let inputClass;

    switch (this._getActiveLabelState(item).type) {
      case LN.RED: {
        inputClass = this.CSS.labelPopoverInputRed;
        break;
      }
      case LN.WARN: {
        inputClass = this.CSS.labelPopoverInputWarn;
        break;
      }
      case LN.GREEN: {
        inputClass = this.CSS.labelPopoverInputGreen;
        break;
      }
      default: {
        inputClass = this.CSS.labelPopoverInputDefault;
        break;
      }
    }

    const InputBox = make("input", [this.CSS.labelPopoverInput, inputClass], {
      value: this._getActiveLabelState(item).value,
    });

    InputBox.addEventListener(
      "input",
      debounce(({ target: { value } }) => {
        this._labelInputOnChange(item, value);
        this._setLabelValueMap(item);
      }),
      200
    );

    return InputBox;
  }

  _setLabelValueMap(item, updateExist = true) {
    const { value, type } = this._getActiveLabelState(item);
    if (updateExist) {
      return (this.labelValueMap[type] = value);
    }

    if (!this.labelValueMap[type]) {
      this.labelValueMap[type] = value;
    }
  }

  // label type selector component
  drawLabelSelectors(item) {
    this._setLabelValueMap(item, false);

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
      this.highlightCurrentLabel(item, LN.GREEN)
    );
    SpotRed.addEventListener("click", () =>
      this.highlightCurrentLabel(item, LN.RED)
    );
    SpotWarn.addEventListener("click", () =>
      this.highlightCurrentLabel(item, LN.WARN)
    );
    SpotDefault.addEventListener("click", () =>
      this.highlightCurrentLabel(item, LN.DEFAULT)
    );

    Wrapper.appendChild(SpotGreen);
    Wrapper.appendChild(SpotRed);
    Wrapper.appendChild(SpotWarn);
    Wrapper.appendChild(SpotDefault);

    const ActiveDot = make("div", this.CSS.labelPopoverSpotActive, {
      innerHTML:
        '<svg t="1581913245157" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5676" width="200" height="200"><path d="M853.333333 256L384 725.333333l-213.333333-213.333333" p-id="5677"></path></svg>',
    });
    switch (this._getActiveLabelState(item).type) {
      case LN.RED: {
        SpotRed.appendChild(ActiveDot);
        break;
      }
      case LN.WARN: {
        SpotWarn.appendChild(ActiveDot);
        break;
      }
      case LN.GREEN: {
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
