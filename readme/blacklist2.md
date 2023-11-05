# blacklist2

Advanced blacklist rule grammar for Danbooru.

## Supported syntax

- simple tags

  - `blonde_hair`

- `and` expressions

  - `blonde_hair blue_eyes`
  - `blonde_hair and blue_eyes`

- `or` expressions

  - `blonde_hair or blue_eyes`
  - `~blonde_hair ~blue_eyes`

- `not` expressions

  - `-blonde_hair`

- wildcard expressions

  - `*_(cosplay)`

- parentheses

  - `-(blonde_hair blue_eyes)`
  - `(blonde_hair blue_eyes) or (red_hair green_eyes)`

- `rating` metatag

  - `rating:g`
  - `rating:s`
  - `rating:q`
  - `rating:e`
  - `,` is also supported (i.e. `rating:q,e`)

- `score` metatag

  - `score:5`
  - `score:>5`
  - `score:>=5`
  - `score:<5`
  - `score:<=5`
  - `score:5..`
  - `score:..5`
  - `score:5..10`
  - `score:5...10`
  - `score:5,6,7`
  - `score:5,7..9`

- `tagcount` metagag

  - ranges are also supported (see `score`)

- `uploaderid` metatag

  - `uploaderid:748553`
  - ranges are also supported (see `score`)

- `status` metatag

  - `is:pending`
  - `is:flagged`
  - `is:deleted`
  - `is:banned`
  - `is:active`

- `has` metatag

  - `has:parent`
  - `has:children`/`has:child`

- `is` metatag
  - `is:parent` (`has:children` alias)
  - `is:child` (`has:parent` alias)
  - `is:pending` (`rating:pending` alias)
  - `is:flagged` (`rating:flagged` alias)
  - `is:deleted` (`rating:deleted` alias)
  - `is:banned` (`rating:banned` alias)
  - `is:active` (`rating:active` alias)
  - `is:general` (`rating:general` alias)
  - `is:sensitive` (`rating:sensitive` alias)
  - `is:questionable` (`rating:questionable` alias)
  - `is:explicit` (`rating:explicit` alias)
  - `is:safe` (`rating:s` alias)
  - `is:nsfw` (`rating:q,e` alias)
  - `is:sfw` (`rating:g,s` alias)

- `vote` metatag (non-standard)
  - `vote:1`
  - `vote:0`
  - `vote:-1`
  - ranges are also supported (see `score`)
