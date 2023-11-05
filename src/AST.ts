import { Metatag } from './Metatag'
import type { Post } from './Post'

export abstract class AST {
  abstract match(post: Post): boolean

  simplify(): AST {
    return this
  }
}

export class ASTAll extends AST {
  override match(_post: Post): boolean {
    return true
  }
}

export class ASTNone extends AST {
  override match(_post: Post): boolean {
    return false
  }
}

export class ASTAnd extends AST {
  constructor(
    readonly left: AST,
    readonly right: AST,
  ) {
    super()
  }

  override match(post: Post): boolean {
    return this.left.match(post) && this.right.match(post)
  }

  override simplify(): AST {
    const left = this.left.simplify()
    const right = this.right.simplify()

    if (left instanceof ASTNone || right instanceof ASTNone)
      return new ASTNone()

    if (left instanceof ASTAll)
      return right

    if (right instanceof ASTAll)
      return left

    if (left instanceof ASTAnd)
      return new ASTAnd(left.left, new ASTAnd(left.right, right).simplify())

    return new ASTAnd(left, right)
  }
}

export class ASTOr extends AST {
  constructor(
    readonly left: AST,
    readonly right: AST,
  ) {
    super()
  }

  override match(post: Post): boolean {
    return this.left.match(post) || this.right.match(post)
  }

  override simplify(): AST {
    const left = this.left.simplify()
    const right = this.right.simplify()

    if (left instanceof ASTAll || right instanceof ASTAll)
      return new ASTAll()

    if (left instanceof ASTNone)
      return right

    if (right instanceof ASTNone)
      return left

    if (left instanceof ASTOr)
      return new ASTOr(left.left, new ASTOr(left.right, right).simplify())

    return new ASTOr(left, right)
  }
}

export class ASTNot extends AST {
  constructor(readonly node: AST) {
    super()
  }

  override match(post: Post): boolean {
    return !this.node.match(post)
  }

  override simplify(): AST {
    const node = this.node.simplify()

    if (node instanceof ASTAll)
      return new ASTNone()

    if (node instanceof ASTNone)
      return new ASTAll()

    if (node instanceof ASTNot)
      return node.node

    return new ASTNot(node)
  }
}

export class ASTTag extends AST {
  constructor(readonly tag: string) {
    super()
    this.tag = this.tag.toLowerCase()
  }

  override match(post: Post): boolean {
    return post.tags
      .map(tag => tag.toLowerCase())
      .includes(this.tag.toLowerCase())
  }
}

export class ASTWildcard extends AST {
  private regex: RegExp

  constructor(readonly wildcard: string) {
    super()

    const pattern = this.wildcard
      .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      .replace(/-/g, '\\x2d')
      .replace(/\\\*/g, '[\\s\\S]*')
    this.regex = RegExp(`^${pattern}$`, 'i')
  }

  override match(post: Post): boolean {
    return post.tags.some(
      (tag: string): boolean => this.regex.exec(tag) !== null,
    )
  }
}

export class ASTMetatag extends AST {
  constructor(
    readonly name: string,
    readonly value: string,
  ) {
    super()
    this.name = this.name.toLowerCase()
  }

  override match(post: Post): boolean {
    const metatag = Metatag.create(this.name, this.value)

    if (metatag === null)
      return false

    return metatag.match(post)
  }
}
