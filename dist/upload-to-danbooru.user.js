// ==UserScript==
// @name         Upload To Danbooru
// @author       hdk5
// @version      20240201234119
// @description  another userscript for uploading to danbooru
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/upload-to-danbooru.user.js
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/upload-to-danbooru.user.js
// @match        *://fantia.jp/*
// @match        *://misskey.io/*
// @match        *://www.pixiv.net/*
// @match        *://nijie.info/*
// @match        *://twitter.com/*
// @match        *://x.com/*
// @match        *://ci-en.net/*
// @match        *://ci-en.dlsite.com/*
// @match        *://seiga.nicovideo.jp/*
// @match        *://pawoo.net/*
// @match        *://baraag.net/*
// @match        *://inkbunny.net/*
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @inject-into  content
// @noframes
// @connect      lohas.nicoseiga.jp
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://github.com/rafaelw/mutation-summary/raw/421110f84178aa9e4098b38df83f727e5aea3d97/src/mutation-summary.js
// @require      https://github.com/sizzlemctwizzle/GM_config/raw/06f2015c04db3aaab9717298394ca4f025802873/gm_config.js
// @resource     danbooru_icon https://github.com/danbooru/danbooru/raw/0fd95375fac5cc036ff0141c3987abb0a03991b7/public/images/danbooru-logo.png
// ==/UserScript==

GM_config.init({
  id: 'UtdConfig',
  title: 'Upload-to-Danbooru Settings',
  fields: {
    booru: {
      label: 'Danbooru domain',
      type: 'text',
      default: 'https://danbooru.donmai.us',
    },
  },
})

GM_registerMenuCommand('Settings', () => {
  GM_config.open()
})

const PROGRAM_CSS = `
.ex-utb-upload-button {
  display: inline-flex !important;
  align-self: center;
  align-items: center;
  vertical-align: middle;
  margin: 5px;
  padding: 5px !important;
  cursor: pointer;
  background: rgba(0,0,0,0.5);
  text-decoration: none !important;
  color: white !important;
  font-family: system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
}

.ex-utb-upload-button:hover {
  background: rgba(0,0,0,0.75);
}

.ex-utb-upload-button-absolute {
  position: absolute;
  z-index: 1;
}

.ex-utb-upload-button-bottom-left {
  bottom: 0;
  left: 0;
}

.ex-utb-upload-button-icon {
  height: 1.2em;
  vertical-align: middle;
}
`

// Tag function for template literals to remove newlines and leading spaces
function noIndents(strings, ...values) {
  // Remove all spaces before/after a tag and leave one in other cases
  const compactStrings = strings.map(str =>
    str.replace(/(>)?\n *(<)?/g, (s, lt, gt) => lt && gt ? lt + gt : lt || gt ? lt || gt : ' '),
  )

  const res = Array.from({ length: values.length * 2 + 1 })

  for (let i = 0; i < values.length; i++) {
    res[i * 2] = compactStrings[i]
    res[i * 2 + 1] = values[i]
  }
  res[res.length - 1] = compactStrings[compactStrings.length - 1]

  return res.join('')
}

const locationToRef = async _el => window.location

function generateUploadUrl(url, ref) {
  const booru = GM_config.get('booru')
  const uploadUrl = new URL('uploads/new', booru)

  uploadUrl.searchParams.set('url', url)

  if (ref)
    uploadUrl.searchParams.set('ref', ref)

  return uploadUrl.href
}

function parseHtml(text, baseHref) {
  if (baseHref === undefined)
    baseHref = new URL('/', window.location).href

  const document = new DOMParser().parseFromString(text, 'text/html')
  const base = document.createElement('base')
  base.href = baseHref
  document.head.appendChild(base)
  return document
}

function GM_fetch(options) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...options,
      onload(response) {
        resolve(response)
      },
      onerror(error) {
        reject(error)
      },
    })
  })
}

