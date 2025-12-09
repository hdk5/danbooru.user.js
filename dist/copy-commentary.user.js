// ==UserScript==
// @name         Danbooru - Copy Commentary
// @author       hdk5
// @version      20251209215808
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/copy-commentary.user.js
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/copy-commentary.user.js
// @match        *://*.donmai.us/*
// @grant        GM_addStyle
// ==/UserScript==

/* globals
  GM_addStyle
  $
*/

/* eslint-disable no-use-before-define */

const CSS = `
  .copy-commentary summary {
    font-weight: bold;
  }

  .copy-commentary-query {
    display: grid;
    grid-template-columns: auto 1fr auto;
    column-gap: 0.5rem;
    align-items: center;
  }

  .copy-commentary-shortcuts {
    grid-column: 2 / 3;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .copy-commentary-status-pending,
  .copy-commentary-status-processing {
    color: var(--orange-3);
  }

  .copy-commentary-status-success {
    color: var(--green-3);
  }

  .copy-commentary-status-error {
    color: var(--red-3);
  }

  .copy-commentary-results-table {
    display: inline-block;
  }

  .copy-commentary-results-table th,
  .copy-commentary-results-table td {
    padding: 0.25rem;
    vertical-align: middle;
  }

  .copy-commentary-col-select,
  .copy-commentary-cell-select {
    width: 1%;
    white-space: nowrap;
  }

  .copy-commentary-col-id,
  .copy-commentary-cell-id {
    min-width: 1rem;
  }

  .copy-commentary-col-status,
  .copy-commentary-cell-status {
    min-width: 1rem;
    white-space: nowrap;
  }

  .copy-commentary-results-table:has(tbody:empty) {
    display: none;
  }

  .copy-commentary-results-table:has(tbody:empty) + .copy-commentary-submit-button {
    display: none;
  }

  .copy-commentary-submit-button {
    display: block;
  }
`;

