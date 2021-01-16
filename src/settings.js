import {
  UNORDERED_LIST,
  ORDERED_LIST,
  CHECKLIST,
  ORG_MODE,
  SORT,
} from "./constant";

import UnOrderListActionIcon from "./icons/unOrderAction.svg";
import OrderListActionIcon from "./icons/orderAction.svg";
import CheckListActionIcon from "./icons/checkAction.svg";
import ORGIcon from "./icons/org.svg";

import SortIcon from "./icons/sort.svg";

const settings = [
  {
    name: UNORDERED_LIST,
    title: "无序列表",
    icon: UnOrderListActionIcon,
    default: true,
  },
  {
    name: ORDERED_LIST,
    title: "有序列表",
    icon: OrderListActionIcon,
    default: false,
  },
  {
    name: CHECKLIST,
    title: "待办项",
    icon: CheckListActionIcon,
    default: false,
  },
  {
    name: ORG_MODE,
    title: "标签",
    icon: ORGIcon,
    default: false,
  },
  // only show when org-list is active
  {
    name: SORT,
    // title: "重置排序",
    sort_up: "按标签顺序",
    sort_down: "按标签逆序",
    sort_default: "按标签排序",
    icon: SortIcon,
    default: false,
  },
];

export default settings;