function findAndAttach(options) {
  const fullOptions = {
    selector: null,
    asyncAttach: false,
    asyncClick: false,
    predicate: _el => true,
    classes: [],
    toUrl: async el => $(el).closest('a').prop('href'),
    toRef: async _el => null,
    callback: async (_el, _btn) => null,
    ...options,
  }

  if (typeof fullOptions.predicate === 'string') {
    const predicateSelector = fullOptions.predicate
    fullOptions.predicate = el => $(el).is(predicateSelector)
  }

  const attach = async (el) => {
    if (!fullOptions.predicate(el))
      return
    if (el.hasAttribute('ex-utb'))
      return
    el.setAttribute('ex-utb', '')

    const $el = $(el)
    const $btn = $(noIndents`
      <a class="ex-utb-upload-button">
        <img
          class="ex-utb-upload-button-icon"
          title="Upload to Danbooru"
          src="${GM_getResourceURL('danbooru_icon')}">
      </a>
    `)

    fullOptions.classes.forEach(clazz => $btn.addClass(clazz))

    const fetchUploadUrl = async () => {
      const url = await fullOptions.toUrl(el)
      const ref = await fullOptions.toRef(el)
      return generateUploadUrl(url, ref)
    }

    if (fullOptions.asyncClick) {
      let ready = true
      const onclick = async (ev) => {
        if (!ready)
          return
        if (![0, 1].includes(ev.button))
          return

        ready = false
        $btn.css('cursor', 'wait')

        try {
          GM_openInTab(await fetchUploadUrl(), {
            active: ev.button === 0,
            setParent: true,
          })
        }
        catch (err) {
          console.error(err)
        }

        $btn.css('cursor', '')
        ready = true
      }

      $btn.on('click', e => e.preventDefault())
      $btn.on('auxclick', e => e.preventDefault())
      $btn.on('click', onclick)
      $btn.on('auxclick', onclick)

      // Prevent middle-click autoscroll
      $btn.on('mousedown', e => e.preventDefault())
    }
    else {
      $btn.attr('href', await fetchUploadUrl())
      $btn.attr('target', '_blank')
    }

    await fullOptions.callback($el, $btn)
  }

  $(fullOptions.selector).each((i, el) => attach(el))

  if (!fullOptions.asyncAttach)
    return

  // eslint-disable-next-line no-new
  new MutationSummary({
    rootNode: document.body,
    queries: [{ element: fullOptions.selector }],
    callback: ([summary]) => summary.added.forEach(attach),
  })
}

function initializeFantia() {
  // 1. post_content_photo (e.g. https://fantia.jp/posts/2302310)
  // 2. album_image (e.g. https://fantia.jp/posts/2293136)
  // 3. download  (e.g. https://fantia.jp/posts/61560)

  const postUrlMatch = /^\/posts\/\d+/.exec(new URL(window.location).pathname)
  if (postUrlMatch) {
    const ref = new URL(postUrlMatch[0], window.location).href
    const toRef = async () => ref

    // 1 - original image
    findAndAttach({
      selector: 'img',
      predicate: el =>
        el.src
        && /^\/uploads\/post_content_photo\/file\/\d+\/(?!(?:main|thumb)_)/.test(
          new URL(el.src).pathname,
        ),
      classes: ['ex-utb-upload-button-absolute'],
      toUrl: async el => el.src,
      toRef,
      callback: async ($el, $btn) => $btn.insertBefore($el),
    })

    // 1 - thumbnail
    findAndAttach({
      selector: 'img',
      predicate: el =>
        el.src
        && /^\/uploads\/post_content_photo\/file\/\d+\/(?:(?:main|thumb)_)/.test(
          new URL(el.src).pathname,
        ),
      classes: ['ex-utb-upload-button-absolute'],
      asyncAttach: true,
      asyncClick: true,
      toUrl: async (el) => {
        const fileId = /\/(\d+)\//.exec(new URL(el.src).pathname)[1]
        const imagePageUrl = `${ref}/post_content_photo/${fileId}`
        const imagePageResponse = await fetch(imagePageUrl)
        const imagePageHtml = await imagePageResponse.text()
        const imagePageDom = parseHtml(imagePageHtml)
        return $(imagePageDom).find('img').prop('src')
      },
      toRef,
      callback: async ($el, $btn) => $btn.insertBefore($el.closest('.image-container')),
    })

    // 2
    findAndAttach({
      selector: 'a',
      predicate: el => el.href && /^\/posts\/\d+\/album_image$/.test(new URL(el.href).pathname),
      classes: ['ex-utb-upload-button-absolute'],
      asyncAttach: true,
      asyncClick: true,
      toUrl: async el => (await fetch(el.href)).url,
      toRef,
      callback: async ($el, $btn) => $el.prepend($btn),
    })

    // 3
    findAndAttach({
      selector: 'a',
      predicate: el => el.href && /^\/posts\/\d+\/download\/\d+$/.test(new URL(el.href).pathname),
      classes: ['ex-utb-upload-button-absolute'],
      asyncAttach: true,
      asyncClick: true,
      toUrl: async el => (await fetch(el.href)).url,
      toRef,
      callback: async ($el, $btn) => $btn.insertBefore($el),
    })
  }
}

function initializeMisskey() {
  // Add the button to reactions row
  GM_addStyle(`
    .ex-utb-upload-button-icon {
      height: 1.5em;
    }
  `)

  // Timeline
  // User notes
  findAndAttach({
    selector: 'article.x5yeR',
    predicate: '.xvu6Q article.x5yeR',
    asyncAttach: true,
    toUrl: async el => $(el).find('.xAtlm a').prop('href'),
    callback: async ($el, $btn) => $el.find('.xlT1y').prepend($btn),
  })

  // Note
  findAndAttach({
    selector: 'article.xexC6',
    predicate: '.xvu6Q article.xexC6',
    asyncAttach: true,
    toUrl: async el => $(el).find('.xi1ty a').prop('href'),
    callback: async ($el, $btn) => $el.find('.xlT1y').prepend($btn),
  })
}

