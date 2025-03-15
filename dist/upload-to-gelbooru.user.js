// ==UserScript==
// @name         Danbooru - Upload to Gelbooru
// @author       hdk5
// @version      20250315210419
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/upload-to-gelbooru.user.js
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/upload-to-gelbooru.user.js
// @match        *://*.donmai.us/*
// @grant        GM.xmlHttpRequest
// @connect      gelbooru.com
// ==/UserScript==

/* globals
  GM
  $
  Danbooru
*/

const METATAGS = [
  'user',
  'approver',
  'commenter',
  'comm',
  'noter',
  'noteupdater',
  'artcomm',
  'commentaryupdater',
  'flagger',
  'appealer',
  'upvote',
  'downvote',
  'fav',
  'ordfav',
  'favgroup',
  'ordfavgroup',
  'reacted',
  'pool',
  'ordpool',
  'note',
  'comment',
  'commentary',
  'id',
  'rating',
  'source',
  'status',
  'filetype',
  'disapproved',
  'parent',
  'child',
  'search',
  'embedded',
  'md5',
  'pixelhash',
  'width',
  'height',
  'mpixels',
  'ratio',
  'score',
  'upvotes',
  'downvotes',
  'favcount',
  'filesize',
  'date',
  'age',
  'order',
  'limit',
  'tagcount',
  'pixiv_id',
  'pixiv',
  'unaliased',
  'exif',
  'duration',
  'random',
  'is',
  'has',
  'ai',
]

const TAG_MAP = {
  covered_nipples: 'covered_erect_nipples',
}

const GIRLS = makeGenderTags('girl')
const BOYS = makeGenderTags('boy')
const OTHERS = makeGenderTags('other')

function makeGenderTags(gender) {
  const result = [`multiple_${gender}s`]

  function addTag(prefix) {
    result.push(`${prefix}${gender}`)
    result.push(`${prefix}${gender}s`)
  }

  for (let i = 1; i <= 6; ++i) {
    addTag(i)
    if (i >= 6) {
      addTag(`${i}+`)
    }
  }

  return result
}

function extractTags() {
  const tagString = $('#post_tag_string').val().toLowerCase()
  const tags = Danbooru.Utility.splitWords(tagString)
  return tags
}

(() => {
  if (typeof $ === typeof undefined)
    return

  let $image = $('img.media-asset-image')
  if ($image.length === 0)
    $image = $('img#image')
  if ($image.length === 0)
    return

  let imgUrl = $image.attr('src')
  if (imgUrl.endsWith('.webp')) {
    imgUrl = imgUrl.replace('/original/', '/full/').replace('.webp', '.jpg')
  }

  const imgName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1)
  const imgExt = imgName.substring(imgName.lastIndexOf('.') + 1)

  const imgMime = ({
    jpg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    // "avif": "image/avif",
    // "mp4": "video/mp4",
    // "webp": "image/webp",
    // "webm": "video/webm",
    // "swf": "application/x-shockwave-flash",
    // "ugoira": "application/zip",
  })[imgExt]
  if (imgMime === undefined)
    return

  $('#post_tag_string').closest('form').find('input[type=submit]').after(
    $('<button></button>', {
      text: 'Post to Gelbooru',
      class: 'btn button-sm',
      click: async (e) => {
        e.preventDefault()
        $(e.target).attr('disabled', true)
        await upload()
        $(e.target).attr('disabled', false)
      },
    }),
  )

  async function upload() {
    let tagString = extractTags()
    const allowedRatings = $('div.input.post_rating input[type="radio"]').map((i, el) => $(el).val()).get()
    let rating = $('div.input.post_rating input:checked').val()

    for (const tag of tagString) {
      const match = tag.match(/^([^:]*):(.*)$/)
      if (match === null)
        continue
      let [_, metaTag, metaValue] = match
      if (metaTag === 'rating') {
        metaValue = metaValue[0]
        if (allowedRatings.includes(metaValue)) {
          rating = metaValue
        }
      }
    }

    if (rating === undefined) {
      $('div.input.post_rating').addClass('field_with_errors')
      return
    }

    tagString = tagString.filter((tag) => {
      const match = tag.match(/^([^:]*):(.*)$/)
      if (match) {
        const [_, metaTag, metaValue] = match
        if (METATAGS.includes(metaTag))
          return false
      }

      return !(
        ['commentary_request', 'commentary', 'translated', 'annotated'].includes(tag)
        || tag.endsWith('_commentary')
      )
    })

    const hasGirls = tagString.some(v => GIRLS.includes(v))
    const hasBoys = tagString.some(v => BOYS.includes(v))
    const hasOthers = tagString.some(v => OTHERS.includes(v))

    if (hasGirls && !hasBoys && !hasOthers)
      tagString.push('female_focus')
    if (!hasGirls && hasBoys && !hasOthers)
      tagString.push('male_focus')

    tagString = tagString.map(tag => tag in TAG_MAP ? TAG_MAP[tag] : tag)

    const source = $('#post_source').val()

    const imgData = await fetch(imgUrl).then(response => response.arrayBuffer())

    const url = 'https://gelbooru.com/index.php?page=post&s=add'

    const response = await GM.xmlHttpRequest({
      method: 'POST',
      url,
      data: (() => {
        const formData = new FormData()
        formData.append(
          'upload',
          new Blob([imgData], { type: imgMime }),
          imgName,
        )
        formData.append('source', source)
        formData.append('title', '')
        formData.append('tags', tagString.join(' '))
        formData.append('rating', rating)
        formData.append('submit', 'Upload')
        return formData
      })(),
    })
    console.log(response)

    const responseHtml = (() => {
      const document = (new DOMParser()).parseFromString(response.responseText, 'text/html')
      const base = document.createElement('base')
      base.href = 'https://gelbooru.com/'
      document.head.appendChild(base)
      return document
    })()

    let newPostUrl

    const error = $(responseHtml).find('.alert-warning')

    if (error.length === 0) {
      newPostUrl = response.finalUrl
    }
    else if (error.text().startsWith('That image already exists. You can find it here')) {
      newPostUrl = error.find('a').prop('href')
    }

    if (newPostUrl === undefined) {
      Danbooru.error('Upload to Gelbooru failed. See console for details.')
      return
    }

    window.open(newPostUrl, '_blank').focus()
    await GM.xmlHttpRequest({
      method: 'POST',
      url: '/uploads.json',
      data: (() => {
        const formData = new FormData()
        formData.append('upload[source]', newPostUrl)
        return formData
      })(),
    })
  }
})()
