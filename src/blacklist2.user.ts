import { Metatag } from './Metatag'
import { Post } from './Post'
import { QueryParser } from './QueryParser'

function refreshBlacklist(): void {
  const disabled = Danbooru.Blacklist.entries.filter(entry => entry.disabled)
  Danbooru.Blacklist.entries.forEach(entry => entry.disabled = false)

  $('#blacklist-list li:not([id])').remove()

  if (Danbooru.Blacklist.apply() > 0) {
    Danbooru.Blacklist.update_sidebar()
  }
  else {
    $('#blacklist-box').hide()
  }

  const disabledTags = disabled.map(entry => entry.tags)
  $('#blacklist-list li:not([id]) a')
    .filter((i, el) => disabledTags.includes($(el).text()))
    .addClass('blacklisted-inactive')
  disabled.forEach(entry => entry.disabled = true)
  Danbooru.Blacklist.apply()
}

$(() => {
  if ($('#blacklist-box').length === 0)
    return

  Danbooru.Blacklist.post_match = (post, entry): boolean => {
    if (entry.disabled)
      return false

    return entry.ast.match(new Post(post))
  }

  const super_parse_entry = Danbooru.Blacklist.parse_entry
  Danbooru.Blacklist.parse_entry = (str): BlacklistEntry => {
    const entry = super_parse_entry(str)

    entry.ast = QueryParser.parse(str, Metatag.NAMES)

    return entry
  }

  Danbooru.Blacklist.entries = []
  $('#blacklist-list li:not([id])').remove()
  $('#blacklist-box').hide()

  Danbooru.Blacklist.initialize_all()

  new MutationObserver((mutations, _observer) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (
          node instanceof HTMLElement
          && node.classList.contains('post-votes')
        ) {
          refreshBlacklist()
        }
      }
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
  })
})
