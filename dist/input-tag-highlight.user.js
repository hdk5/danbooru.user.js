// ==UserScript==
// @name         Danbooru - Input Tag Highlight
// @author       hdk5
// @version      20241028074117
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/upload-to-danbooru.user.js
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/upload-to-danbooru.user.js
// @match        *://*.donmai.us/*
// @grant        none
// @grant        GM_addStyle
// ==/UserScript==

const SCRIPT_CSS = `
  .tag-highlight-highlights {
    color: transparent;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .tag-highlight-backdrop {
    position: absolute;
    overflow: hidden;
    pointer-events: none;
    margin: 3.55px;

    font-size: var(--text-sm);
  }

  .tag-highlight-empty {
    text-decoration: dotted underline;
  }
  .tag-highlight-deprecated {
    text-decoration: line-through;
  }
  .tag-highlight-meta-name {
    color: var(--grey-4);
  }
  .tag-highlight-meta-value {
    color: var(--grey-2);
  }

  .tag-highlight-type-0 {
    color: var(--general-tag-color);
  }
  .tag-highlight-type-4 {
    color: var(--character-tag-color);
  }
  .tag-highlight-type-3 {
    color: var(--copyright-tag-color);
  }
  .tag-highlight-type-1 {
    color: var(--artist-tag-color);
  }
  .tag-highlight-type-5 {
    color: var(--meta-tag-color);
  }

  #post_tag_string {
    overscroll-behavior: none;
    -webkit-text-fill-color: transparent;
    font-size: var(--text-sm);
  }
`

const RECLASS_METATAGS = {
  ch: 4,
  co: 3,
  gen: 0,
  char: 4,
  copy: 3,
  art: 1,
  meta: 5,
  general: 0,
  character: 4,
  copyright: 3,
  artist: 1,
}
const METATAGS = [
  ...Object.keys(RECLASS_METATAGS),
  'parent',
  '-parent',
  'rating',
  'source',
  'newpool',
  'pool',
  '-pool',
  'favgroup',
  '-favgroup',
  'fav',
  '-fav',
  'child',
  '-child',
  'upvote',
  'downvote',
  'disapproved',
  'status',
  '-status',
]
const TAG_CACHE = {}

// cba to set up the bundler to use my proper parser tbh
function tokenize(input) {
  const tokens = []

  let i = 0
  while (i < input.length) {
    const char = input[i]

    if (/\s/.test(char)) {
      tokens.push({ type: 'whitespace', value: char })
      i++
      continue
    }

    const metaName = METATAGS.find(name => input.startsWith(`${name}:`, i))
    if (metaName !== undefined) {
      i += metaName.length + 1

      let value = ''

      if (input[i] === '"' || input[i] === '\'') {
        value += input[i++]

        while (i < input.length) {
          value += input[i++]
          if (input[i - 1] === value[0] && input[i - 2] !== '\\')
            break
        }
      }
      else {
        while (i < input.length && !/\s/.test(input[i]))
          value += input[i++]
      }

      tokens.push({ type: 'metatag', name: metaName, value })
      continue
    }

    let tag = ''
    while (i < input.length && !/\s/.test(input[i]))
      tag += input[i++]

    if (tag)
      tokens.push({ type: 'tag', value: tag })
  }

  return tokens
}

const $input_textarea = $('#post_tag_string').detach()

if ($input_textarea.length) {
  GM_addStyle(SCRIPT_CSS)

  const $input_container = $('<div></div>', {
    class: 'tag-highlight-container',
  })
  const $input_backdrop = $('<div></div>', {
    class: 'tag-highlight-backdrop',
  })
  const $input_highlights = $('<div></div>', {
    class: 'tag-highlight-highlights',
  })
  $input_container.append($input_backdrop)
  $input_backdrop.append($input_highlights)
  $input_container.append($input_textarea)

  $input_textarea.on({
    input: handleInput,
    scroll: handleScroll,
  })

  async function handleInput() {
    // TODO: fix flickering
    const text = $input_textarea.val()
    const tokens = tokenize(text)

    $input_highlights.html(applyHighlights(tokens))

    await fillTagCache(tokens)

    $input_highlights.html(applyHighlights(tokens))
    handleScroll()
    fixSize()
  }

  async function fillTagCache(tokens) {
    // TODO: fix post_count for aliases
    const missingTags = tokens
      .filter(token => token.type === 'tag' && !(token.value in TAG_CACHE))
      .map(token => token.value)

    if (missingTags.length === 0)
      return

    const chunkSize = 1000
    for (let i = 0; i < missingTags.length; i += chunkSize) {
      const chunk = missingTags.slice(i, i + chunkSize)
      const resp = await $.post('/tags.json', {
        _method: 'get',
        limit: chunkSize,
        only: 'name,post_count,category,is_deprecated',
        search: {
          name_array: chunk,
        },
      })
      const tagData = Object.fromEntries(resp.map(tag => [tag.name, tag]))
      for (const tagName of chunk) {
        const tag = tagData[tagName] ?? {
          name: tagName,
          post_count: 0,
          category: 0,
          is_deprecated: false,
        }
        TAG_CACHE[tagName] = tag
      }
    }
  }

  function applyHighlights(tokens) {
    const nodes = []

    for (const token of tokens) {
      const htmlToken = $('<span></span')
      if (token.type === 'metatag') {
        const htmlName = $('<span></span')
        htmlName.addClass('tag-highlight-meta-name')
        htmlName.text(`${token.name}:`)

        const htmlValue = $('<span></span')
        const cat = RECLASS_METATAGS[token.name]
        if (cat !== undefined)
          htmlToken.addClass(`tag-highlight-type-${cat}`)
        else
          htmlValue.addClass('tag-highlight-meta-value')
        htmlValue.text(token.value)

        htmlToken.html([htmlName, htmlValue])
      }
      else if (token.type === 'tag') {
        htmlToken.text(token.value)
        const tagData = TAG_CACHE[token.value] ?? {
          category: 0,
          post_count: 0,
          is_deprecated: false,
        }
        if (tagData.is_deprecated)
          htmlToken.addClass('tag-highlight-deprecated')
        else if (!tagData.post_count)
          htmlToken.addClass('tag-highlight-empty')

        htmlToken.addClass(`tag-highlight-type-${tagData.category}`)
      }
      else if (token.type === 'whitespace') {
        htmlToken.text(token.value)
      }

      nodes.push(htmlToken)
    }

    return nodes
  }

  function handleScroll() {
    const scrollTop = $input_textarea.scrollTop()
    $input_backdrop.scrollTop(scrollTop)

    const scrollLeft = $input_textarea.scrollLeft()
    $input_backdrop.scrollLeft(scrollLeft)
  }

  function fixSize() {
    $input_backdrop.width($input_textarea.width())
    $input_backdrop.height($input_textarea.height())
  }

  $('.post_tag_string').append($input_container)

  new ResizeObserver(fixSize).observe($input_textarea.get(0))

  handleInput()
}
