!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.List=e():t.List=e()}(window,function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n(n.s=6)}([function(t,e,n){window,t.exports=function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n(n.s=1)}([function(t,e){function n(t,e,n){var r,i,o,a,s;function c(){var l=Date.now()-a;l<e&&l>=0?r=setTimeout(c,e-l):(r=null,n||(s=t.apply(o,i),o=i=null))}null==e&&(e=100);var l=function(){o=this,i=arguments,a=Date.now();var l=n&&!r;return r||(r=setTimeout(c,e)),l&&(s=t.apply(o,i),o=i=null),s};return l.clear=function(){r&&(clearTimeout(r),r=null)},l.flush=function(){r&&(s=t.apply(o,i),o=i=null,clearTimeout(r),r=null)},l}n.debounce=n,t.exports=n},function(t,e,n){"use strict";n.r(e);var r=n(0);const i=function(t,e,n){let r=document.createElement("script");r.src=t,r.onload=e,r.onreadystatechange=e,n.appendChild(r)},o=(t,e=null,n={})=>{let r=document.createElement(t);Array.isArray(e)?r.classList.add(...e):e&&r.classList.add(e);for(let t in n)"placeholder"===t&&r.setAttribute("placeholder",n[t]),r[t]=n[t];return r},a=(t,e)=>{if(t.parentNode){const n=t.parentNode.querySelectorAll("."+e.styles.settingsButton);Array.from(n).forEach(t=>t.classList.remove(e.styles.settingsButtonActive))}t.classList.add(e.styles.settingsButtonActive)};n.d(e,"debounce",function(){return r.debounce}),n.d(e,"loadJS",function(){return i}),n.d(e,"make",function(){return o}),n.d(e,"highlightSettingIcon",function(){return a})}])},function(t,e,n){var r=n(2);"string"==typeof r&&(r=[[t.i,r,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};n(4)(r,i);r.locals&&(t.exports=r.locals)},function(t,e,n){(t.exports=n(3)(!1)).push([t.i,".cdx-list {\n    margin: 0;\n    padding-left: 40px;\n    outline: none;\n}\n\n    .cdx-list__item {\n        padding: 5.5px 0 5.5px 3px;\n        line-height: 1.6em;\n    }\n\n    .cdx-list--unordered {\n        list-style: disc;\n    }\n\n    .cdx-list--ordered {\n        list-style: decimal;\n    }\n\n.cdx-custom-settings {\n  display: flex;\n  border-bottom: 1px solid;\n  border-bottom-color: lightgrey;\n  padding-bottom: 3px;\n  max-width: 120px;\n  flex-wrap: wrap;\n}\n",""])},function(t,e){t.exports=function(t){var e=[];return e.toString=function(){return this.map(function(e){var n=function(t,e){var n=t[1]||"",r=t[3];if(!r)return n;if(e&&"function"==typeof btoa){var i=(a=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */"),o=r.sources.map(function(t){return"/*# sourceURL="+r.sourceRoot+t+" */"});return[n].concat(o).concat([i]).join("\n")}var a;return[n].join("\n")}(e,t);return e[2]?"@media "+e[2]+"{"+n+"}":n}).join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var r={},i=0;i<this.length;i++){var o=this[i][0];"number"==typeof o&&(r[o]=!0)}for(i=0;i<t.length;i++){var a=t[i];"number"==typeof a[0]&&r[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),e.push(a))}},e}},function(t,e,n){var r,i,o={},a=(r=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===i&&(i=r.apply(this,arguments)),i}),s=function(t){var e={};return function(t){if("function"==typeof t)return t();if(void 0===e[t]){var n=function(t){return document.querySelector(t)}.call(this,t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(t){n=null}e[t]=n}return e[t]}}(),c=null,l=0,u=[],d=n(5);function p(t,e){for(var n=0;n<t.length;n++){var r=t[n],i=o[r.id];if(i){i.refs++;for(var a=0;a<i.parts.length;a++)i.parts[a](r.parts[a]);for(;a<r.parts.length;a++)i.parts.push(y(r.parts[a],e))}else{var s=[];for(a=0;a<r.parts.length;a++)s.push(y(r.parts[a],e));o[r.id]={id:r.id,refs:1,parts:s}}}}function f(t,e){for(var n=[],r={},i=0;i<t.length;i++){var o=t[i],a=e.base?o[0]+e.base:o[0],s={css:o[1],media:o[2],sourceMap:o[3]};r[a]?r[a].parts.push(s):n.push(r[a]={id:a,parts:[s]})}return n}function h(t,e){var n=s(t.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=u[u.length-1];if("top"===t.insertAt)r?r.nextSibling?n.insertBefore(e,r.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),u.push(e);else if("bottom"===t.insertAt)n.appendChild(e);else{if("object"!=typeof t.insertAt||!t.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var i=s(t.insertInto+" "+t.insertAt.before);n.insertBefore(e,i)}}function v(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var e=u.indexOf(t);e>=0&&u.splice(e,1)}function m(t){var e=document.createElement("style");return void 0===t.attrs.type&&(t.attrs.type="text/css"),g(e,t.attrs),h(t,e),e}function g(t,e){Object.keys(e).forEach(function(n){t.setAttribute(n,e[n])})}function y(t,e){var n,r,i,o;if(e.transform&&t.css){if(!(o=e.transform(t.css)))return function(){};t.css=o}if(e.singleton){var a=l++;n=c||(c=m(e)),r=S.bind(null,n,a,!1),i=S.bind(null,n,a,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(t){var e=document.createElement("link");return void 0===t.attrs.type&&(t.attrs.type="text/css"),t.attrs.rel="stylesheet",g(e,t.attrs),h(t,e),e}(e),r=function(t,e,n){var r=n.css,i=n.sourceMap,o=void 0===e.convertToAbsoluteUrls&&i;(e.convertToAbsoluteUrls||o)&&(r=d(r));i&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */");var a=new Blob([r],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}.bind(null,n,e),i=function(){v(n),n.href&&URL.revokeObjectURL(n.href)}):(n=m(e),r=function(t,e){var n=e.css,r=e.media;r&&t.setAttribute("media",r);if(t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}.bind(null,n),i=function(){v(n)});return r(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;r(t=e)}else i()}}t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(e=e||{}).attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=a()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var n=f(t,e);return p(n,e),function(t){for(var r=[],i=0;i<n.length;i++){var a=n[i];(s=o[a.id]).refs--,r.push(s)}t&&p(f(t,e),e);for(i=0;i<r.length;i++){var s;if(0===(s=r[i]).refs){for(var c=0;c<s.parts.length;c++)s.parts[c]();delete o[s.id]}}}};var b,w=(b=[],function(t,e){return b[t]=e,b.filter(Boolean).join("\n")});function S(t,e,n,r){var i=n?"":r.css;if(t.styleSheet)t.styleSheet.cssText=w(e,i);else{var o=document.createTextNode(i),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(o,a[e]):t.appendChild(o)}}},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var n=e.protocol+"//"+e.host,r=n+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(t,e){var i,o=e.trim().replace(/^"(.*)"$/,function(t,e){return e}).replace(/^'(.*)'$/,function(t,e){return e});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(o)?t:(i=0===o.indexOf("//")?o:0===o.indexOf("/")?n+o:r+o.replace(/^\.\//,""),"url("+JSON.stringify(i)+")")})}},function(t,e,n){"use strict";n.r(e);var r=n(0),i=(n(1),[{name:"unordered",title:"无序列表",icon:'<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',default:!0},{name:"ordered",title:"有序列表",icon:'<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"><path d="M5.819 4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0-4.607h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 1 1 0-2.138zm0 9.357h9.362a1.069 1.069 0 0 1 0 2.138H5.82a1.069 1.069 0 0 1 0-2.137zM1.468 4.155V1.33c-.554.404-.926.606-1.118.606a.338.338 0 0 1-.244-.104A.327.327 0 0 1 0 1.59c0-.107.035-.184.105-.234.07-.05.192-.114.369-.192.264-.118.475-.243.633-.373.158-.13.298-.276.42-.438a3.94 3.94 0 0 1 .238-.298C1.802.019 1.872 0 1.975 0c.115 0 .208.042.277.127.07.085.105.202.105.351v3.556c0 .416-.15.624-.448.624a.421.421 0 0 1-.32-.127c-.08-.085-.121-.21-.121-.376zm-.283 6.664h1.572c.156 0 .275.03.358.091a.294.294 0 0 1 .123.25.323.323 0 0 1-.098.238c-.065.065-.164.097-.296.097H.629a.494.494 0 0 1-.353-.119.372.372 0 0 1-.126-.28c0-.068.027-.16.081-.273a.977.977 0 0 1 .178-.268c.267-.264.507-.49.722-.678.215-.188.368-.312.46-.371.165-.11.302-.222.412-.334.109-.112.192-.226.25-.344a.786.786 0 0 0 .085-.345.6.6 0 0 0-.341-.553.75.75 0 0 0-.345-.08c-.263 0-.47.11-.62.329-.02.029-.054.107-.101.235a.966.966 0 0 1-.16.295c-.059.069-.145.103-.26.103a.348.348 0 0 1-.25-.094.34.34 0 0 1-.099-.258c0-.132.031-.27.093-.413.063-.143.155-.273.279-.39.123-.116.28-.21.47-.282.189-.072.411-.107.666-.107.307 0 .569.045.786.137a1.182 1.182 0 0 1 .618.623 1.18 1.18 0 0 1-.096 1.083 2.03 2.03 0 0 1-.378.457c-.128.11-.344.282-.646.517-.302.235-.509.417-.621.547a1.637 1.637 0 0 0-.148.187z"/></svg>',default:!1},{name:"todo",title:"待办项",icon:'<svg width="15" t="1575424104866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17990" width="200" height="200"><path d="M204.748 958.97C91.852 958.97 0 867.12 0 754.22c0-112.896 91.852-204.748 204.748-204.748 72.25 0 139.916 38.724 176.586 101.064 8.15 13.858 3.524 31.698-10.33 39.846-13.858 8.154-31.696 3.524-39.846-10.33-26.258-44.636-74.696-72.364-126.412-72.364-80.8 0-146.534 65.734-146.534 146.534s65.734 146.536 146.534 146.536c50.808 0 97.268-25.746 124.284-68.862 8.538-13.626 26.5-17.746 40.118-9.216 13.622 8.538 17.746 26.5 9.212 40.118-37.724 60.22-102.628 96.172-173.612 96.172zM994.892 719.512H508.648c-16.076 0-29.108-13.034-29.108-29.108s13.032-29.108 29.108-29.108h486.244c16.074 0 29.108 13.034 29.108 29.108s-13.034 29.108-29.108 29.108zM812.552 847.146H508.648c-16.076 0-29.108-13.034-29.108-29.108s13.032-29.108 29.108-29.108h303.902c16.074 0 29.108 13.034 29.108 29.108s-13.03 29.108-29.106 29.108z" p-id="17991"></path><path d="M204.742 269.768m-175.634 0a175.634 175.634 0 1 0 351.268 0 175.634 175.634 0 1 0-351.268 0Z"  p-id="17992"></path><path d="M204.748 474.526C91.848 474.526 0 382.676 0 269.78 0 156.88 91.848 65.03 204.748 65.03S409.496 156.88 409.496 269.78c0.004 112.896-91.848 204.746-204.748 204.746z m0-351.282c-80.8 0-146.534 65.736-146.534 146.536s65.734 146.534 146.534 146.534 146.534-65.734 146.534-146.534-65.734-146.536-146.534-146.536zM994.892 235.07H508.648c-16.076 0-29.108-13.034-29.108-29.108s13.032-29.108 29.108-29.108h486.244c16.074 0 29.108 13.034 29.108 29.108s-13.034 29.108-29.108 29.108zM812.552 362.7H508.648c-16.076 0-29.108-13.034-29.108-29.108s13.032-29.108 29.108-29.108h303.902c16.074 0 29.108 13.034 29.108 29.108s-13.03 29.108-29.106 29.108z"  p-id="17993"></path></svg>',default:!1},{name:"org-list",title:"颜色标签",icon:'<svg width="18" t="1576900368370" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1117" width="200" height="200"><path d="M675.399487 297.001321 348.600513 297.001321c-16.406668 0-29.708626 13.301957-29.708626 29.708626s13.301957 29.708626 29.708626 29.708626l326.798974 0c16.406668 0 29.709649-13.301957 29.709649-29.708626S691.806155 297.001321 675.399487 297.001321z" p-id="1118"></path><path d="M675.399487 445.561845 348.600513 445.561845c-16.406668 0-29.708626 13.301957-29.708626 29.708626s13.301957 29.708626 29.708626 29.708626l326.798974 0c16.406668 0 29.709649-13.301957 29.709649-29.708626S691.806155 445.561845 675.399487 445.561845z" p-id="1119"></path><path d="M779.381723 66.36243 244.618277 66.36243c-49.149397 0-89.1269 40.110533-89.1269 89.418542l0 712.423729c0 49.310056 39.978527 89.432869 89.1269 89.432869 6.578836 0 12.974499-2.190899 18.183128-6.209422 71.116711-55.037501 202.079438-142.351102 250.827699-142.351102 47.959292 0.128937 177.225377 87.313601 247.445672 142.248771 5.219885 4.091178 11.668761 6.311753 18.304901 6.311753 49.14735 0 89.1269-40.123836 89.1269-89.432869L868.506577 155.780973C868.508623 106.472963 828.529073 66.36243 779.381723 66.36243zM809.090349 868.203678c0 13.548574-8.943696 25.040303-21.179368 28.752858-48.370661-37.092803-198.24511-147.096173-274.365788-147.297764-76.689636 0-228.601488 110.321618-277.377378 147.32744-12.280698-3.683902-21.258163-15.20326-21.258163-28.782533L214.909651 155.780973c0-16.535605 13.32447-30.000268 29.708626-30.000268l534.763446 0c16.384156 0 29.708626 13.464663 29.708626 30.000268L809.090349 868.203678z" p-id="1120"></path></svg>',default:!1},{name:"sort",title:"排序",icon:'<svg width="18" height="18" t="1580984968921" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2492" width="200" height="200"><path d="M896 490.666667v42.666666a21.333333 21.333333 0 0 1-21.333333 21.333334h-554.666667a21.333333 21.333333 0 0 1-21.333333-21.333334v-42.666666a21.333333 21.333333 0 0 1 21.333333-21.333334h554.666667a21.333333 21.333333 0 0 1 21.333333 21.333334z m-21.333333 234.666666h-170.666667a21.333333 21.333333 0 0 0-21.333333 21.333334v42.666666a21.333333 21.333333 0 0 0 21.333333 21.333334h170.666667a21.333333 21.333333 0 0 0 21.333333-21.333334v-42.666666a21.333333 21.333333 0 0 0-21.333333-21.333334z m0-512H426.666667a298.666667 298.666667 0 0 0 0 597.333334v85.333333a21.333333 21.333333 0 0 0 36.266666 14.933333l128-128a21.76 21.76 0 0 0 0-30.293333l-128-128A21.333333 21.333333 0 0 0 426.666667 640v85.333333a213.333333 213.333333 0 0 1 0-426.666666h448a21.333333 21.333333 0 0 0 21.333333-21.333334v-42.666666a21.333333 21.333333 0 0 0-21.333333-21.333334z" p-id="2493"></path></svg>',default:!1}]);function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var a=function(){function t(e){var n=e.api,r=e.data,o=e.config,a=e.setTune;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.api=n,this.config=o,this._data=r,this.element=null,this.settings=i,this.setTune=a}var e,n,a;return e=t,(n=[{key:"setType",value:function(t){this._data.type=t}},{key:"buildNormalList",value:function(t){var e=this,n="ordered"===(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"unordered")?this.CSS.wrapperOrdered:this.CSS.wrapperUnordered,i=Object(r.make)("ul",[this.CSS.baseBlock,this.CSS.listWrapper,n],{contentEditable:!0});return t.length?t.forEach(function(t){i.appendChild(Object(r.make)("li",e.CSS.listItem,{innerHTML:t}))}):i.appendChild(Object(r.make)("li",this.CSS.listItem)),i}},{key:"renderSettings",value:function(){var t=this,e=Object(r.make)("div",[this.CSS.settingsWrapper],{});return this.settings.forEach(function(n){var i=Object(r.make)("div",t.CSS.settingsButton,{innerHTML:n.icon});t.api.tooltip.onHover(i,n.title,{placement:"top"}),t._data.type===n.style&&i.classList.add(t.CSS.settingsButtonActive),i.addEventListener("click",function(){t.setTune(n.name),t.clearSettingHighlight(),i.classList.toggle(t.CSS.settingsButtonActive)}),t._data.type===n.name&&i.classList.add(t.CSS.settingsButtonActive),e.appendChild(i)}),e}},{key:"clearSettingHighlight",value:function(){var t=this,e=itemEl.parentNode.querySelectorAll("."+this.CSS.settingsButton);Array.from(e).forEach(function(e){return e.classList.remove(t.CSS.settingsButtonActive)})}},{key:"CSS",get:function(){return{baseBlock:this.api.styles.block,settingsWrapper:"cdx-custom-settings",settingsButton:this.api.styles.settingsButton,settingsButtonActive:this.api.styles.settingsButtonActive,listWrapper:"cdx-list",wrapperOrdered:"cdx-list--ordered",wrapperUnordered:"cdx-list--unordered",listItem:"cdx-list__item"}}}])&&o(e.prototype,n),a&&o(e,a),t}();function s(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function c(t,e,n){return e&&s(t.prototype,e),n&&s(t,n),t}n.d(e,"default",function(){return l});var l=function(){function t(e){e.data;var n=e.config,r=e.api;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.elements={wrapper:null},this._data={type:"unordered",items:[]},this.api=r,this.i18n=n.i18n||"en",this.ui=new a({api:r,config:this.config,data:this._data,setTune:this.setTune.bind(this)})}return c(t,null,[{key:"enableLineBreaks",get:function(){return!0}},{key:"toolbox",get:function(){return{icon:'<svg width="17" height="13" viewBox="0 0 17 13" xmlns="http://www.w3.org/2000/svg"> <path d="M5.625 4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0-4.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm0 9.85h9.25a1.125 1.125 0 0 1 0 2.25h-9.25a1.125 1.125 0 0 1 0-2.25zm-4.5-5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0-4.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25zm0 9.85a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25z"/></svg>',title:"en"===this.i18n?"List":"列表类"}}}]),c(t,[{key:"setTune",value:function(t){switch(console.log("setTune type: ",t),this.ui.setType(t),t){case"unordered":var e=this.ui.buildNormalList(this._data.items,"unordered");return this.replaceElement(e),!1;case"ordered":var n=this.ui.buildNormalList(this._data.items,"ordered");return this.replaceElement(n),!1;default:return}}},{key:"replaceElement",value:function(t){this.elements.wrapper.replaceWith(t),this.elements.wrapper=t,this.api.tooltip.hide(),this.api.toolbar.close()}},{key:"render",value:function(){var t=this;return this.elements.wrapper=this.ui.buildNormalList(this._data.items,"unordered"),this.elements.wrapper.addEventListener("keydown",function(e){switch(e.keyCode){case 13:t.getOutofList(e);break;case 8:t.backspace(e)}},!1),this.elements.wrapper}},{key:"save",value:function(){return this.data}},{key:"renderSettings",value:function(){return this.ui.renderSettings()}},{key:"getOutofList",value:function(t){var e=this.elements.wrapper.querySelectorAll("."+this.CSS.item);if(!(e.length<2)){var n=e[e.length-1],r=this.currentItem;r!==n||n.textContent.trim().length||(r.parentElement.removeChild(r),this.api.blocks.insertNewBlock(),t.preventDefault(),t.stopPropagation())}}},{key:"backspace",value:function(t){var e=this.elements.wrapper.querySelectorAll("."+this.CSS.item),n=e[0];n&&e.length<2&&!n.innerHTML.replace("<br>"," ").trim()&&t.preventDefault()}},{key:"selectItem",value:function(t){t.preventDefault();var e=window.getSelection(),n=e.anchorNode.parentNode.closest("."+this.CSS.item),r=new Range;r.selectNodeContents(n),e.removeAllRanges(),e.addRange(r)}},{key:"CSS",get:function(){return{baseBlock:this.api.styles.block,wrapper:"cdx-list",wrapperOrdered:"cdx-list--ordered",wrapperUnordered:"cdx-list--unordered",item:"cdx-list__item"}}},{key:"data",set:function(t){t||(t={}),this._data.type=t.type||this.ui.settings.find(function(t){return!0===t.default}).name,this._data.items=t.items||[];var e=this.elements.wrapper;e&&e.parentNode.replaceChild(this.render(),e)},get:function(){this._data.items=[];for(var t=this.elements.wrapper.querySelectorAll(".".concat(this.CSS.item)),e=0;e<t.length;e++){t[e].innerHTML.replace("<br>"," ").trim()&&this._data.items.push(t[e].innerHTML)}return this._data}},{key:"currentItem",get:function(){var t=window.getSelection().anchorNode;return t.nodeType!==Node.ELEMENT_NODE&&(t=t.parentNode),t.closest(".".concat(this.CSS.item))}}],[{key:"conversionConfig",get:function(){return{export:function(t){return t.items.join(". ")},import:function(t){return{items:[t],type:"unordered"}}}}},{key:"sanitize",get:function(){return{type:{},items:{br:!0}}}}]),t}()}]).default});