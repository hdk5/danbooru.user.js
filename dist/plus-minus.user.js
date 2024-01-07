// ==UserScript==
// @name         Danbooru - PlusMinus
// @author       hdk5
// @version      20240106233054
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/plus-minus.user.js
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/plus-minus.user.js
// @match        *://*.donmai.us/*
// @grant        none
// ==/UserScript==

(() => {
  let query
  const params = (new URL(document.location)).searchParams
  if (params.has('q'))
    query = params.get('q')
  else if (params.has('tags'))
    query = params.get('tags')
  else
    return

  $('.tag-list .search-tag').each((i, el) => {
    const $el = $(el)

    const tagName = $el.closest('li').attr('data-tag-name')
    if (tagName === undefined)
      return

    const plusQuery = `${query} ${tagName}`
    const minusQuery = `${query} -${tagName}`

    const plusUrl = `/posts?tags=${encodeURIComponent(plusQuery)}`
    const minusUrl = `/posts?tags=${encodeURIComponent(minusQuery)}`

    const $plusBtn = $('<a>', {
      text: '+',
      href: plusUrl,
      class: 'search-inc-tag',
    })
    const $minusBtn = $('<a>', {
      text: '-',
      href: minusUrl,
      class: 'search-exl-tag',
    })

    const $wikiLink = $el.closest('li').find('.wiki-link')

    $wikiLink.after($minusBtn)
    $wikiLink.after(' ')
    $wikiLink.after($plusBtn)
    $wikiLink.after(' ')
  })
})()
