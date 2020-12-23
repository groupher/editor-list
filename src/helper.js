import { findIndex, clazz } from "@groupher/editor-utils";

export const canItemIndent = (items, curItemEl) => {
  const curIndex = findIndex(items, (itemEl) => curItemEl === itemEl);

  // 如果找不到，或者当前 Item 是第一个，那么不能缩进
  if (curIndex <= 0) return false;

  const previousIndex = curIndex - 1;
  const PreviousItemEl = items[previousIndex];

  // console.log("> PreviousItemEl: ", PreviousItemEl.dataset);
  const previousIndent = PreviousItemEl.dataset.indent || "0";
  const currentIndent = curItemEl.dataset.indent || "0";

  const previousIndentNum = parseInt(previousIndent);
  const currentIndentNum = parseInt(currentIndent);

  console.log("previousIndentNum -> ", previousIndentNum);
  console.log("currentIndentNum -> ", currentIndentNum);

  // 不允许比上级缩进超过两级以上
  // TODO: 考虑删除的情况, 需要重新计算
  if (currentIndentNum - previousIndentNum >= 1) {
    console.log("#- 多级禁止");
    return false;
  }

  console.log("#- PreviousItemEl: ", PreviousItemEl);
  console.log("#- previousIndent: ", previousIndent);

  return true;
};

/**
 * get the indent class name based on level
 * @param {number} level
 * @returns {string} - level class
 */
const getIndentClass = (level) => {
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

/**
 * add indent class to given element
 *
 * @param {HTMLElement} el
 */
export const indentElement = (el) => {
  const indentLevel = getIndentLevel(el);
  const indentClass = getIndentClass(indentLevel);

  console.log("#- cur el: ", el);
  console.log("#- indentLevel: ", indentLevel);

  clazz.add(el, indentClass);
  el.setAttribute("data-indent", indentLevel);
};
