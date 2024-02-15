import { Range } from './Range'

// TODO: get rid of AST -> Blacklist2 dependencies
import type { Post } from './Post'

export abstract class Metatag {
  abstract match(post: Post): boolean
  constructor(readonly value: string) {}

  public static get NAMES(): string[] {
    return Object.keys(this.SUBCLASSES)
  }

  private static get SUBCLASSES(): Record<
    string,
    new (value: string) => Metatag
  > {
    return {
      score: MetatagScore,
      tagcount: MetatagTagcount,
      uploaderid: MetatagUploaderid,
      rating: MetatagRating,
      status: MetatagStatus,
      has: MetatagHas,
      is: MetatagIs,
      vote: MetatagVote,
    }
  }

  static create(name: string, value: string): Metatag | null {
    const Ctor = this.SUBCLASSES[name]

    if (Ctor === undefined)
      return null

    return new Ctor(value)
  }
}

class MetatagScore extends Metatag {
  override match(post: Post): boolean {
    const range = Range.parse(this.value)
    if (range === null)
      return false

    return range.includes(post.score)
  }
}

class MetatagTagcount extends Metatag {
  override match(post: Post): boolean {
    const range = Range.parse(this.value)
    if (range === null)
      return false

    return range.includes(post.tags.length)
  }
}

class MetatagUploaderid extends Metatag {
  override match(post: Post): boolean {
    const range = Range.parse(this.value)
    if (range === null)
      return false

    return range.includes(post.uploaderId)
  }
}

class MetatagRating extends Metatag {
  override match(post: Post): boolean {
    return this.value
      .split(',')
      .map(s => s.slice(0, 1))
      .includes(post.rating)
  }
}

class MetatagStatus extends Metatag {
  override match(post: Post): boolean {
    switch (this.value) {
      case 'pending':
        return post.isPending
      case 'flagged':
        return post.isFlagged
      case 'deleted':
        return post.isDeleted
      case 'banned':
        return post.isBanned
      case 'active':
        return post.isActive
      default:
        return false
    }
  }
}

class MetatagHas extends Metatag {
  override match(post: Post): boolean {
    switch (this.value) {
      case 'parent':
        return post.hasParent
      case 'child':
      case 'children':
        return post.hasChildren
      default:
        return false
    }
  }
}

class MetatagIs extends Metatag {
  override match(post: Post): boolean {
    switch (this.value) {
      case 'parent':
        return new MetatagHas('children').match(post)
      case 'child':
        return new MetatagHas('parent').match(post)
      case 'pending':
      case 'flagged':
      case 'deleted':
      case 'banned':
      case 'active':
        return new MetatagStatus(this.value).match(post)
      case 'general':
      case 'sensitive':
      case 'questionable':
      case 'explicit':
        return new MetatagRating(this.value).match(post)
      case 'safe':
        return new MetatagRating('s').match(post)
      case 'nsfw':
        return new MetatagRating('q,e').match(post)
      case 'sfw':
        return new MetatagRating('g,s').match(post)
      default:
        return false
    }
  }
}

class MetatagVote extends Metatag {
  override match(post: Post): boolean {
    if (post.vote === null)
      return false

    const range = Range.parse(this.value)
    if (range === null)
      return false

    return range.includes(post.vote)
  }
}