setTimeout(() => {
  const $addCommentaryDialog = $('#add-commentary-dialog');
  if ($addCommentaryDialog.length === 0) {
    return;
  }

  GM_addStyle(CSS);

  const postId = $('body').data('post-id');

  const $shortcutsWrapper = $('<div>', { class: 'copy-commentary-shortcuts' });
  let defaultQuery = `id:${postId}`;

  const hasChildren = $('body').data('post-has-children') === 'true';
  if (hasChildren) {
    const childrenQuery = `parent:${postId}`;
    defaultQuery = childrenQuery;
    const $childrenShortcut = $('<a>', {
      href: '#',
      text: 'Children',
      class: 'text-xs mr-2',
      click: ev => onClickShortcut(ev, childrenQuery),
    });
    $shortcutsWrapper.append($childrenShortcut);
  }

  const parentId = $('body').data('post-parent-id');
  if (parentId) {
    const parentQuery = `id:${parentId}`;
    const $parentShortcut = $('<a>', {
      href: '#',
      text: 'Siblings',
      class: 'text-xs mr-2',
      click: ev => onClickShortcut(ev, parentQuery),
    });
    $shortcutsWrapper.append($parentShortcut);
  }

  const pixivId = $('body').data('post-pixiv-id');
  if (pixivId) {
    const pixivQuery = `pixiv_id:${pixivId}`;
    const $pixivShortcut = $('<a>', {
      href: '#',
      text: 'Pixiv',
      class: 'text-xs mr-2',
      click: ev => onClickShortcut(ev, pixivQuery),
    });
    $shortcutsWrapper.append($pixivShortcut);
  }

  const source = $('#post-info-source a:last').attr('href');
  const sourceQuery = `source:"${source}"`;
  const $sourceShortcut = $('<a>', {
    href: '#',
    text: 'Source',
    class: 'text-xs mr-2',
    click: ev => onClickShortcut(ev, sourceQuery),
  });
  $shortcutsWrapper.append($sourceShortcut);

  const $copyCommentaryDetails = $('<details>', { class: 'copy-commentary' });

  const $queryWrapper = $('<div>', { class: 'copy-commentary-query' });
  const $queryLabel = $('<label>', {
    for: 'copy-commentary-query-input',
    text: 'Query:',
  });
  const $queryInput = $('<input>', {
    type: 'text',
    id: 'copy-commentary-query-input',
    value: defaultQuery,
  });
  const $fetchButton = $('<button>', {
    type: 'button',
    text: 'Fetch',
    click: () => fetchPosts(),
  });
  $queryWrapper.append($queryLabel, $queryInput, $fetchButton, $shortcutsWrapper);

  const $resultsTable = $('<table>', { class: 'copy-commentary-results-table' });
  const $resultsThead = $('<thead>');
  const $headerRow = $('<tr>');
  const $selectAllCheckbox = $('<input>', { type: 'checkbox' });
  const $resultsTbody = $('<tbody>');
  $resultsTable.append($resultsThead, $resultsTbody);
  $resultsThead.append($headerRow);
  $headerRow.append(
    $('<th>', { class: 'copy-commentary-col-select' }).append($selectAllCheckbox),
    $('<th>', { class: 'copy-commentary-col-id', text: 'ID' }),
    $('<th>', { class: 'copy-commentary-col-status', text: 'Status' }),
  );

  $selectAllCheckbox.on('change', () => {
    const checked = $selectAllCheckbox.is(':checked');
    $selectAllCheckbox.prop('indeterminate', false);
    $resultsTbody.find('input[type="checkbox"]').each((_, checkbox) => {
      $(checkbox).prop('checked', checked).trigger('change');
    });
  });

  const $submitButton = $('<button>', {
    text: 'Apply',
    class: 'copy-commentary-submit-button',
    click: () => submitCommentary(),
  });

  $addCommentaryDialog.append($copyCommentaryDetails);
  $copyCommentaryDetails.append($('<summary>', { text: 'Copy Commentary' }));
  $copyCommentaryDetails.append($queryWrapper, $resultsTable, $submitButton);

  const fetchPosts = async () => {
    try {
      $resultsTbody.empty();
      updateSelectAllState();

      const tags = $queryInput.val()?.trim();
      if (!tags) {
        return;
      }

      $fetchButton.prop('disabled', true);

      const posts = await $.getJSON('/posts.json', {
        tags,
        only: 'id',
        limit: 200,
      });
      fillTable(posts.map(post => post.id));
    }
    finally {
      $fetchButton.prop('disabled', false);
      updateSelectAllState();
    }
  };

  const fillTable = (post_ids) => {
    for (const post_id of post_ids) {
      const $checkbox = $('<input>', {
        'type': 'checkbox',
        'data-post-id': post_id,
        'checked': true,
      });
      $checkbox.on('change', updateSelectAllState);

      const $row = $('<tr>');
      const $statusCell = $('<td>', { class: 'copy-commentary-cell-status' });
      setStatus($statusCell, 'pending');
      $row.append(
        $('<td>', { class: 'copy-commentary-cell-select' }).append($checkbox),
        $('<td>', { class: 'copy-commentary-cell-id' }).append(
          $('<a>', {
            href: `/posts/${post_id}`,
            text: `post #${post_id}`,
            class: 'dtext-link dtext-id-link dtext-post-id-link',
          }),
        ),
        $statusCell,
      );
      $resultsTbody.append($row);
    }
  };

  const submitCommentary = async () => {
    $submitButton.prop('disabled', true);
    const $checkedRows = $resultsTbody.find('input[type="checkbox"]:checked');
    const $form = $('#edit-commentary');
    const formData = new FormData($form.get(0));
    const payload = Object.fromEntries(formData.entries());

    for (const checkbox of $checkedRows) {
      const $checkbox = $(checkbox);
      const $row = $checkbox.closest('tr');
      const postId = $checkbox.data('post-id');
      const $statusCell = $row.find('.copy-commentary-cell-status');
      setStatus($statusCell, 'processing');

      try {
        await $.post(`/posts/${postId}/artist_commentary/create_or_update.json`, payload);

        $checkbox.prop('checked', false).trigger('change');
        setStatus($statusCell, 'success');
      }
      catch (error) {
        console.error('Failed to submit commentary', postId, error);
        setStatus($statusCell, 'error');
      }
    }
    updateSelectAllState();
    $submitButton.prop('disabled', false);
  };

  const updateSelectAllState = () => {
    const $checkboxes = $resultsTbody.find('input[type="checkbox"]');
    const total = $checkboxes.length;
    const checked = $checkboxes.filter(':checked').length;

    if (total === 0) {
      $selectAllCheckbox.prop('checked', false).prop('indeterminate', false);
    }
    else if (checked === total) {
      $selectAllCheckbox.prop('checked', true).prop('indeterminate', false);
    }
    else if (checked === 0) {
      $selectAllCheckbox.prop('checked', false).prop('indeterminate', false);
    }
    else {
      $selectAllCheckbox.prop('checked', false).prop('indeterminate', true);
    }
  };

  const setStatus = ($cell, status) => {
    $cell
      .removeClass(
        (_, className) => className
          .split(' ')
          .filter(cls => cls.startsWith('copy-commentary-status-'))
          .join(' '),
      )
      .addClass(`copy-commentary-status-${status}`)
      .text(status);
  };

  const onClickShortcut = (ev, tag) => {
    ev.preventDefault();
    $queryInput.val(tag);
    fetchPosts();
  };
}, 0);
