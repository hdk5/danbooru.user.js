// ==UserScript==
// @name         XHS - Copy DText
// @author       hdk5
// @version      20250812131415
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/xhs-copy-dtext.user.js
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/xhs-copy-dtext.user.js
// @match        https://www.xiaohongshu.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/jquery-ui.min.js
// ==/UserScript==

/* globals
  $
*/

$('head').append($('<link>', {
  rel: 'stylesheet',
  type: 'text/css',
  href: '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css',
}));

function convertHtml(el) {
  return $(el).contents().filter(function () {
    return this.nodeType === Node.ELEMENT_NODE || this.nodeType === Node.TEXT_NODE;
  }).map(function () {
    const $node = $(this);

    if ($node.hasClass('tag')) {
      // TPT fucks up the layout a bit - can't use just .text()
      const tag = $node.contents().filter(function () {
        return this.nodeType === Node.TEXT_NODE;
      }).text();
      return `"${tag}":[https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(tag.slice(1))}]`;
    }

    if ($node.hasClass('note-content-user')) {
      const user = $node.text().trim();
      const userId = $node.attr('data-user-id');
      return `"${user}":[https://www.xiaohongshu.com/user/profile/${userId}]`;
    }

    if ($node.hasClass('note-content-emoji')) {
      const emojiUrl = $node.attr('src');
      return `"[emoji]":[${emojiUrl}]`;
    }

    if (this.nodeType === Node.ELEMENT_NODE) {
      console.warn('Unsupported element:', this);
    }

    return $node.text();
  }).get().join('');
}

function addButtons() {
  $('.note-text:not(:has(+ .ex-copy-dtext))').each(function () {
    const note = this;
    const $note = $(note);

    const $btn = $('<a>', {
      class: 'ex-copy-dtext',
      text: 'Copy DText',
      css: {
        display: 'block',
        cursor: 'pointer',
      },
    });

    $btn.on('click', (ev) => {
      ev.preventDefault();
      const output = convertHtml(note);
      $('<div>', {
        title: 'Copy DText',
        html: [
          $('<textarea>', {
            readonly: true,
            css: {
              width: '100%',
              height: '200px',
              boxSizing: 'border-box',
            },
            val: output,
          }),
        ],
      }).dialog({
        modal: true,
        width: 600,
        buttons: [
          {
            text: 'Copy',
            click() {
              navigator.clipboard.writeText(output);
              $(this).dialog('close');
            },
          },
          {
            text: 'Close',
            click() {
              $(this).dialog('close');
            },
          },
        ],
      });
    });

    $note.after($btn);
  });
}

new MutationObserver(addButtons).observe(document.body, { childList: true, subtree: true });