function initializePixiv() {
  // Add the button on thumbnails
  findAndAttach({
    selector: 'a',
    predicate: 'div[type=illust] a[data-gtm-value]',
    classes: [
      'ex-utb-upload-button-absolute',
      'ex-utb-upload-button-bottom-left',
    ],
    asyncAttach: true,
    callback: async ($el, $btn) => $btn.insertBefore($el),
  })
}

function initializeNijie() {
  GM_addStyle(`
    .ex-utb-upload-button-icon {
      border: unset !important;
      padding: unset !important;
    }
  `)

  // Post thumbnails
  findAndAttach({
    selector: '.nijie',
    classes: ['ex-utb-upload-button-absolute'],
    asyncAttach: true,
    toUrl: async el => $(el).find('a').prop('href'),
    callback: async ($el, $btn) => $el.find('.mozamoza').parent().prepend($btn),
  })
}

function initializeTwitter() {
  GM_addStyle(`
    .ex-utb-upload-button {
      padding: unset !important;
      margin: unset;
      margin-inline-start: 12px;
      background: none;
      position: relative;
      order: 9999;
    }

    .ex-utb-upload-button:hover {
      background: unset;
    }

    .ex-utb-upload-button-icon {
      height: 1.25em;
    }

    /* probably tweet page */
    article[tabindex="-1"] .ex-utb-upload-button-icon {
      height: 1.5em;
    }

    .ex-utb-upload-button-twitter-hover {
      border-radius: 9999px;
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      margin: -8px;
    }

    .ex-utb-upload-button-twitter-hover:hover {
      background: rgba(174,137,102,0.15);
    }
  `)

  findAndAttach({
    selector: 'article',
    predicate: 'article[data-testid=tweet]',
    asyncAttach: true,
    toUrl: async el => $(el).find('time').closest('a').prop('href'),
    callback: async ($el, $btn) => {
      $btn.append('<div class="ex-utb-upload-button-twitter-hover">')
      $el.find('div[role=group]').append($btn)
    },
  })
}

function initializeCien() {
  findAndAttach({
    selector: 'img.file-player-image',
    predicate: 'img.file-player-image[data-raw]',
    classes: ['ex-utb-upload-button-absolute'],
    asyncAttach: true,
    toUrl: async el => $(el).attr('data-raw'),
    toRef: locationToRef,
    callback: async ($el, $btn) => $btn.insertBefore($el),
  })
}

function initializeNicoSeiga() {
  findAndAttach({
    selector: 'a#illust_link',
    classes: ['ex-utb-upload-button-absolute'],
    asyncClick: true,
    toUrl: async (el) => {
      const response = await GM_fetch({
        url: $(el).prop('href'),
      })
      return response.finalUrl.replace(/\/o\//, '/priv/')
    },
    toRef: locationToRef,
    callback: async ($el, $btn) => $btn.insertBefore($el),
  })
}

function initializeMastodon() {
  GM_addStyle(`
    .ex-utb-upload-button {
      padding: 2px !important;
      margin: unset;
      background: none;
      border-radius: 4px;
    }

    .ex-utb-upload-button:hover {
      background: rgba(174,137,102,0.15);
    }

    .ex-utb-upload-button-icon {
      height: 18px;
    }
  `)

  findAndAttach({
    selector: 'div',
    predicate: 'div.status__action-bar__dropdown, div.detailed-status__action-bar-dropdown',
    asyncAttach: true,
    toUrl: async el => $(el)
      .closest('div.status__wrapper, div.detailed-status__wrapper')
      .find('a.status__relative-time, a.detailed-status__datetime')
      .prop('href'),
    callback: async ($el, $btn) => $btn.insertBefore($el),
  })
}

function initializeInkbunny() {
  GM_addStyle(`
    .ex-utb-upload-button {
      padding: unset !important;
      margin: unset;
      vertical-align: unset;
    }
  `)

  findAndAttach({
    selector: 'div.widget_thumbnailFromSubmission_icons',
    asyncAttach: true,
    toUrl: async el => $(el)
      .parent()
      .find('div.widget_imageFromSubmission a')
      .prop('href'),
    callback: async ($el, $btn) => $el.append($btn),
  })
}

function initialize() {
  GM_addStyle(PROGRAM_CSS)

  switch (window.location.host) {
    case 'fantia.jp':
      initializeFantia()
      break
    case 'misskey.io':
      initializeMisskey()
      break
    case 'www.pixiv.net':
      initializePixiv()
      break
    case 'nijie.info':
      initializeNijie()
      break
    case 'twitter.com':
    case 'x.com':
      initializeTwitter()
      break
    case 'ci-en.net':
    case 'ci-en.dlsite.com':
      initializeCien()
      break
    case 'seiga.nicovideo.jp':
      initializeNicoSeiga()
      break
    case 'baraag.net':
    case 'pawoo.net':
      initializeMastodon()
      break
    case 'inkbunny.net':
      initializeInkbunny()
      break
  }
}

initialize()
