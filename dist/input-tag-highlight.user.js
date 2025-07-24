// ==UserScript==
// @name         Danbooru - Input Tag Highlight
// @author       hdk5
// @version      20250724163121
// @namespace    https://github.com/hdk5/danbooru.user.js
// @homepageURL  https://github.com/hdk5/danbooru.user.js
// @supportURL   https://github.com/hdk5/danbooru.user.js/issues
// @updateURL    https://github.com/hdk5/danbooru.user.js/raw/master/dist/input-tag-highlight.user.js
// @downloadURL  https://github.com/hdk5/danbooru.user.js/raw/master/dist/input-tag-highlight.user.js
// @match        *://*.donmai.us/*
// @grant        GM_addStyle
// ==/UserScript==

/* globals
  GM_addStyle
  $
*/

// https://codersblock.com/blog/highlight-text-inside-a-textarea/
const SCRIPT_CSS = /* CSS */`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  .tag-highlight-container, .tag-highlight-backdrop, #post_tag_string {
    width: 100%;
    max-width: 60rem;
    height: 10rem;
  }

  .tag-highlight-highlights, #post_tag_string {
    padding: 0.25em;
    font-size: var(--text-sm);
    line-height: calc(var(--text-sm) * 35 / 24);
  }

  .tag-highlight-container {
    display: block;
    margin: 0;
    transform: translateZ(0);
    -webkit-text-size-adjust: none;
  }

  .tag-highlight-backdrop {
    position: absolute;
    z-index: 1;
    border: 1px solid transparent;
    overflow: auto;
    pointer-events: none;
    opacity: unset;
  }

  .tag-highlight-highlights {
    color: transparent;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .tag-highlight-highlights:after {
    content: "\\FEFF";
  }

  #post_tag_string {
    display: block;
    resize: none;
    position: absolute;
    color: transparent;
    caret-color: var(--text-color);
    margin: 0;
    border-radius: 0;
    overflow: auto;
    overscroll-behavior: none;
  }

  .tag-highlight-empty {
    text-decoration: dotted underline;
  }
  .tag-highlight-deprecated {
    text-decoration: line-through;
  }
  .tag-highlight-meta-name {
    color: var(--tag-highlight-meta-name-color);
  }
  .tag-highlight-meta-value {
    color: var(--tag-highlight-meta-value-color);
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

  html, body[data-current-user-theme="light"] {
    --tag-highlight-meta-name-color: var(--grey-4);
    --tag-highlight-meta-value-color: var(--grey-6);
  }

  body[data-current-user-theme="dark"] {
    --tag-highlight-meta-name-color: var(--grey-4);
    --tag-highlight-meta-value-color: var(--grey-2);
  }

  @media (prefers-color-scheme: dark) {
    body {
      --tag-highlight-meta-name-color: var(--grey-4);
      --tag-highlight-meta-value-color: var(--grey-2);
    }
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

function normalizeTag(tag) {
  return tag.toLowerCase()
}

async function fillTagCache(tokens) {
  // TODO: fix post_count for aliases
  // https://github.com/danbooru/danbooru/issues/5850
  const missingTags = tokens
    .filter(token => token.type === 'tag' && !(token.value in TAG_CACHE))
    .map(token => normalizeTag(token.value))

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

  return missingTags.length
}

function applyHighlights(tokens) {
  const nodes = []

  for (const token of tokens) {
    const htmlToken = $('<span></span>')
    if (token.type === 'metatag') {
      const htmlName = $('<span></span>')
      htmlName.addClass('tag-highlight-meta-name')
      htmlName.text(`${token.name}:`)

      const htmlValue = $('<span></span>')
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
      const tagData = TAG_CACHE[normalizeTag(token.value)] ?? {
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

$('#post_tag_string').each((i, el) => {
  GM_addStyle(SCRIPT_CSS)

  const $input_textarea = $(el)
  const $input_container = $('<div></div>', {
    class: 'tag-highlight-container',
  })
  const $input_backdrop = $('<div></div>', {
    class: 'tag-highlight-backdrop',
    inert: '',
  })
  const $input_highlights = $('<div></div>', {
    class: 'tag-highlight-highlights',
  })
  $input_container.append($input_backdrop)
  $input_backdrop.append($input_highlights)

  $input_textarea.on({
    'input': handleInput,
    'focus': handleInput,
    'danbooru:update-tag-counter': handleInput,
    'scroll': handleScroll,
  })

  let handleInputReq
  async function handleInput() {
    const currentReq = {}
    handleInputReq = currentReq

    const text = $input_textarea.val()
    const tokens = tokenize(text)

    $input_highlights.html(applyHighlights(tokens))
    handleScroll()

    const tagsLoaded = await fillTagCache(tokens)

    if (tagsLoaded === 0 || handleInputReq !== currentReq)
      return

    $input_highlights.html(applyHighlights(tokens))
  }

  function handleScroll() {
    const scrollTop = $input_textarea.scrollTop()
    $input_backdrop.scrollTop(scrollTop)

    const scrollLeft = $input_textarea.scrollLeft()
    $input_backdrop.scrollLeft(scrollLeft)
  }

  $input_textarea.after($input_container)
  $input_container.append($input_textarea.detach())

  if ($input_textarea.is(':visible'))
    handleInput()
})
