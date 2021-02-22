import { findIndex, clazz } from "@groupher/editor-utils";
import { SORT_ORDER } from "./constant";

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

  // 最多支持 3 级缩进
  if (currentIndentNum >= 3) return false;

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

  if (indentLevel > 1) {
    clazz.add(el, getIndentClass(indentLevel - 1));
  }

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
      const prefix_str = `${index + 1}.`;
      const prefixNumberEl = item.querySelector(prefixClass);

      prefixNumberEl.innerHTML = prefix_str;
      item.setAttribute("data-prefix-index", prefix_str);
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
      const prefix_str = `${previousIndentPrefix}.${index + 1}`;

      const curPrefixNumberEl = item.querySelector(prefixClass);

      curPrefixNumberEl.innerHTML = prefix_str;
      item.setAttribute("data-prefix-index", prefix_str);
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

  let sameLevelIndentEls = [];
  const blocks = [];

  for (let index = 0; index < indentElements.length; index++) {
    const indentEl = indentElements[index];

    const curIndentElIndex = findIndex(relatedItemElements, (item) => {
      return item.dataset.index === indentEl.dataset.index;
    });
    const nextListItemIndex = curIndentElIndex + 1;

    const nextItem = relatedItemElements[nextListItemIndex];

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
      sameLevelIndentEls.push(indentEl);
      sameLevelIndentEls.push(nextItem);
    } else {
      if (indentEl) {
        sameLevelIndentEls.push(indentEl);
      }

      blocks.push([...Array.from(new Set(sameLevelIndentEls))]);
      sameLevelIndentEls = [];
    }
  }

  return blocks;
};

/**
 * add indent class based on previous list item
 * @param {HTMLElement} el
 */
export const indentIfNeed = (el) => {
  const PreviousEl = el.previousElementSibling;

  if (PreviousEl) {
    const index = parseInt(PreviousEl.dataset.index);
    // skip first item
    if (index === 0) return;

    const previousIndentLevel = parseInt(PreviousEl.dataset.indent) || 0;
    const indentClass = getIndentClass(previousIndentLevel);

    clazz.add(el, indentClass);
    el.setAttribute("data-indent", previousIndentLevel);
  }
};

/**
 * @typedef {Object} ListItemData
 * @description list item data
 * @property {string} text — list text
 * @property {string} label — list label
 * @property {number} indent - indent level
 */

/**
 * @typedef {Object} NestedListItemData
 * @description list item data
 * @property {string} text — list text
 * @property {string} label — list label
 * @property {number} indent - indent level
 * @property {array} children - indent level
 */

/**
 * covert list item data list to list data json tree
 *
 * @param {[ListItemData]} items
 * @returns {[NestedListItemData]}
 */
export const convertToNestedChildrenTree = (items) => {
  // const items = JSON.parse(JSON.stringify(itemsData));
  const list = items.map((item, index) => {
    return { ...item, index };
  });
  const jsonTreeArray = [];

  // handle indent-level-0 outline list
  const indent0List = list.filter((item) => item.indent === 0);
  // handle indent-level-0, init
  for (let i = 0; i < indent0List.length; i++) {
    const listItem = indent0List[i];

    if (!jsonTreeArray[i]) {
      jsonTreeArray[i] = { ...listItem, children: [] };
    }
  }

  // handle indent-level-1 outline list
  const indent1List = list.filter((item) => item.indent === 1);

  for (let i = 0; i < indent1List.length; i++) {
    const listItem = indent1List[i];
    const parentIndex = _findParentItemIndex(listItem, list);

    const indexInJsonTree = findIndex(
      jsonTreeArray,
      (item) => item.index === parentIndex
    );

    if (!jsonTreeArray[indexInJsonTree]) {
      jsonTreeArray[indexInJsonTree] = { ...list[parentIndex], children: [] };
    }

    jsonTreeArray[indexInJsonTree].children.push(listItem);
  }

  // 收集缩进级别在 2 以上的子级信息, 最多支持 4 级缩进
  jsonTreeArray.forEach((item) => _setChildren(item, 2, list));

  return jsonTreeArray;
};

export const sortNestedChildrenTree = (treeArray, sortType) => {
  // indent-level-0 outline
  treeArray.sort(
    (t1, t2) =>
      SORT_ORDER[sortType][t1.labelType] - SORT_ORDER[sortType][t2.labelType]
  );

  // indent-level-1 outline
  treeArray.forEach((item1) => {
    if (item1.children.length > 0) {
      // sort indent-level-1 outline
      item1.children.sort(
        (t1, t2) =>
          SORT_ORDER[sortType][t1.labelType] -
          SORT_ORDER[sortType][t2.labelType]
      );

      // indent-level-2 outline
      item1.children.forEach((item2) => {
        if (item2.children.length > 0) {
          item2.children.sort(
            (t1, t2) =>
              SORT_ORDER[sortType][t1.labelType] -
              SORT_ORDER[sortType][t2.labelType]
          );

          // indent-level-3 outline
          item2.children.forEach((item3) => {
            if (item3.children.length > 0) {
              item3.children.sort(
                (t1, t2) =>
                  SORT_ORDER[sortType][t1.labelType] -
                  SORT_ORDER[sortType][t2.labelType]
              );
            }
          });
        }
      });
    }
  });

  return treeArray;
};

