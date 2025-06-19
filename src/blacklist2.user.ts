import type { AST } from './AST'
import { Metatag } from './Metatag'
import { Post as PostWrapper } from './Post'
import { QueryParser } from './QueryParser'

class Blacklist extends Danbooru.Blacklist {
  override initialize(rules: string[]) {
    this.rules = rules.map(rule => new Rule(this, rule))
    this.posts = $<PostHTMLElement>('.post-preview, .image-container, #c-comments .post, .mod-queue-preview.post-preview')
      .toArray()
      .map(post => new Post(post, this))
    this.apply()
    this.cleanupStorage()
  }
}

class Rule extends Danbooru.Blacklist.Rule {
  ast: AST

  constructor(blacklist: Blacklist, string: string) {
    super(blacklist, string)
    this.ast = QueryParser.parse(string, Metatag.NAMES)
  }

  override match(post: Post) {
    return this.ast.match(post.x_post)
  }
}

class Post extends Danbooru.Blacklist.Post {
  x_post: PostWrapper

  constructor(post: PostHTMLElement, blacklist: Blacklist) {
    super(post, blacklist)
    this.x_post = new PostWrapper(post)
  }
}

Danbooru.Blacklist = Blacklist
