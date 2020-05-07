const LN = {
  ORDERED_LIST: "ordered_list",
  UNORDERED_LIST: "unordered_list",
  CHECKLIST: "checklist",
  ORG_MODE: "org_mode",
  SORT: "sort",
  // ---
  RED: "red",
  GREEN: "green",
  WARN: "warn",
  DEFAULT: "default",
  DEFAULT_LABEL: "标签",
  // 
  SORT_DEFAULT: 'sort_default',
  SORT_UP: 'sort_up',
  SORT_DOWN: 'sort_down',

  SORT_ORDER: {
    'sort_up': {
      green: 0,
      warn: 1,
      red: 2,
      default: 3,
    },
    'sort_down': {
      red: 0,
      warn: 1,
      green: 2,
      default: 3,
    },
    'sort_default': {
      warn: 0,
      red: 1,
      green: 2,
      default: 3,
    },
  }
};

export default LN;
