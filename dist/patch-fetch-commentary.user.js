// ==UserScript==
// @name         Danbooru - Patch Fetch Commentary
// @author       hdk5
// @version      20250203155337
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/patch-fetch-commentary.user.js
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/patch-fetch-commentary.user.js
// @match        *://*.donmai.us/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

/* globals
  GM
  GM_addStyle
  GM_getValue
  GM_setValue

  $
  Danbooru
*/

// Set "booru" value in your userscript manager's settings
if (GM_getValue('booru') === undefined) {
  GM_setValue('booru', 'https://danbooru.donmai.us')
}

const _from_source = Danbooru.ArtistCommentary.from_source
const from_source = async function (source) {
  const booru = GM_getValue('booru')
  const request = await GM.xmlHttpRequest({
    url: `${booru}/source.json?url=${encodeURIComponent(source)}`,
    responseType: 'json',
  })
  const data = request.response

  return {
    original_title: data.artist_commentary.dtext_title,
    original_description: data.artist_commentary.dtext_description,
    source,
  }
}

const _fill_commentary = Danbooru.ArtistCommentary.fill_commentary
Danbooru.ArtistCommentary.fill_commentary = function (...args) {
  Danbooru.ArtistCommentary.from_source = _from_source
  return _fill_commentary.apply(this, args)
}

GM_addStyle(`
  form#fetch-commentary input#commentary_source {
    max-width: 63%;
  }
`)

const $submit = $('#fetch-commentary button[type="submit"]')
const $patched_submit = $('<button/>', {
  text: 'Fetch (alt.)',
})
$submit.after($patched_submit)
$patched_submit.before(' ')
$patched_submit.on('click', () => {
  Danbooru.ArtistCommentary.from_source = from_source
  return Danbooru.ArtistCommentary.fetch_commentary()
})
