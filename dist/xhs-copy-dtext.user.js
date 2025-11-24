// ==UserScript==
// @name         XHS - Copy DText
// @author       hdk5
// @version      20251124011001
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

function reprNode(node) {
  const tag = node.tagName.toLowerCase();
  const id = node.id ? `#${node.id}` : '';
  const cls = node.className.split(' ').map(c => `.${c}`).join('');
  return `${tag}${id}${cls}`;
}

function convertHtml(el) {
  const errors = [];
  const text = $(el).contents().filter(function () {
    return this.nodeType === Node.ELEMENT_NODE;
  }).map(function () {
    const $node = $(this);

    const redmojiMap = window.__INITIAL_STATE__?.redMoji?.mojiData?._rawValue?.redmojiMap || {};
    const redmojiMapInvert = Object.fromEntries(
      Object.entries(redmojiMap).map(([key, value]) => [value, key]),
    );

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
      const emojiTag = redmojiMapInvert[emojiUrl] || '[emoji]';
      return `"${emojiTag}":[${emojiUrl}]`;
    }

    if (
      this.tagName !== 'SPAN'
      || this.id !== ''
      || this.className !== ''
    ) {
      errors.push(`Unsupported element: ${reprNode(this)}`);
      console.warn('Unsupported element:', this);
    }

    return $node.text();
  }).get().join('');

  return { text, errors };
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
      const { text, errors } = convertHtml(note);
      const $dialog = $('<div>', {
        title: 'Copy DText',
      });

      if (errors.length) {
        $('<div>', {
          text: 'Errors:',
          css: {
            fontWeight: 'bold',
          },
        }).appendTo($dialog);
        $('<textarea>', {
          readonly: true,
          css: {
            width: '100%',
            height: '50px',
            boxSizing: 'border-box',
            marginBottom: '0.5em',
          },
          val: errors.join('\n'),
        }).appendTo($dialog);
      }

      $('<div>', {
        text: 'DText:',
        css: {
          fontWeight: 'bold',
        },
      }).appendTo($dialog);
      $('<textarea>', {
        readonly: true,
        css: {
          width: '100%',
          height: '200px',
          boxSizing: 'border-box',
        },
        val: text,
      }).appendTo($dialog);

      $dialog.dialog({
        modal: true,
        width: 600,
        buttons: [
          {
            text: 'Copy',
            click() {
              navigator.clipboard.writeText(text);
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
