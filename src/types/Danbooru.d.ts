declare class Blacklist {
  static Rule = class {
    constructor(blacklist: Blacklist, string: string)
    match(post: BlacklistPost): boolean
  }

  static Post = class {
    constructor(post: PostHTMLElement, blacklist: Blacklist)
  }

  rules: BlacklistRule[]
  posts: BlacklistPost[]
  initialize(rules: string[]): void
  apply(): void
  cleanupStorage(): void
}

declare let Danbooru: {
  Blacklist: typeof Blacklist
  RelatedTag: {
    current_tags: () => string[]
    update_selected: () => void
  }
}

interface PostHTMLDataset extends DOMStringMap {
  tags: string
  score: string
  rating: string
  uploaderId: string
  flags: string
}

interface PostHTMLElement extends HTMLElement {
  readonly dataset: PostHTMLDataset
}
