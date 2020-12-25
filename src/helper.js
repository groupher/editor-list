import { findIndex, clazz } from "@groupher/editor-utils";

/**
 * is current list item can be indent or not
 *
 * @param {[HTMLElement]} items
 * @param {HTMLElement} curItemEl
 * @returns {Boolean}
 */
export const canItemIndent = (items, curItemEl) => {
  const curIndex = findIndex(items, (itemEl) => curItemEl === itemEl);

  // 如果找不到，或者当前 Item 是第一个，那么不能缩进
  if (curIndex <= 0) return false;

  const previousIndex = curIndex - 1;
  const PreviousItemEl = items[previousIndex];

  const previousIndent = PreviousItemEl.dataset.indent || "0";
  const currentIndent = curItemEl.dataset.indent || "0";

  const previousIndentNum = parseInt(previousIndent);
  const currentIndentNum = parseInt(currentIndent);

  // 不允许比上级缩进超过两级以上
  // TODO: 考虑删除的情况, 需要重新计算
  if (currentIndentNum - previousIndentNum >= 1) {
    return false;
  }

  return true;
};

/**
 * is current list item can be un-indent (indent to left) or not
 * @param {*} curItemEl
 * @returns
 */
export const canItemUnIndent = (curItemEl) => {
  if (
    clazz.has(curItemEl, getIndentClass(1)) ||
    clazz.has(curItemEl, getIndentClass(2)) ||
    clazz.has(curItemEl, getIndentClass(3)) ||
    clazz.has(curItemEl, getIndentClass(4)) ||
    clazz.has(curItemEl, getIndentClass(5))
  ) {
    return true;
  }
  return false;
};

/**
 * get the indent class name based on level
 * @param {number} level
 * @returns {string} - level class
 */
export const getIndentClass = (level) => {
  switch (level) {
    case 1: {
      return "cdx-list-indent-1";
    }
    case 2: {
      return "cdx-list-indent-2";
    }
    case 3: {
      return "cdx-list-indent-3";
    }
    case 4: {
      return "cdx-list-indent-4";
    }
    case 5: {
      return "cdx-list-indent-5";
    }
    default:
      return "";
  }
};

const getIndentLevel = (el) => {
  const currentLevel = el.dataset.indent || "0";
  return parseInt(currentLevel) + 1;
};

const getUnIndentLevel = (el) => {
  const currentLevel = el.dataset.indent || "0";
  return parseInt(currentLevel);
};

/**
 * indent current list element
 * by add indent class to given element
 *
 * @param {HTMLElement} el
 */
export const indentElement = (el) => {
  const indentLevel = getIndentLevel(el);
  const indentClass = getIndentClass(indentLevel);

  clazz.add(el, indentClass);
  el.setAttribute("data-indent", indentLevel);
};

/**
 * indent current list element to left
 *
 * @param {HTMLElement} el
 */
export const unIndentElement = (el) => {
  const indentLevel = getUnIndentLevel(el);
  const indentClass = getIndentClass(indentLevel);

  clazz.remove(el, indentClass);
  el.setAttribute("data-indent", indentLevel - 1);
};

/**
 * set order list's prefix number
 *
 * 第 0 级缩进比较特殊，也比较好判断，1-5 级缩进需要自己抓取上一个缩进的前缀标
 *
 * @param {number} level - indent level number
 * @param {[HTMLElement] || [[HTMLElement]]} blocks - indent blocks array
 * @returns
 */
export const setOrderListPrefixItem = (level, blocks) => {
  const prefixClass = ".cdx-list__item-order-prefix";

  if (level === 0) {
    return Array.from(blocks).forEach((item, index) => {
      const prefixNumberEl = item.querySelector(prefixClass);
      prefixNumberEl.innerHTML = `${index + 1}.`;
    });
  }

  return Array.from(blocks).forEach((block, blockIndex) => {
    Array.from(block).forEach((item, index) => {
      // 最近一级 '父' 条目
      const ParentIndentEl = block[0].previousElementSibling;

      const prefixNumberEl = ParentIndentEl.querySelector(prefixClass);

      // 第 0 级会带 . 后缀，比如 1. xxx， 但是按照惯例后面的子层级没有 . 后缀
      const previousIndentPrefix = prefixNumberEl.innerText.endsWith(".")
        ? prefixNumberEl.innerText.slice(0, -1)
        : prefixNumberEl.innerText;

      const curPrefixNumberEl = item.querySelector(prefixClass);
      curPrefixNumberEl.innerHTML = `${previousIndentPrefix}.${index + 1}`;
    });
  });
};

/**
 * parse the indent elements
 * return as blocks
 * 返回分块的基于每个缩进单位的元素列表
 *
 * @param {HTMLElement} node - list wrapper
 * @param {number} [level=0] - indent level number
 * @returns {[HTMLElement]}
 */
export const parseIndentBlocks = (node, level = 0) => {
  // TODO: 第一级需要特殊处理
  if (level === 0) {
    return node.querySelectorAll("[data-indent='0']");
  }

  // 找出当前 indent-level 以及父一级的元素列表, 因为 block 的隔断至于父一级的 level
  // 有关，和子级（或嵌套子级）没有关系
  const relatedItemElements = node.querySelectorAll(
    `[data-indent='${level - 1}'], [data-indent='${level}']`
  );
  const indentElements = node.querySelectorAll(`[data-indent='${level}']`);

  // console.log("# relatedItemElements: ", relatedItemElements);
  // console.log("# indentElements: ", indentElements);

  let sameLevelIndentEls = [];
  const blocks = [];

  for (let index = 0; index < indentElements.length; index++) {
    const indentEl = indentElements[index];

    const curIndentElIndex = findIndex(relatedItemElements, (item) => {
      return item.dataset.index === indentEl.dataset.index;
    });
    const nextListItemIndex = curIndentElIndex + 1;

    const nextItem = relatedItemElements[nextListItemIndex];

    // console.log("cur: ", indentEl);
    // console.log("next: ", nextItem);

    if (!nextItem) {
      // 如果该条目下只有一个缩进的子条目
      if (indentEl) {
        sameLevelIndentEls.push(indentEl);
      }

      blocks.push([...Array.from(new Set(sameLevelIndentEls))]);
      sameLevelIndentEls = [];
      return blocks;
    }

    const curIndentElLevel = parseInt(indentEl.dataset.indent);
    const nextItemIndentLevel = parseInt(nextItem.dataset.indent);

    // 如果和下一个的 indent level 相同，说明属于同一个'区块'
    if (curIndentElLevel === nextItemIndentLevel) {
      // console.log("the same");
      sameLevelIndentEls.push(indentEl);
      sameLevelIndentEls.push(nextItem);
    } else {
      // console.log("not the same, break array: ", sameLevelIndentEls);
      if (indentEl) {
        sameLevelIndentEls.push(indentEl);
      }

      blocks.push([...Array.from(new Set(sameLevelIndentEls))]);
      sameLevelIndentEls = [];
    }
  }

  return blocks;
};
