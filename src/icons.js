const iconList = [
  {
    name: "unordered",
    title: "无序列表",
    icon:
      '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',
    default: true
  },
  {
    name: "ordered",
    title: "有序列表",
    icon:
      '<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"><path d="M5.819 4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0-4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0 9.357h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 0 1 0-2.137zM1.468 4.155V1.33c-.554.404-.926.606-1.118.606a.338.338 0 0 1-.244-.104A.327.327 0 0 1 0 1.59c0-.107.035-.184.105-.234.07-.05.192-.114.369-.192.264-.118.475-.243.633-.373.158-.13.298-.276.42-.438a3.94 3.94 0 0 1 .238-.298C1.802.019 1.872 0 1.975 0c.115 0 .208.042.277.127.07.085.105.202.105.351v3.556c0 .416-.15.624-.448.624a.421.421 0 0 1-.32-.127c-.08-.085-.121-.21-.121-.376zm-.283 6.664h1.572c.156 0 .275.03.358.091a.294.294 0 0 1 .123.25.323.323 0 0 1-.098.238c-.065.065-.164.097-.296.097H.629a.494.494 0 0 1-.353-.119.372.372 0 0 1-.126-.28c0-.068.027-.16.081-.273a.977.977 0 0 1 .178-.268c.267-.264.507-.49.722-.678.215-.188.368-.312.46-.371.165-.11.302-.222.412-.334.109-.112.192-.226.25-.344a.786.786 0 0 0 .085-.345.6.6 0 0 0-.341-.553.75.75 0 0 0-.345-.08c-.263 0-.47.11-.62.329-.02.029-.054.107-.101.235a.966.966 0 0 1-.16.295c-.059.069-.145.103-.26.103a.348.348 0 0 1-.25-.094.34.34 0 0 1-.099-.258c0-.132.031-.27.093-.413.063-.143.155-.273.279-.39.123-.116.28-.21.47-.282.189-.072.411-.107.666-.107.307 0 .569.045.786.137a1.182 1.182 0 0 1 .618.623 1.18 1.18 0 0 1-.096 1.083 2.03 2.03 0 0 1-.378.457c-.128.11-.344.282-.646.517-.302.235-.509.417-.621.547a1.637 1.637 0 0 0-.148.187z"/></svg>',
    default: false
  },
  {
    name: "todo",
    title: "待办项",
    icon:
      '<svg width="15" t="1575424104866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17990" width="200" height="200"><path d="M204.748 958.97C91.852 958.97 0 867.12 0 754.22c0-112.896 91.852-204.748 204.748-204.748 72.25 0 139.916 38.724 176.586 101.064 8.15 13.858 3.524 31.698-10.33 39.846-13.858 8.154-31.696 3.524-39.846-10.33-26.258-44.636-74.696-72.364-126.412-72.364-80.8 0-146.534 65.734-146.534 146.534s65.734 146.536 146.534 146.536c50.808 0 97.268-25.746 124.284-68.862 8.538-13.626 26.5-17.746 40.118-9.216 13.622 8.538 17.746 26.5 9.212 40.118-37.724 60.22-102.628 96.172-173.612 96.172zM994.892 719.512H508.648c-16.076 0-29.108-13.034-29.108-29.108s13.032-29.108 29.108-29.108h486.244c16.074 0 29.108 13.034 29.108 29.108s-13.034 29.108-29.108 29.108zM812.552 847.146H508.648c-16.076 0-29.108-13.034-29.108-29.108s13.032-29.108 29.108-29.108h303.902c16.074 0 29.108 13.034 29.108 29.108s-13.03 29.108-29.106 29.108z" p-id="17991"></path><path d="M204.742 269.768m-175.634 0a175.634 175.634 0 1 0 351.268 0 175.634 175.634 0 1 0-351.268 0Z"  p-id="17992"></path><path d="M204.748 474.526C91.848 474.526 0 382.676 0 269.78 0 156.88 91.848 65.03 204.748 65.03S409.496 156.88 409.496 269.78c0.004 112.896-91.848 204.746-204.748 204.746z m0-351.282c-80.8 0-146.534 65.736-146.534 146.536s65.734 146.534 146.534 146.534 146.534-65.734 146.534-146.534-65.734-146.536-146.534-146.536zM994.892 235.07H508.648c-16.076 0-29.108-13.034-29.108-29.108s13.032-29.108 29.108-29.108h486.244c16.074 0 29.108 13.034 29.108 29.108s-13.034 29.108-29.108 29.108zM812.552 362.7H508.648c-16.076 0-29.108-13.034-29.108-29.108s13.032-29.108 29.108-29.108h303.902c16.074 0 29.108 13.034 29.108 29.108s-13.03 29.108-29.106 29.108z"  p-id="17993"></path></svg>',
    default: false
  },
  {
    name: "org-list",
    title: "颜色标签",
    icon:
      '<svg width="18" t="1576900368370" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1117" width="200" height="200"><path d="M675.399487 297.001321 348.600513 297.001321c-16.406668 0-29.708626 13.301957-29.708626 29.708626s13.301957 29.708626 29.708626 29.708626l326.798974 0c16.406668 0 29.709649-13.301957 29.709649-29.708626S691.806155 297.001321 675.399487 297.001321z" p-id="1118"></path><path d="M675.399487 445.561845 348.600513 445.561845c-16.406668 0-29.708626 13.301957-29.708626 29.708626s13.301957 29.708626 29.708626 29.708626l326.798974 0c16.406668 0 29.709649-13.301957 29.709649-29.708626S691.806155 445.561845 675.399487 445.561845z" p-id="1119"></path><path d="M779.381723 66.36243 244.618277 66.36243c-49.149397 0-89.1269 40.110533-89.1269 89.418542l0 712.423729c0 49.310056 39.978527 89.432869 89.1269 89.432869 6.578836 0 12.974499-2.190899 18.183128-6.209422 71.116711-55.037501 202.079438-142.351102 250.827699-142.351102 47.959292 0.128937 177.225377 87.313601 247.445672 142.248771 5.219885 4.091178 11.668761 6.311753 18.304901 6.311753 49.14735 0 89.1269-40.123836 89.1269-89.432869L868.506577 155.780973C868.508623 106.472963 828.529073 66.36243 779.381723 66.36243zM809.090349 868.203678c0 13.548574-8.943696 25.040303-21.179368 28.752858-48.370661-37.092803-198.24511-147.096173-274.365788-147.297764-76.689636 0-228.601488 110.321618-277.377378 147.32744-12.280698-3.683902-21.258163-15.20326-21.258163-28.782533L214.909651 155.780973c0-16.535605 13.32447-30.000268 29.708626-30.000268l534.763446 0c16.384156 0 29.708626 13.464663 29.708626 30.000268L809.090349 868.203678z" p-id="1120"></path></svg>',
    default: false
  },
  // only show when org-list is active
  {
    name: "sort",
    title: "排序",
    icon:
      '<svg width="18" height="18" t="1580984968921" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2492" width="200" height="200"><path d="M896 490.666667v42.666666a21.333333 21.333333 0 0 1-21.333333 21.333334h-554.666667a21.333333 21.333333 0 0 1-21.333333-21.333334v-42.666666a21.333333 21.333333 0 0 1 21.333333-21.333334h554.666667a21.333333 21.333333 0 0 1 21.333333 21.333334z m-21.333333 234.666666h-170.666667a21.333333 21.333333 0 0 0-21.333333 21.333334v42.666666a21.333333 21.333333 0 0 0 21.333333 21.333334h170.666667a21.333333 21.333333 0 0 0 21.333333-21.333334v-42.666666a21.333333 21.333333 0 0 0-21.333333-21.333334z m0-512H426.666667a298.666667 298.666667 0 0 0 0 597.333334v85.333333a21.333333 21.333333 0 0 0 36.266666 14.933333l128-128a21.76 21.76 0 0 0 0-30.293333l-128-128A21.333333 21.333333 0 0 0 426.666667 640v85.333333a213.333333 213.333333 0 0 1 0-426.666666h448a21.333333 21.333333 0 0 0 21.333333-21.333334v-42.666666a21.333333 21.333333 0 0 0-21.333333-21.333334z" p-id="2493"></path></svg>',
    default: false
  }
];

export default iconList;
