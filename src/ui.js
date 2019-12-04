export default class Ui {
  constructor({ api, config }) {
    this.api = api
    this.config = config

    this._data = {}
    this.element = null;

    this.settings = [
      {
        name: 'unordered',
        title: '无序列表',
        icon:
          '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
        default: true,
      },
      {
        name: 'ordered',
        title: '有序列表',
        icon: '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"><path d="M5.819 4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0-4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0 9.357h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 0 1 0-2.137zM1.468 4.155V1.33c-.554.404-.926.606-1.118.606a.338.338 0 0 1-.244-.104A.327.327 0 0 1 0 1.59c0-.107.035-.184.105-.234.07-.05.192-.114.369-.192.264-.118.475-.243.633-.373.158-.13.298-.276.42-.438a3.94 3.94 0 0 1 .238-.298C1.802.019 1.872 0 1.975 0c.115 0 .208.042.277.127.07.085.105.202.105.351v3.556c0 .416-.15.624-.448.624a.421.421 0 0 1-.32-.127c-.08-.085-.121-.21-.121-.376zm-.283 6.664h1.572c.156 0 .275.03.358.091a.294.294 0 0 1 .123.25.323.323 0 0 1-.098.238c-.065.065-.164.097-.296.097H.629a.494.494 0 0 1-.353-.119.372.372 0 0 1-.126-.28c0-.068.027-.16.081-.273a.977.977 0 0 1 .178-.268c.267-.264.507-.49.722-.678.215-.188.368-.312.46-.371.165-.11.302-.222.412-.334.109-.112.192-.226.25-.344a.786.786 0 0 0 .085-.345.6.6 0 0 0-.341-.553.75.75 0 0 0-.345-.08c-.263 0-.47.11-.62.329-.02.029-.054.107-.101.235a.966.966 0 0 1-.16.295c-.059.069-.145.103-.26.103a.348.348 0 0 1-.25-.094.34.34 0 0 1-.099-.258c0-.132.031-.27.093-.413.063-.143.155-.273.279-.39.123-.116.28-.21.47-.282.189-.072.411-.107.666-.107.307 0 .569.045.786.137a1.182 1.182 0 0 1 .618.623 1.18 1.18 0 0 1-.096 1.083 2.03 2.03 0 0 1-.378.457c-.128.11-.344.282-.646.517-.302.235-.509.417-.621.547a1.637 1.637 0 0 0-.148.187z"/></svg>',
        default: false,
      },
      {
        name: 'todo',
        title: '待办项',
        icon: '<svg width="15" t="1575424104866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17990" width="200" height="200"><path d="M204.748 958.97C91.852 958.97 0 867.12 0 754.22c0-112.896 91.852-204.748 204.748-204.748 72.25 0 139.916 38.724 176.586 101.064 8.15 13.858 3.524 31.698-10.33 39.846-13.858 8.154-31.696 3.524-39.846-10.33-26.258-44.636-74.696-72.364-126.412-72.364-80.8 0-146.534 65.734-146.534 146.534s65.734 146.536 146.534 146.536c50.808 0 97.268-25.746 124.284-68.862 8.538-13.626 26.5-17.746 40.118-9.216 13.622 8.538 17.746 26.5 9.212 40.118-37.724 60.22-102.628 96.172-173.612 96.172zM994.892 719.512H508.648c-16.076 0-29.108-13.034-29.108-29.108s13.032-29.108 29.108-29.108h486.244c16.074 0 29.108 13.034 29.108 29.108s-13.034 29.108-29.108 29.108zM812.552 847.146H508.648c-16.076 0-29.108-13.034-29.108-29.108s13.032-29.108 29.108-29.108h303.902c16.074 0 29.108 13.034 29.108 29.108s-13.03 29.108-29.106 29.108z" p-id="17991"></path><path d="M204.742 269.768m-175.634 0a175.634 175.634 0 1 0 351.268 0 175.634 175.634 0 1 0-351.268 0Z"  p-id="17992"></path><path d="M204.748 474.526C91.848 474.526 0 382.676 0 269.78 0 156.88 91.848 65.03 204.748 65.03S409.496 156.88 409.496 269.78c0.004 112.896-91.848 204.746-204.748 204.746z m0-351.282c-80.8 0-146.534 65.736-146.534 146.536s65.734 146.534 146.534 146.534 146.534-65.734 146.534-146.534-65.734-146.536-146.534-146.536zM994.892 235.07H508.648c-16.076 0-29.108-13.034-29.108-29.108s13.032-29.108 29.108-29.108h486.244c16.074 0 29.108 13.034 29.108 29.108s-13.034 29.108-29.108 29.108zM812.552 362.7H508.648c-16.076 0-29.108-13.034-29.108-29.108s13.032-29.108 29.108-29.108h303.902c16.074 0 29.108 13.034 29.108 29.108s-13.03 29.108-29.106 29.108z"  p-id="17993"></path></svg>',
        default: false,
      },
      {
        name: 'org-list',
        title: '标签列表',
        icon: '<svg width="18" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="icon"><path id="svg_1"  d="m719.000004,4.333333l-506.02667,0a134.82667,134.82667 0 0 0 -133.97333,134.82667l0,788.48a94.72,94.72 0 0 0 15.36,52.05333a100.69333,100.69333 0 0 0 138.24,33.28l218.45333,-133.12a33.28,33.28 0 0 1 34.98667,0l211.62667,131.41333a94.72,94.72 0 0 0 52.05333,15.36a101.54667,101.54667 0 0 0 100.69333,-100.69333l0,-786.77333a132.26667,132.26667 0 0 0 -131.41333,-134.82667zm70.82667,921.6a36.69333,36.69333 0 0 1 -36.69334,33.28a28.16,28.16 0 0 1 -17.06666,-5.12l-213.33334,-130.56a97.28,97.28 0 0 0 -104.10666,0l-218.45334,133.12a31.57333,31.57333 0 0 1 -46.08,-13.65333a32.42667,32.42667 0 0 1 -5.12,-17.06667l0,-786.77333a67.41333,67.41333 0 0 1 67.41334,-67.41334l502.61333,0a67.41333,67.41333 0 0 1 67.41333,67.41334l0,786.77333l3.41334,0z"/><path stroke="null" id="svg_2"  d="m930.494721,206.28l-475.804531,0a59.2577,29.01333 0 0 0 0,58.02667l475.804531,0a59.2577,29.01333 0 1 0 0,-58.02667z"/><path stroke="null" id="svg_4"  d="m930.494724,412.946669l-475.80453,0a59.2577,29.01333 0 0 0 0,58.02667l475.80453,0a59.2577,29.01333 0 1 0 0,-58.02667z"/><path stroke="null" id="svg_5"  d="m930.494724,619.613332l-475.80453,0a59.2577,29.01333 0 0 0 0,58.02667l475.80453,0a59.2577,29.01333 0 1 0 0,-58.02667z"/></g></svg>',
        default: false
      },
      {
        name: 'org-list-solid',
        title: '标签列表（实心）',
        icon: '<svg width="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="icon"><defs><style type="text/css"/></defs><g><title>background</title><rect fill="none" id="canvas_background" height="402" width="582" y="-1" x="-1"/></g><g><title>Layer 1</title><path stroke="null" id="svg_1" d="m769.818184,1.818182l-506.02667,0a134.82667,134.82667 0 0 0 -133.97333,134.82667l0,788.48a94.72,94.72 0 0 0 15.36,52.05333a100.69333,100.69333 0 0 0 138.24,33.28l218.45333,-133.12a33.28,33.28 0 0 1 34.98667,0l211.62667,131.41333a94.72,94.72 0 0 0 52.05333,15.36a101.54667,101.54667 0 0 0 100.69333,-100.69333l0,-786.77333a132.26667,132.26667 0 0 0 -131.41333,-134.82667zm70.82667,921.6a36.69333,36.69333 0 0 1 -36.69334,33.28a28.16,28.16 0 0 1 -17.06666,-5.12l-213.33334,-130.56a97.28,97.28 0 0 0 -104.10666,0l-218.45334,133.12a31.57333,31.57333 0 0 1 -46.08,-13.65333a32.42667,32.42667 0 0 1 -5.12,-17.06667l0,-786.77333a67.41333,67.41333 0 0 1 67.41334,-67.41334l502.61333,0a67.41333,67.41333 0 0 1 67.41333,67.41334l0,786.77333l3.41334,0z"/><rect id="svg_8" height="181.818178" width="352.727265" y="36.460223" x="485.636363" fill-opacity="null" stroke-opacity="null" stroke-width="null" stroke="null" /><rect stroke="null" id="svg_12" height="139.999993" width="352.727265" y="707.369272" x="496.545454" fill-opacity="null" stroke-opacity="null" stroke-width="null" /><rect id="svg_14" height="114.545452" width="163.63636" y="851.005661" x="703.818177" fill-opacity="null" stroke-opacity="null" stroke-width="null" stroke="null" /><rect id="svg_15" height="61.81818" width="105.454543" y="852.823842" x="620.181815" fill-opacity="null" stroke-opacity="null" stroke-width="null" stroke="null" /><g id="svg_16"><rect stroke="null" transform="rotate(-22.329071044921875 309.77676391601574,857.2581176757812) " id="svg_4" height="138.181815" width="297.935615" y="788.167214" x="160.808964" fill-opacity="null" stroke-opacity="null" stroke-width="null" /><rect id="svg_13" height="65.454544" width="259.999994" y="805.551116" x="598.363634" fill-opacity="null" stroke-opacity="null" stroke-width="null" stroke="null" /></g><g id="svg_17"><rect stroke="null" id="svg_3" height="783.63631" width="321.818186" y="65.551143" x="192.909105" fill-opacity="null" stroke-opacity="null" stroke-width="null" /><rect stroke="null" id="svg_9" height="139.999993" width="352.727265" y="289.187474" x="492.909091" fill-opacity="null" stroke-opacity="null" stroke-width="null" /><rect stroke="null" id="svg_11" height="139.999993" width="352.727265" y="498.278372" x="494.727273" fill-opacity="null" stroke-opacity="null" stroke-width="null" /></g></g></svg>',
        default: false
      }
    ]
  }

  /**
   * CSS classes
   * @constructor
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      settingsWrapper: 'cdx-custom-settings',
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
    };
  }

  /**
   * render Setting buttons
   * @public
   */
  renderSettings() {
    const wrapper = this._make('div', [this.CSS.settingsWrapper], {})

    this.settings.forEach(item => {
      const itemEl = this._make('div', this.CSS.settingsButton, {
        innerHTML: item.icon,
      })

      this.api.tooltip.onHover(itemEl, item.title, { placement: 'top' })

      itemEl.addEventListener('click', () => {
        this.toggleTune(item.name)

        // clear other buttons
        const buttons = itemEl.parentNode.querySelectorAll(
          '.' + this.CSS.settingsButton
        )

        Array.from(buttons).forEach(button =>
          button.classList.remove(this.CSS.settingsButtonActive)
        )

        // mark active
        itemEl.classList.toggle(this.CSS.settingsButtonActive)
      })

      if (this._data.style === item.name) {
        itemEl.classList.add(this.CSS.settingsButtonActive)
      }

      wrapper.appendChild(itemEl)
    })

    return wrapper
  }

  /**
   * Helper method for elements creation
   * @param tagName
   * @param classNames
   * @param attributes
   * @return {HTMLElement}
   */
  _make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}