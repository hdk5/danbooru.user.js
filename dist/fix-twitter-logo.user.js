// ==UserScript==
// @name         Danbooru - Fix Twitter logo
// @author       hdk5
// @version      20260203091517
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/fix-twitter-logo.user.js
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/fix-twitter-logo.user.js
// @match        *://*.donmai.us/*
// @run-at       document-start
// @resource     logo https://raw.githubusercontent.com/danbooru/danbooru/37f7af7bc484a4274782f257c3d79664a0d76692/public/images/twitter-logo.png
// @grant        GM_getResourceURL
// ==/UserScript==

/* globals
  GM_getResourceURL
*/

const replacementUrl = GM_getResourceURL('logo');
const pattern = /\/packs\/static\/twitter-logo-[a-z0-9]+\.png$/i;

function shouldReplace(img) {
  try {
    return pattern.test(new URL(img.src, location.href).pathname);
  }
  catch {
    return false;
  }
}

function replaceImg(img) {
  if (shouldReplace(img)) {
    img.src = replacementUrl;
  }
}

function replaceImgs(context = document) {
  context.querySelectorAll('img').forEach(replaceImg);
}

replaceImgs();

new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          if (node.tagName === 'IMG') {
            replaceImg(node);
          }
          else {
            replaceImgs(node);
          }
        }
      }
    }
    else if (mutation.type === 'attributes') {
      if (mutation.target.tagName === 'IMG' && mutation.attributeName === 'src') {
        replaceImg(mutation.target);
      }
    }
  }
}).observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
});
