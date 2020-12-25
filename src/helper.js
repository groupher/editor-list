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
