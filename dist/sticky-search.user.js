// ==UserScript==
// @name         Danbooru - Sticky Search
// @author       hdk5
// @version      20241106223343
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/sticky-search.user.js
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/sticky-search.user.js
// @match        *://*.donmai.us/*
// @grant        GM_addStyle
// ==/UserScript==

/* globals
  GM_addStyle
  $
*/

(() => {
  const $aIndex = $('#c-posts #a-index')

  if ($aIndex.length === 0)
    return

  const $sticky = $('<div>')
  $sticky.css('position', 'sticky')
  $sticky.css('top', '-20px')
  $sticky.css('z-index', '1')
  $aIndex.prepend($sticky)

  const $searchBox = $('#search-box')
  $searchBox.css('background', 'var(--body-background-color)')
  $searchBox.css('padding-bottom', '0.5em')
  $sticky.append($searchBox)

  const $pmmSelectControls = $('#pmm-select-controls')

  if ($pmmSelectControls.length === 0)
    return

  GM_addStyle(`
    #pmm-selection-buttons {
      display: flex;
    }

    button.pmm-select {
      flex-grow: 1;
      padding-left: 0;
      padding-right: 0;
    }
  `)

  const $modeBox = $('#mode-box')
  $modeBox.css('position', 'sticky')
  $modeBox.css('top', '25px')

  $modeBox.css('background', 'var(--body-background-color)')
  $modeBox.css('margin-top', '-0.5em')

  const $tagScriptField = $('#tag-script-field')
  $tagScriptField.css('margin', '0')

  const $tagScriptFieldWrap = $tagScriptField.wrap('<div>').parent()
  $tagScriptFieldWrap.css('position', 'sticky')
  $tagScriptFieldWrap.css('top', '32px')
  $tagScriptFieldWrap.css('z-index', '1')
  $tagScriptFieldWrap.css('background', 'var(--body-background-color)')
  $tagScriptFieldWrap.css('margin-left', '-12px')
  $tagScriptFieldWrap.css('padding-bottom', '0.5em')

  $('#post-sections').before($tagScriptFieldWrap)
  $('#pmm-select-only-input').css('border', 'none')
})()
