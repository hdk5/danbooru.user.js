// ==UserScript==
// @name Danbooru - Tag Preview
// @version 20240218170120
// @author hdk5
// @supportURL https://github.com/hdk5/danbooru.user.js/issues
// @match *://*.donmai.us/*
// @downloadURL https://github.com/hdk5/danbooru.user.js/raw/master/dist/tag-preview.user.js
// @grant GM_addStyle
// @homepageURL https://github.com/hdk5/danbooru.user.js
// @namespace https://github.com/hdk5/danbooru.user.js
// @updateURL https://github.com/hdk5/danbooru.user.js/raw/master/dist/tag-preview.meta.js
// ==/UserScript==

(()=>{"use strict";var e={210:(e,t,n)=>{n.d(t,{A:()=>l});var r=n(19),o=n.n(r),s=n(572),i=n.n(s)()(o());i.push([e.id,".preview-related-tags-column .ml-auto{margin-left:auto}.preview-related-tags-column [data-is-deprecated=true]{opacity:.5}",""]);const l=i.toString()},572:e=>{e.exports=function(e){var t=[];return t.toString=function(){return this.map((function(t){var n="",r=void 0!==t[5];return t[4]&&(n+="@supports (".concat(t[4],") {")),t[2]&&(n+="@media ".concat(t[2]," {")),r&&(n+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),n+=e(t),r&&(n+="}"),t[2]&&(n+="}"),t[4]&&(n+="}"),n})).join("")},t.i=function(e,n,r,o,s){"string"==typeof e&&(e=[[null,e,void 0]]);var i={};if(r)for(var l=0;l<this.length;l++){var a=this[l][0];null!=a&&(i[a]=!0)}for(var c=0;c<e.length;c++){var u=[].concat(e[c]);r&&i[u[0]]||(void 0!==s&&(void 0===u[5]||(u[1]="@layer".concat(u[5].length>0?" ".concat(u[5]):""," {").concat(u[1],"}")),u[5]=s),n&&(u[2]?(u[1]="@media ".concat(u[2]," {").concat(u[1],"}"),u[2]=n):u[2]=n),o&&(u[4]?(u[1]="@supports (".concat(u[4],") {").concat(u[1],"}"),u[4]=o):u[4]="".concat(o)),t.push(u))}},t}},19:e=>{e.exports=function(e){return e[1]}}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var s=t[r]={id:r,exports:{}};return e[r](s,s.exports,n),s.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{const e={context:void 0,registry:void 0};function t(t){e.context=t}const r=Symbol("solid-proxy"),o=Symbol("solid-track"),s=(Symbol("solid-dev-component"),{equals:(e,t)=>e===t});let i=null,l=U;const a=1,c=2,u={owned:null,cleanups:null,context:null,owner:null},f={};var d=null;let p=null,g=null,h=null,v=null,y=null,m=null,b=0;function w(e,t){const n=v,r=d,o=0===e.length,s=void 0===t?r:t,i=o?u:{owned:null,cleanups:null,context:s?s.context:null,owner:s},l=o?e:()=>e((()=>O((()=>R(i)))));d=i,v=null;try{return D(l,!0)}finally{v=n,d=r}}function x(e,t){const n={value:e,observers:null,observerSlots:null,comparator:(t=t?Object.assign({},s,t):s).equals||void 0};return[B.bind(n),e=>("function"==typeof e&&(e=p&&p.running&&p.sources.has(n)?e(n.tValue):e(n.value)),V(n,e))]}function S(e,t,n){const r=L(e,t,!0,a);g&&p&&p.running?y.push(r):q(r)}function A(e,t,n){const r=L(e,t,!1,a);g&&p&&p.running?y.push(r):q(r)}function k(e,t,n){n=n?Object.assign({},s,n):s;const r=L(e,t,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,g&&p&&p.running?(r.tState=a,y.push(r)):q(r),B.bind(r)}function O(e){if(!h&&null===v)return e();const t=v;v=null;try{return h?h.untrack(e):e()}finally{v=t}}function P(e){return null===d||(null===d.cleanups?d.cleanups=[e]:d.cleanups.push(e)),e}const[j,N]=x(!1);function T(e){return d&&d.context&&void 0!==d.context[e.id]?d.context[e.id]:e.defaultValue}function C(e){const t=k(e),n=k((()=>W(t())));return n.toArray=()=>{const e=n();return Array.isArray(e)?e:null!=e?[e]:[]},n}let E;function B(){const e=p&&p.running;if(this.sources&&(e?this.tState:this.state))if((e?this.tState:this.state)===a)q(this);else{const e=y;y=null,D((()=>H(this)),!1),y=e}if(v){const e=this.observers?this.observers.length:0;v.sources?(v.sources.push(this),v.sourceSlots.push(e)):(v.sources=[this],v.sourceSlots=[e]),this.observers?(this.observers.push(v),this.observerSlots.push(v.sources.length-1)):(this.observers=[v],this.observerSlots=[v.sources.length-1])}return e&&p.sources.has(this)?this.tValue:this.value}function V(e,t,n){let r=p&&p.running&&p.sources.has(e)?e.tValue:e.value;if(!e.comparator||!e.comparator(r,t)){if(p){const r=p.running;(r||!n&&p.sources.has(e))&&(p.sources.add(e),e.tValue=t),r||(e.value=t)}else e.value=t;e.observers&&e.observers.length&&D((()=>{for(let t=0;t<e.observers.length;t+=1){const n=e.observers[t],r=p&&p.running;r&&p.disposed.has(n)||((r?n.tState:n.state)||(n.pure?y.push(n):m.push(n),n.observers&&K(n)),r?n.tState=a:n.state=a)}if(y.length>1e6)throw y=[],new Error}),!1)}return t}function q(e){if(!e.fn)return;R(e);const t=b;I(e,p&&p.running&&p.sources.has(e)?e.tValue:e.value,t),p&&!p.running&&p.sources.has(e)&&queueMicrotask((()=>{D((()=>{p&&(p.running=!0),v=d=e,I(e,e.tValue,t),v=d=null}),!1)}))}function I(e,t,n){let r;const o=d,s=v;v=d=e;try{r=e.fn(t)}catch(t){return e.pure&&(p&&p.running?(e.tState=a,e.tOwned&&e.tOwned.forEach(R),e.tOwned=void 0):(e.state=a,e.owned&&e.owned.forEach(R),e.owned=null)),e.updatedAt=n+1,Y(t)}finally{v=s,d=o}(!e.updatedAt||e.updatedAt<=n)&&(null!=e.updatedAt&&"observers"in e?V(e,r,!0):p&&p.running&&e.pure?(p.sources.add(e),e.tValue=r):e.value=r,e.updatedAt=n)}function L(e,t,n,r=a,o){const s={fn:e,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:d,context:d?d.context:null,pure:n};if(p&&p.running&&(s.state=0,s.tState=r),null===d||d!==u&&(p&&p.running&&d.pure?d.tOwned?d.tOwned.push(s):d.tOwned=[s]:d.owned?d.owned.push(s):d.owned=[s]),h&&s.fn){const[e,t]=x(void 0,{equals:!1}),n=h.factory(s.fn,t);P((()=>n.dispose()));const r=()=>function(e){if(p&&p.running)return e(),p.done;const t=v,n=d;return Promise.resolve().then((()=>{let r;return v=t,d=n,(g||E)&&(r=p||(p={sources:new Set,effects:[],promises:new Set,disposed:new Set,queue:new Set,running:!0}),r.done||(r.done=new Promise((e=>r.resolve=e))),r.running=!0),D(e,!1),v=d=null,r?r.done:void 0}))}(t).then((()=>o.dispose())),o=h.factory(s.fn,r);s.fn=t=>(e(),p&&p.running?o.track(t):n.track(t))}return s}function M(e){const t=p&&p.running;if(0===(t?e.tState:e.state))return;if((t?e.tState:e.state)===c)return H(e);if(e.suspense&&O(e.suspense.inFallback))return e.suspense.effects.push(e);const n=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<b);){if(t&&p.disposed.has(e))return;(t?e.tState:e.state)&&n.push(e)}for(let r=n.length-1;r>=0;r--){if(e=n[r],t){let t=e,o=n[r+1];for(;(t=t.owner)&&t!==o;)if(p.disposed.has(t))return}if((t?e.tState:e.state)===a)q(e);else if((t?e.tState:e.state)===c){const t=y;y=null,D((()=>H(e,n[0])),!1),y=t}}}function D(e,t){if(y)return e();let n=!1;t||(y=[]),m?n=!0:m=[],b++;try{const t=e();return function(e){if(y&&(g&&p&&p.running?function(e){for(let t=0;t<e.length;t++){const n=e[t],r=p.queue;r.has(n)||(r.add(n),g((()=>{r.delete(n),D((()=>{p.running=!0,M(n)}),!1),p&&(p.running=!1)})))}}(y):U(y),y=null),e)return;let t;if(p)if(p.promises.size||p.queue.size){if(p.running)return p.running=!1,p.effects.push.apply(p.effects,m),m=null,void N(!0)}else{const e=p.sources,n=p.disposed;m.push.apply(m,p.effects),t=p.resolve;for(const e of m)"tState"in e&&(e.state=e.tState),delete e.tState;p=null,D((()=>{for(const e of n)R(e);for(const t of e){if(t.value=t.tValue,t.owned)for(let e=0,n=t.owned.length;e<n;e++)R(t.owned[e]);t.tOwned&&(t.owned=t.tOwned),delete t.tValue,delete t.tOwned,t.tState=0}N(!1)}),!1)}const n=m;m=null,n.length&&D((()=>l(n)),!1),t&&t()}(n),t}catch(e){n||(m=null),y=null,Y(e)}}function U(e){for(let t=0;t<e.length;t++)M(e[t])}function F(n){let r,o=0;for(r=0;r<n.length;r++){const e=n[r];e.user?n[o++]=e:M(e)}if(e.context){if(e.count)return e.effects||(e.effects=[]),void e.effects.push(...n.slice(0,o));e.effects&&(n=[...e.effects,...n],o+=e.effects.length,delete e.effects),t()}for(r=0;r<o;r++)M(n[r])}function H(e,t){const n=p&&p.running;n?e.tState=0:e.state=0;for(let r=0;r<e.sources.length;r+=1){const o=e.sources[r];if(o.sources){const e=n?o.tState:o.state;e===a?o!==t&&(!o.updatedAt||o.updatedAt<b)&&M(o):e===c&&H(o,t)}}}function K(e){const t=p&&p.running;for(let n=0;n<e.observers.length;n+=1){const r=e.observers[n];(t?r.tState:r.state)||(t?r.tState=c:r.state=c,r.pure?y.push(r):m.push(r),r.observers&&K(r))}}function R(e){let t;if(e.sources)for(;e.sources.length;){const t=e.sources.pop(),n=e.sourceSlots.pop(),r=t.observers;if(r&&r.length){const e=r.pop(),o=t.observerSlots.pop();n<r.length&&(e.sourceSlots[o]=n,r[n]=e,t.observerSlots[n]=o)}}if(p&&p.running&&e.pure){if(e.tOwned){for(t=e.tOwned.length-1;t>=0;t--)R(e.tOwned[t]);delete e.tOwned}z(e,!0)}else if(e.owned){for(t=e.owned.length-1;t>=0;t--)R(e.owned[t]);e.owned=null}if(e.cleanups){for(t=e.cleanups.length-1;t>=0;t--)e.cleanups[t]();e.cleanups=null}p&&p.running?e.tState=0:e.state=0}function z(e,t){if(t||(e.tState=0,p.disposed.add(e)),e.owned)for(let t=0;t<e.owned.length;t++)z(e.owned[t])}function G(e){return e instanceof Error?e:new Error("string"==typeof e?e:"Unknown error",{cause:e})}function X(e,t,n){try{for(const n of t)n(e)}catch(e){Y(e,n&&n.owner||null)}}function Y(e,t=d){const n=i&&t&&t.context&&t.context[i],r=G(e);if(!n)throw r;m?m.push({fn(){X(r,n,t)},state:a}):X(r,n,t)}function W(e){if("function"==typeof e&&!e.length)return W(e());if(Array.isArray(e)){const t=[];for(let n=0;n<e.length;n++){const r=W(e[n]);Array.isArray(r)?t.push.apply(t,r):t.push(r)}return t}return e}function J(e,t){return function(t){let n;return A((()=>n=O((()=>(d.context={...d.context,[e]:t.value},C((()=>t.children)))))),void 0),n}}const Q=Symbol("fallback");function Z(e){for(let t=0;t<e.length;t++)e[t]()}let ee=!1;function te(n,r){if(ee&&e.context){const o=e.context;t({...e.context,id:`${e.context.id}${e.context.count++}-`,count:0});const s=O((()=>n(r||{})));return t(o),s}return O((()=>n(r||{})))}function ne(){return!0}const re={get:(e,t,n)=>t===r?n:e.get(t),has:(e,t)=>t===r||e.has(t),set:ne,deleteProperty:ne,getOwnPropertyDescriptor:(e,t)=>({configurable:!0,enumerable:!0,get:()=>e.get(t),set:ne,deleteProperty:ne}),ownKeys:e=>e.keys()};function oe(e){return(e="function"==typeof e?e():e)?e:{}}function se(){for(let e=0,t=this.length;e<t;++e){const t=this[e]();if(void 0!==t)return t}}function ie(...e){let t=!1;for(let n=0;n<e.length;n++){const o=e[n];t=t||!!o&&r in o,e[n]="function"==typeof o?(t=!0,k(o)):o}if(t)return new Proxy({get(t){for(let n=e.length-1;n>=0;n--){const r=oe(e[n])[t];if(void 0!==r)return r}},has(t){for(let n=e.length-1;n>=0;n--)if(t in oe(e[n]))return!0;return!1},keys(){const t=[];for(let n=0;n<e.length;n++)t.push(...Object.keys(oe(e[n])));return[...new Set(t)]}},re);const n={},o=Object.create(null);for(let t=e.length-1;t>=0;t--){const r=e[t];if(!r)continue;const s=Object.getOwnPropertyNames(r);for(let e=s.length-1;e>=0;e--){const t=s[e];if("__proto__"===t||"constructor"===t)continue;const i=Object.getOwnPropertyDescriptor(r,t);if(o[t]){const e=n[t];e&&(i.get?e.push(i.get.bind(r)):void 0!==i.value&&e.push((()=>i.value)))}else o[t]=i.get?{enumerable:!0,configurable:!0,get:se.bind(n[t]=[i.get.bind(r)])}:void 0!==i.value?i:void 0}}const s={},i=Object.keys(o);for(let e=i.length-1;e>=0;e--){const t=i[e],n=o[t];n&&n.get?Object.defineProperty(s,t,n):s[t]=n?n.value:void 0}return s}function le(e){const t="fallback"in e&&{fallback:()=>e.fallback};return k(function(e,t,n={}){let r=[],s=[],i=[],l=0,a=t.length>1?[]:null;return P((()=>Z(i))),()=>{let c,u,f=e()||[];return f[o],O((()=>{let e,t,o,p,g,h,v,y,m,b=f.length;if(0===b)0!==l&&(Z(i),i=[],r=[],s=[],l=0,a&&(a=[])),n.fallback&&(r=[Q],s[0]=w((e=>(i[0]=e,n.fallback()))),l=1);else if(0===l){for(s=new Array(b),u=0;u<b;u++)r[u]=f[u],s[u]=w(d);l=b}else{for(o=new Array(b),p=new Array(b),a&&(g=new Array(b)),h=0,v=Math.min(l,b);h<v&&r[h]===f[h];h++);for(v=l-1,y=b-1;v>=h&&y>=h&&r[v]===f[y];v--,y--)o[y]=s[v],p[y]=i[v],a&&(g[y]=a[v]);for(e=new Map,t=new Array(y+1),u=y;u>=h;u--)m=f[u],c=e.get(m),t[u]=void 0===c?-1:c,e.set(m,u);for(c=h;c<=v;c++)m=r[c],u=e.get(m),void 0!==u&&-1!==u?(o[u]=s[c],p[u]=i[c],a&&(g[u]=a[c]),u=t[u],e.set(m,u)):i[c]();for(u=h;u<b;u++)u in o?(s[u]=o[u],i[u]=p[u],a&&(a[u]=g[u],a[u](u))):s[u]=w(d);s=s.slice(0,l=b),r=f.slice(0)}return s}));function d(e){if(i[u]=e,a){const[e,n]=x(u);return a[u]=n,t(f[u],e)}return t(f[u])}}}((()=>e.each),e.children,t||void 0))}function ae(e){const t=e.keyed,n=k((()=>e.when),void 0,{equals:(e,n)=>t?e===n:!e==!n});return k((()=>{const r=n();if(r){const o=e.children;return"function"==typeof o&&o.length>0?O((()=>o(t?r:()=>{if(!O(n))throw`Stale read from <${"Show"}>.`;return e.when}))):o}return e.fallback}),void 0,void 0)}!function(e,t){const n=Symbol("context");J(n)}();const ce=new Set(["className","value","readOnly","formNoValidate","isMap","noModule","playsInline","allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","hidden","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected"]),ue=new Set(["innerHTML","textContent","innerText","children"]),fe=Object.assign(Object.create(null),{className:"class",htmlFor:"for"}),de=Object.assign(Object.create(null),{class:"className",formnovalidate:{$:"formNoValidate",BUTTON:1,INPUT:1},ismap:{$:"isMap",IMG:1},nomodule:{$:"noModule",SCRIPT:1},playsinline:{$:"playsInline",VIDEO:1},readonly:{$:"readOnly",INPUT:1,TEXTAREA:1}}),pe=new Set(["beforeinput","click","dblclick","contextmenu","focusin","focusout","input","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"]),ge={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace"},he="_$DX_DELEGATE";function ve(e,t,n){let r;const o=()=>{const t=document.createElement("template");return t.innerHTML=e,n?t.content.firstChild.firstChild:t.content.firstChild},s=t?()=>O((()=>document.importNode(r||(r=o()),!0))):()=>(r||(r=o())).cloneNode(!0);return s.cloneNode=s,s}function ye(e,t=window.document){const n=t[he]||(t[he]=new Set);for(let r=0,o=e.length;r<o;r++){const o=e[r];n.has(o)||(n.add(o),t.addEventListener(o,Ae))}}function me(t,n,r){e.context||(null==r?t.removeAttribute(n):t.setAttribute(n,r))}function be(t,n){e.context||(null==n?t.removeAttribute("class"):t.className=n)}function we(e,t,n,r){if(void 0===n||r||(r=[]),"function"!=typeof t)return ke(e,t,r,n);A((r=>ke(e,t(),r,n)),r)}function xe(e,t,n){const r=t.trim().split(/\s+/);for(let t=0,o=r.length;t<o;t++)e.classList.toggle(r[t],n)}function Se(t,n,r,o,s,i){let l,a,c,u,f;if("style"===n)return function(e,t,n){if(!t)return n?me(e,"style"):t;const r=e.style;if("string"==typeof t)return r.cssText=t;let o,s;for(s in"string"==typeof n&&(r.cssText=n=void 0),n||(n={}),t||(t={}),n)null==t[s]&&r.removeProperty(s),delete n[s];for(s in t)o=t[s],o!==n[s]&&(r.setProperty(s,o),n[s]=o);return n}(t,r,o);if("classList"===n)return function(e,t,n={}){const r=Object.keys(t||{}),o=Object.keys(n);let s,i;for(s=0,i=o.length;s<i;s++){const r=o[s];r&&"undefined"!==r&&!t[r]&&(xe(e,r,!1),delete n[r])}for(s=0,i=r.length;s<i;s++){const o=r[s],i=!!t[o];o&&"undefined"!==o&&n[o]!==i&&i&&(xe(e,o,!0),n[o]=i)}return n}(t,r,o);if(r===o)return o;if("ref"===n)i||r(t);else if("on:"===n.slice(0,3)){const e=n.slice(3);o&&t.removeEventListener(e,o),r&&t.addEventListener(e,r)}else if("oncapture:"===n.slice(0,10)){const e=n.slice(10);o&&t.removeEventListener(e,o,!0),r&&t.addEventListener(e,r,!0)}else if("on"===n.slice(0,2)){const e=n.slice(2).toLowerCase(),s=pe.has(e);if(!s&&o){const n=Array.isArray(o)?o[0]:o;t.removeEventListener(e,n)}(s||r)&&(function(e,t,n,r){if(r)Array.isArray(n)?(e[`$$${t}`]=n[0],e[`$$${t}Data`]=n[1]):e[`$$${t}`]=n;else if(Array.isArray(n)){const r=n[0];e.addEventListener(t,n[0]=t=>r.call(e,n[1],t))}else e.addEventListener(t,n)}(t,e,r,s),s&&ye([e]))}else if("attr:"===n.slice(0,5))me(t,n.slice(5),r);else if((f="prop:"===n.slice(0,5))||(c=ue.has(n))||!s&&((u=function(e,t){const n=de[e];return"object"==typeof n?n[t]?n.$:void 0:n}(n,t.tagName))||(a=ce.has(n)))||(l=t.nodeName.includes("-"))){if(f)n=n.slice(5),a=!0;else if(e.context)return r;"class"===n||"className"===n?be(t,r):!l||a||c?t[u||n]=r:t[(d=n,d.toLowerCase().replace(/-([a-z])/g,((e,t)=>t.toUpperCase())))]=r}else{const o=s&&n.indexOf(":")>-1&&ge[n.split(":")[0]];o?function(t,n,r,o){e.context||(null==o?t.removeAttributeNS(n,r):t.setAttributeNS(n,r,o))}(t,o,n,r):me(t,fe[n]||n,r)}var d;return r}function Ae(t){const n=`$$${t.type}`;let r=t.composedPath&&t.composedPath()[0]||t.target;for(t.target!==r&&Object.defineProperty(t,"target",{configurable:!0,value:r}),Object.defineProperty(t,"currentTarget",{configurable:!0,get:()=>r||document}),e.registry&&!e.done&&(e.done=_$HY.done=!0);r;){const e=r[n];if(e&&!r.disabled){const o=r[`${n}Data`];if(void 0!==o?e.call(r,o,t):e.call(r,t),t.cancelBubble)return}r=r._$host||r.parentNode||r.host}}function ke(t,n,r,o,s){if(e.context){!r&&(r=[...t.childNodes]);let e=[];for(let t=0;t<r.length;t++){const n=r[t];8===n.nodeType&&"!$"===n.data.slice(0,2)?n.remove():e.push(n)}r=e}for(;"function"==typeof r;)r=r();if(n===r)return r;const i=typeof n,l=void 0!==o;if(t=l&&r[0]&&r[0].parentNode||t,"string"===i||"number"===i){if(e.context)return r;if("number"===i&&(n=n.toString()),l){let e=r[0];e&&3===e.nodeType?e.data!==n&&(e.data=n):e=document.createTextNode(n),r=_e(t,r,o,e)}else r=""!==r&&"string"==typeof r?t.firstChild.data=n:t.textContent=n}else if(null==n||"boolean"===i){if(e.context)return r;r=_e(t,r,o)}else{if("function"===i)return A((()=>{let e=n();for(;"function"==typeof e;)e=e();r=ke(t,e,r,o)})),()=>r;if(Array.isArray(n)){const i=[],a=r&&Array.isArray(r);if(Oe(i,n,r,s))return A((()=>r=ke(t,i,r,o,!0))),()=>r;if(e.context){if(!i.length)return r;if(void 0===o)return[...t.childNodes];let e=i[0],n=[e];for(;(e=e.nextSibling)!==o;)n.push(e);return r=n}if(0===i.length){if(r=_e(t,r,o),l)return r}else a?0===r.length?$e(t,i,o):function(e,t,n){let r=n.length,o=t.length,s=r,i=0,l=0,a=t[o-1].nextSibling,c=null;for(;i<o||l<s;)if(t[i]!==n[l]){for(;t[o-1]===n[s-1];)o--,s--;if(o===i){const t=s<r?l?n[l-1].nextSibling:n[s-l]:a;for(;l<s;)e.insertBefore(n[l++],t)}else if(s===l)for(;i<o;)c&&c.has(t[i])||t[i].remove(),i++;else if(t[i]===n[s-1]&&n[l]===t[o-1]){const r=t[--o].nextSibling;e.insertBefore(n[l++],t[i++].nextSibling),e.insertBefore(n[--s],r),t[o]=n[s]}else{if(!c){c=new Map;let e=l;for(;e<s;)c.set(n[e],e++)}const r=c.get(t[i]);if(null!=r)if(l<r&&r<s){let a,u=i,f=1;for(;++u<o&&u<s&&null!=(a=c.get(t[u]))&&a===r+f;)f++;if(f>r-l){const o=t[i];for(;l<r;)e.insertBefore(n[l++],o)}else e.replaceChild(n[l++],t[i++])}else i++;else t[i++].remove()}}else i++,l++}(t,r,i):(r&&_e(t),$e(t,i));r=i}else if(n.nodeType){if(e.context&&n.parentNode)return r=l?[n]:n;if(Array.isArray(r)){if(l)return r=_e(t,r,o,n);_e(t,r,null,n)}else null!=r&&""!==r&&t.firstChild?t.replaceChild(n,t.firstChild):t.appendChild(n);r=n}}return r}function Oe(e,t,n,r){let o=!1;for(let s=0,i=t.length;s<i;s++){let i,l=t[s],a=n&&n[e.length];if(null==l||!0===l||!1===l);else if("object"==(i=typeof l)&&l.nodeType)e.push(l);else if(Array.isArray(l))o=Oe(e,l,a)||o;else if("function"===i)if(r){for(;"function"==typeof l;)l=l();o=Oe(e,Array.isArray(l)?l:[l],Array.isArray(a)?a:[a])||o}else e.push(l),o=!0;else{const t=String(l);a&&3===a.nodeType&&a.data===t?e.push(a):e.push(document.createTextNode(t))}}return o}function $e(e,t,n=null){for(let r=0,o=t.length;r<o;r++)e.insertBefore(t[r],n)}function _e(e,t,n,r){if(void 0===n)return e.textContent="";const o=r||document.createTextNode("");if(t.length){let r=!1;for(let s=t.length-1;s>=0;s--){const i=t[s];if(o!==i){const t=i.parentNode===e;r||s?t&&i.remove():t?e.replaceChild(o,i):e.insertBefore(o,n)}else r=!0}}else e.insertBefore(o,n);return[o]}function Pe(e){var t,n,r="";if("string"==typeof e||"number"==typeof e)r+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(n=Pe(e[t]))&&(r&&(r+=" "),r+=n)}else for(n in e)e[n]&&(r&&(r+=" "),r+=n);return r}function je(){for(var e,t,n=0,r="",o=arguments.length;n<o;n++)(e=arguments[n])&&(t=Pe(e))&&(r&&(r+=" "),r+=t);return r}Symbol();const Ne=_;var Te=n.n(Ne);const Ce=$;var Ee=n.n(Ce),Be=n(210),Ve=ve("<svg><use fill=currentColor>");const qe="/packs/static/public/images/icons-f4ca0cd60cf43cc54f9a.svg";function Ie(e){const[t,n]=function(e,...t){if(r in e){const n=new Set(t.length>1?t.flat():t[0]),r=t.map((t=>new Proxy({get:n=>t.includes(n)?e[n]:void 0,has:n=>t.includes(n)&&n in e,keys:()=>t.filter((t=>t in e))},re)));return r.push(new Proxy({get:t=>n.has(t)?void 0:e[t],has:t=>!n.has(t)&&t in e,keys:()=>Object.keys(e).filter((e=>!n.has(e)))},re)),r}const n={},o=t.map((()=>({})));for(const r of Object.getOwnPropertyNames(e)){const s=Object.getOwnPropertyDescriptor(e,r),i=!s.get&&!s.set&&s.enumerable&&s.writable&&s.configurable;let l=!1,a=0;for(const e of t)e.includes(r)&&(l=!0,i?o[a][r]=s.value:Object.defineProperty(o[a],r,s)),++a;l||(i?n[r]=s.value:Object.defineProperty(n,r,s))}return[...o,n]}(e,["name","id","class"]);return o=Ve(),s=o.firstChild,function(e,t={},n,r){const o={};r||A((()=>o.children=ke(e,t.children,o.children))),A((()=>t.ref&&t.ref(e))),A((()=>function(e,t,n,r,o={},s=!1){t||(t={});for(const r in o)if(!(r in t)){if("children"===r)continue;o[r]=Se(e,r,null,o[r],n,s)}for(const i in t){if("children"===i){r||ke(e,t.children);continue}const l=t[i];o[i]=Se(e,i,l,o[i],n,s)}}(e,t,n,!0,o,!0)))}(o,ie({get class(){return je("icon","svg-icon","".concat(t.name,"-icon"),t.class)}},n),!0,!0),A((()=>{var e;return me(s,"href","".concat(qe,"#").concat(null!==(e=t.id)&&void 0!==e?e:t.name))})),o;var o,s}function Le(e){return te(Ie,ie(e,{name:"spinner",viewBox:"0 0 512 512",get class(){return je("animate-spin",e.class)}}))}function Me(e){return te(Ie,ie(e,{name:"chevron-down",viewBox:"0 0 448 512"}))}var De=ve('<span class="nested-tag-icon text-muted select-none">'),Ue=ve('<li class="flex items-center gap-1 w-fit leading-none"><input type=checkbox tabindex=-1><span><a>'),Fe=ve("<ul class=tag-list>"),He=ve('<div class="tag-column card p-2 h-fit space-y-1 preview-related-tags-column"><div class="related-tags-header flex items-center justify-between gap-2 pr-2 cursor-pointer select-none"><h6> Preview</h6><div><a class="button-outline-primary button-xs">refresh</a> <a class="button-outline-primary button-xs">expand</a> <a class="button-outline-primary button-xs">compact');GM_addStyle(Be.A);const Ke=Ee()("#post_tag_string"),Re=Ee()("#post_old_tag_string");function ze(e){const t=[],n=e.match(/^(.+)_\(cosplay\)$/i);if(n){const[,e]=n;t.push(e),t.push("cosplay")}return e.match(/_school_uniform$/i)&&t.push("school_uniform"),e.match(/_\(meme\)$/i)&&t.push("meme"),t}function Ge(e){return Danbooru.Utility.splitWords(e.toLowerCase())}const Xe=e=>{return n=(t=Ue()).firstChild.nextSibling,r=n.firstChild,we(t,te(ae,{get when(){return e.level>0},get children(){var t=De();return we(t,(()=>e.alias?"￩":"↳")),A((()=>null!="".concat(.75*(e.level-1),"rem")?t.style.setProperty("margin-left","".concat(.75*(e.level-1),"rem")):t.style.removeProperty("margin-left"))),t}}),n),we(r,(()=>e.name.replaceAll("_"," "))),A((t=>{var n=je("break-words","tag-type-".concat(e.type),e.level>0&&"tag-nesting-level-".concat(e.level)),o=e.name,s=e.deprecated,i="/posts?tags=".concat(encodeURIComponent(e.name));return n!==t.e&&be(r,t.e=n),o!==t.t&&me(r,"data-tag-name",t.t=o),s!==t.a&&me(r,"data-is-deprecated",t.a=s),i!==t.o&&me(r,"href",t.o=i),t}),{e:void 0,t:void 0,a:void 0,o:void 0}),t;var t,n,r},Ye=e=>te(le,{get each(){return Te()(e.tree).map(((e,t)=>({name:t,...e}))).sortBy((e=>e.name)).sortBy((e=>!e.deprecated)).sortBy((e=>e.category||Number.POSITIVE_INFINITY)).value()},children:t=>[te(Xe,{get name(){return t.name},get type(){return t.category},get deprecated(){return t.deprecated},get level(){return e.level}}),te(le,{get each(){return[...t.aliases]},children:n=>te(Xe,{name:n,get type(){return t.category},get deprecated(){return t.deprecated},alias:!0,get level(){return e.level+1}})}),te(Ye,{get tree(){return t.implications},get level(){return e.level+1}})]}),We=e=>{return we(t=Fe(),te(Ye,{get tree(){return function(e){const t=function(n){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Te()(n).pickBy((e=>null===e.alias)).pickBy((e=>0!==r||Te().isEmpty(e.implications))).mapValues(((n,o)=>({category:n.category,deprecated:n.deprecated,aliases:Te()(e).pickBy((e=>e.alias===o)).keys().value(),implications:t(Te().pickBy(e,(e=>e.implications.includes(o))),r+1)}))).value()};return t(e)}(e.tags)},level:0})),t;var t},Je=()=>{const[t,n]=x(!0),[r,{refetch:o}]=function(t,n){let r=!1;const[o,{mutate:s,refetch:i}]=function(t,n,r){let o,s,i;2===arguments.length&&"object"==typeof n||1===arguments.length?(o=!0,s=t,i=n||{}):(o=t,s=n,i=r||{});let l=null,a=f,c=null,u=!1,d=!1,g="initialValue"in i,h="function"==typeof o&&k(o);const y=new Set,[m,b]=(i.storage||x)(i.initialValue),[w,A]=x(void 0),[$,_]=x(void 0,{equals:!1}),[P,j]=x(g?"ready":"unresolved");if(e.context){let t;c=`${e.context.id}${e.context.count++}`,"initial"===i.ssrLoadFrom?a=i.initialValue:e.load&&(t=e.load(c))&&(a=t)}function N(e,t,n,r){return l===e&&(l=null,void 0!==r&&(g=!0),e!==a&&t!==a||!i.onHydrated||queueMicrotask((()=>i.onHydrated(r,{value:t}))),a=f,p&&e&&u?(p.promises.delete(e),u=!1,D((()=>{p.running=!0,C(t,n)}),!1)):C(t,n)),t}function C(e,t){D((()=>{void 0===t&&b((()=>e)),j(void 0!==t?"errored":g?"ready":"unresolved"),A(t);for(const e of y.keys())e.decrement();y.clear()}),!1)}function B(){const e=E&&T(E),t=m(),n=w();if(void 0!==n&&!l)throw n;return v&&!v.user&&e&&S((()=>{$(),l&&(e.resolved&&p&&u?p.promises.add(l):y.has(e)||(e.increment(),y.add(e)))})),t}function V(e=!0){if(!1!==e&&d)return;d=!1;const t=h?h():o;if(u=p&&p.running,null==t||!1===t)return void N(l,O(m));p&&l&&p.promises.delete(l);const n=a!==f?a:O((()=>s(t,{value:m(),refetching:e})));return(r=n)&&"object"==typeof r&&"then"in r?(l=n,"value"in n?("success"===n.status?N(l,n.value,void 0,t):N(l,void 0,void 0,t),n):(d=!0,queueMicrotask((()=>d=!1)),D((()=>{j(g?"refreshing":"pending"),_()}),!1),n.then((e=>N(n,e,void 0,t)),(e=>N(n,void 0,G(e),t))))):(N(l,n,void 0,t),n);var r}return Object.defineProperties(B,{state:{get:()=>P()},error:{get:()=>w()},loading:{get(){const e=P();return"pending"===e||"refreshing"===e}},latest:{get(){if(!g)return B();const e=w();if(e&&!l)throw e;return m()}}}),h?S((()=>V(!1))):V(!1),[B,{refetch:V,mutate:b}]}(((e,t)=>r?async function(){const e={category:0,deprecated:!1,alias:null,implications:[]},t=Ge(null!==(n=Ke.val())&&void 0!==n?n:"");var n;const r=Te()(t).keyBy().mapValues((()=>e)).value(),o=[];for(;;){const t=Te()(r).keys().difference(o).slice(0,1e3).value();if(o.push(...t),Te().isEmpty(t))break;(await Ee().post("/tags.json",{_method:"get",limit:1e3,only:"name,category,is_deprecated,antecedent_alias[consequent_name],antecedent_implications[consequent_name]",search:{name_array:t}})).forEach((t=>{var n,o,s,i;const l=r[t.name]={category:t.category,deprecated:t.is_deprecated,alias:null!==(n=null===(o=t.antecedent_alias)||void 0===o?void 0:o.consequent_name)&&void 0!==n?n:null,implications:[...t.antecedent_implications.map((e=>e.consequent_name)),...ze(t.name)]};null!==l.alias&&(null!==(i=r[s=l.alias])&&void 0!==i||(r[s]=e));for(const t of l.implications){var a;null!==(a=r[t])&&void 0!==a||(r[t]=e)}}))}return r}():n.initialValue),n);return[o,{mutate:s,refetch:e=>(r=!0,i(e))}]}(0,{initialValue:{}});!function(e,t,n){l=F;const r=L(e,t,!1,a),o=E&&T(E);o&&(r.suspense=o),n&&n.render||(r.user=!0),m?m.push(r):q(r)}(function(e,t,n){const r=Array.isArray(e);let o,s=n&&n.defer;return t=>{let n;if(r){n=Array(e.length);for(let t=0;t<e.length;t++)n[t]=e[t]()}else n=e();if(s)return void(s=!1);const i=O((()=>Danbooru.RelatedTag.update_selected()));return o=n,i}}(r,0,{defer:!0}));const s=e=>{let t=function(e){let{deprecated:t=!0,aliased:n=!0,implicated:r=!0}=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};const o=Ge(null!==(s=Re.val())&&void 0!==s?s:"");var s;const i=Te()(e).map((e=>e.implications)).flatten().uniq().value();return Te()(e).map(((e,t)=>({name:t,...e}))).filter((e=>!0===t||!e.deprecated||"keep"===t&&o.includes(e.name))).filter((e=>n||null===e.alias)).filter((e=>r||!i.includes(e.name))).sortBy((e=>e.name)).groupBy((e=>e.category)).values().sortBy((e=>e[0].category||Number.POSITIVE_INFINITY)).map((e=>Te()(e).map((e=>e.name)).join(" "))).join("\n")}(r(),e);t="".concat(t," "),Ke.val()!==t&&(Ke.val(t),Danbooru.RelatedTag.update_selected(),Ke.trigger("input"))};return d=(u=(c=(i=He()).firstChild).firstChild).firstChild,b=(y=(h=(g=u.nextSibling).firstChild).nextSibling.nextSibling).nextSibling.nextSibling,c.$$click=e=>{e.preventDefault(),e.stopPropagation(),n((e=>!e)),t()||0!==e.button||e.ctrlKey||e.shiftKey||e.metaKey||e.altKey||o()},we(u,te(Le,{get class(){return je("text-muted","align-middle",r.loading||"invisible")}}),d),h.$$click=e=>{e.preventDefault(),e.stopPropagation(),o()},y.$$click=e=>{e.preventDefault(),e.stopPropagation(),s({deprecated:"keep",aliased:!1,implicated:!0})},b.$$click=e=>{e.preventDefault(),e.stopPropagation(),s({deprecated:"keep",aliased:!1,implicated:!1})},we(c,te(Me,{get class(){return je("link-color",t()&&"rotate-180")}}),null),we(i,te(ae,{get when(){return!(t()||r.loading)},get children(){return te(We,{get tags(){return r()}})}}),null),A((()=>be(g,je("text-sm","ml-auto",t()&&"hidden")))),i;var i,c,u,d,g,h,y,b},Qe=Ee()("#related-tags-container");1===Qe.length&&w((()=>Qe.prepend(te(Je,{})))),ye(["click"])})()})();