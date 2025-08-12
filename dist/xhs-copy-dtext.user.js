// ==UserScript==
// @name         XHS - Copy DText
// @author       hdk5
// @version      1
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/upload-to-gelbooru.user.js
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/upload-to-gelbooru.user.js
// @match        https://www.xiaohongshu.com/*
// @grant        none
// ==/UserScript==

function convertHtml(el) {
  let output = '';

  el.childNodes.forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.TEXT_NODE) {
      return;
    }

    if (node.id === 'hash-tag') {
      // TPT fucks up the layout a bit - can't use .innerText
      let tag = '';
      node.childNodes.forEach((cn) => {
        if (cn.nodeType === Node.TEXT_NODE) {
          tag += cn.textContent.trim();
        }
      });
      output += `"${tag}":[https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(tag.slice(1))}]`;
      return;
    }

    if (node.className === 'note-content-user') {
      const user = node.textContent.trim();
      const userId = node.getAttribute('data-user-id');
      output += `"${user}":[https://www.xiaohongshu.com/user/profile/${userId}]`;
      return;
    }

    if (node.className === 'note-content-emoji') {
      const emojiUrl = node.getAttribute('src');
      output += `"[emoji]":[${emojiUrl}]`;
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      console.warn('Unsupported element:', node);
    }

    output += node.textContent;
  });

  return output;
}

function addButtons() {
  document.querySelectorAll('.note-text:not(:has(+ .ex-copy-dtext))').forEach((note) => {
    const btn = document.createElement('a');
    btn.className = 'ex-copy-dtext';
    btn.textContent = 'Copy DText';
    btn.style.display = 'block';
    btn.style.cursor = 'pointer';

    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      const output = convertHtml(note);
      if (confirm(output)) {
        navigator.clipboard.writeText(output);
      };
    });

    note.insertAdjacentElement('afterend', btn);
  });
}

new MutationObserver(addButtons).observe(document.body, { childList: true, subtree: true });
