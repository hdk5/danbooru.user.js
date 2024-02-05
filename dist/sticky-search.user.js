// ==UserScript==
// @name         Danbooru - Sticky Search
// @author       hdk5
// @version      20240205210841
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/sticky-search.user.js
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/sticky-search.user.js
// @match        *://*.donmai.us/*
// @grant        none
// ==/UserScript==

(() => {
  const $aIndex = $('#c-posts #a-index')

  if ($aIndex.length === 0)
    return

  const $sticky = $('<div>')
  $sticky.css('position', 'sticky')
  $sticky.css('top', '-1.35em')
  $sticky.css('z-index', '1')
  $aIndex.prepend($sticky)

  const $searchBox = $('#search-box')
  $searchBox.css('background', 'var(--body-background-color)')
  $searchBox.css('padding-bottom', '0.5em')
  $sticky.append($searchBox)

  const $pmmSelectControls = $('#pmm-select-controls')

  if ($pmmSelectControls.length === 0)
    return

  $searchBox.css('padding-bottom', '0')

  const $modeBox = $('#mode-box')
  $sticky.append($modeBox)

  $pmmSelectControls.prev().css('background', 'var(--body-background-color)')
  $pmmSelectControls.prev().css('padding-bottom', '0.5em')
  $pmmSelectControls.prev().css('padding-right', '0.5em')

  $pmmSelectControls.css('background', 'var(--body-background-color)')
  $pmmSelectControls.css('margin', '0')
  $pmmSelectControls.css('padding', '0')
  $pmmSelectControls.css('padding-bottom', '0.5em')

  const $pmmApplyAll = $('#pmm-apply-all')

  const $tagScriptField = $('#tag-script-field')

  const $tagScriptFieldWrap = $tagScriptField.wrap('<div>').parent()
  $tagScriptFieldWrap.css('flex-grow', '1')
  $tagScriptFieldWrap.css('height', '100%')
  $tagScriptFieldWrap.css('padding-left', '0.5em')
  $tagScriptFieldWrap.css('padding-bottom', '0.5em')
  $tagScriptFieldWrap.css('background', 'var(--body-background-color)')

  $pmmSelectControls.append($pmmApplyAll)
  $pmmSelectControls.after($tagScriptFieldWrap)

  $('#pmm-select-only-input').css('border', 'none')
})()
