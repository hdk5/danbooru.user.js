// ==UserScript==
// @name         Danbooru - Frontpage
// @description  Bring back the front page and catgirls post counter
// @author       hdk5
// @version      20240820125452
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/frontpage.user.js
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/frontpage.user.js
// @run-at       document-start
// @match        *://*.donmai.us/
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @require      https://github.com/sizzlemctwizzle/GM_config/raw/4aa57fee9bea0a5a8a1a50d826ad90c1d0ad3707/gm_config.js
// ==/UserScript==

/* globals $ */

GM_addStyle(`body { visibility: hidden; }`)

const RESOURCE_HASH = '202ec3a9b9af44912b6b553cfea94f9d51b55882'
const THEMES = {
  'Gelbooru': { slug: 'gelbooru', ext: 'gif', rendering: 'pixelated' },
  'Gelbooru (NSFW)': { slug: 'gelbooru-h', ext: 'png', rendering: 'pixelated' },
  'Danbooru': { slug: 'danbooru', ext: 'gif', rendering: 'pixelated' },
  'Danbooru (NSFW)': { slug: 'danbooru-h', ext: 'png', rendering: 'pixelated' },
  'Rule 34 (animated)': { slug: 'rule34', ext: 'gif', rendering: 'pixelated' },
  'A-SOUL': { slug: 'asoul', ext: 'gif', rendering: 'pixelated' },
  'Girls Band Cry': { slug: 'garukura', ext: 'png', rendering: 'smooth' },
  'Lain Iwakura': { slug: 'lain', ext: 'png', rendering: 'smooth' },
  'Urushi Yaotome': { slug: 'urushi', ext: 'gif', rendering: 'smooth' },
}

GM_config.init({
  id: 'DanbooruFrontpageConfig',
  title: 'Danbooru Frontpage Settings',
  fields: {
    theme: {
      label: 'Theme',
      type: 'select',
      options: Object.keys(THEMES),
    },
  },
  frameStyle: `
    height: auto;
    width: 400px;
    position: fixed;
    z-index: 9999;
  `,
})

GM_registerMenuCommand('Settings', () => {
  GM_config.open()
})

function getCounterUrl(n, theme) {
  theme ??= GM_config.get('theme')
  const { slug, ext } = THEMES[theme]
  return `https://raw.githubusercontent.com/hdk5/danbooru.user.js/${RESOURCE_HASH}/resource/counter/${slug}/${n}.${ext}`
}

document.addEventListener('DOMContentLoaded', () => {
  const theme = GM_config.get('theme')
  const { rendering } = THEMES[theme]
  // https://gitlab.com/hdk5/danbooru/-/blob/c0e5fd445f81497e19391177b1fed6c831a6e391/app/javascript/src/styles/specific/static_index.scss
  GM_addStyle(`
header#top, nav#nav {
  text-align: center;
}

header#top {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1 1 0%;
}

header#top #app-name-header {
  font-size: 4em;
  margin-top: 1em;
  margin-left: auto;
  margin-right: auto;
  height: unset;
}

#maintoggle {
  display: none !important;
}

header#top nav#nav {
  display: block;
  margin-top: 1em;
  margin-bottom: 1em;
}

header#top nav#nav menu#main-menu {
  background-color: unset;
}

div#page {
  flex: 2 1 0%;
}

form#search-box-form {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2em;
  justify-content: center;
}

form#search-box-form input#tags {
  max-width: 400px;
}

div#counter-girls {
  display: flex;
  justify-content: center;
  margin-bottom: 2em;
  margin-left: auto;
  margin-right: auto;
}

div.counter-girl img {
  height: 150px;
  image-rendering: ${rendering};
}
  `)

  // https://gitlab.com/hdk5/danbooru/-/blob/c0e5fd445f81497e19391177b1fed6c831a6e391/app/views/static/index.html.erb
  const $cStatic = $(`<div id="c-static"></div>`)
  const $aIndex = $('<div id="a-index"></div>')
  $cStatic.append($aIndex)

  const $searchBoxForm = $('form#search-box-form')
  $aIndex.append($searchBoxForm)

  const postCount = $('article[data-id]').attr('data-id') || ''
  const $counterGirls = $(`<div id="counter-girls"></div>`)
  postCount.split('').forEach((n) => {
    $counterGirls.append(
      $('<div>', {
        class: 'counter-girl',
        html: $('<img>', {
          src: getCounterUrl(n),
          alt: n,
        }),
      }),
    )
  })
  $aIndex.append($counterGirls)

  $('.current').removeClass('current')
  $('menu#subnav-menu').remove()
  $('#c-posts').remove()
  $('#page').append($cStatic)

  GM_addStyle(`body { visibility: unset; }`)
})
