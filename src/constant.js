export const ORDERED_LIST = "ordered_list";
export const UNORDERED_LIST = "unordered_list";
export const CHECKLIST = "checklist";
export const ORG_MODE = "org_mode";
export const SORT = "sort";

export const LABEL_TYPE = {
  RED: "red",
  GREEN: "green",
  WARN: "warn",
  DEFAULT: "default",
};

export const DEFAULT_LABEL = "标签";
//
export const SORT_DEFAULT = "sort_default";
export const SORT_UP = "sort_up";
export const SORT_DOWN = "sort_down";
export const SORT_ENUM = [SORT_DEFAULT, SORT_UP, SORT_DOWN];

export const SORT_ORDER = {
  [SORT_UP]: {
    green: 0,
    warn: 1,
    red: 2,
    default: 3,
  },
  [SORT_DOWN]: {
    red: 0,
    warn: 1,
    green: 2,
    default: 3,
  },
  [SORT_DEFAULT]: {
    warn: 0,
    red: 1,
    green: 2,
    default: 3,
  },
};