export const flattenNestedChildrenTree = (treeArray) => {
  const flatList = [];

  for (let i = 0; i < treeArray.length; i++) {
    const item0 = treeArray[i];
    flatList.push(item0);

    if (!item0.children) break;
    for (let i = 0; i < item0.children.length; i++) {
      const item1 = item0.children[i];
      flatList.push(item1);

      if (!item1.children) break;
      for (let i = 0; i < item1.children.length; i++) {
        const item2 = item1.children[i];
        flatList.push(item2);

        if (!item2.children) break;
        for (let i = 0; i < item2.children.length; i++) {
          const item3 = item2.children[i];

          flatList.push(item3);
        }
      }
    }
  }

  return flatList;
};

/**
 * find parent list item index from the current item
 * 从当前节点向上寻找父节点的 index
 *
 * @param {ListItemData} item
 * @param {[ListItemData]} list
 * @returns {number}
 * @private
 */
const _findParentItemIndex = (item, list) => {
  if (item.indent === 0) return -1;

  for (let index = item.index; index > 0; index -= 1) {
    if (list[index - 1].indent === item.indent - 1) {
      return index - 1;
    }
  }

  return -1;
};

/**
 * set children from indent level-2 to level-4
 *
 * @param {NestedListItemData} block
 * @param {number} fromIndentLevel
 * @param {[ListItemData]} list
 */
// TODO:  refactor later
const _setChildren = (block, fromIndentLevel, list) => {
  if (!block.children) return;

  const nextSameIndentLevelIndex = findIndex(
    list,
    (item) => item.index > block.index && item.indent === block.indent
  );

  let curAndNextIndentLevelList = list.filter(
    (item) =>
      item.indent === fromIndentLevel - 1 || item.indent === fromIndentLevel
  );

  if (nextSameIndentLevelIndex !== -1) {
    curAndNextIndentLevelList = curAndNextIndentLevelList.slice(
      0,
      nextSameIndentLevelIndex - 1
    );
  }

  if (curAndNextIndentLevelList.length === 0) return;
  const curAndNextIndentLevelListMaxNum =
    curAndNextIndentLevelList[curAndNextIndentLevelList.length - 1].index;

  for (let i = 0; i < block.children.length; i++) {
    const firstIndentItem = block.children[i];
    const firstIndentItemNext = block.children[i + 1];

    const begin = firstIndentItem.index + 1;
    const end = firstIndentItemNext
      ? firstIndentItemNext.index
      : curAndNextIndentLevelListMaxNum + 1;

    // NOTE: 只把indent = 2 的放到 children 里面, 因为里面可能还有子级
    const grandsons = list
      .slice(begin, end)
      .filter((item) => item.indent === fromIndentLevel);

    // 设置二级缩进
    block.children[i].children = grandsons;

    // 设置第三级缩进
    _setChildren(firstIndentItem, 3, list);
  }
};

/**
 * get children list items (include parent itself)
 *
 * @param {HTMLElement} node
 * @returns {[HTMLElement]}
 * @public
 */
export const getFamilyTree = (node) => {
  const tree = [];
  tree.push(node);

  const listNodeItems = node.parentNode.getElementsByClassName(
    "cdx-list__item"
  );
  const listLength = listNodeItems.length;
  const curIndex = parseInt(node.dataset.index);

  for (let i = curIndex + 1; i < listNodeItems.length; i++) {
    const listItemEl = listNodeItems[i];

    const curIndent = parseInt(node.dataset.indent);
    const nextIndent = parseInt(listItemEl.dataset.indent);

    if (curIndent < nextIndent) {
      tree.push(listItemEl);
    }

    if (nextIndent <= curIndent) {
      return tree;
    }
  }
  return tree;
};

/**
 * 找到下一个和当前 target 同等缩进级别的 index
 *
 * @param {HTMLElement} target
 * @param {[HTMLElement]} list
 * @returns
 */
export const findNextSameIndentLevelIndex = (target, list) => {
  const targetIndent = parseInt(target.dataset.indent);
  const targetIndex = target.dataset.index;

  for (let i = parseInt(target.dataset.index); i < list.length; i++) {
    const listItem = list[i];
    const listItemIndent = parseInt(listItem.dataset.indent);

    const listItemNext = list[i + 1];

    if (!listItemNext) {
      return i;
    }

    const listItemNextIndent = parseInt(listItemNext.dataset.indent);

    if (
      listItemNextIndent === targetIndent ||
      listItemNextIndent < targetIndent
    ) {
      return listItemNext.dataset.index;
    }
  }

  return targetIndex;
};
