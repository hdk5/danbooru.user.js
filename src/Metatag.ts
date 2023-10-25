import { Post } from "./Post";
import { Range } from "./Range";

export abstract class Metatag {
  abstract match(post: Post): boolean;
  constructor(readonly value: string) {}

  public static get NAMES(): string[] {
    return Object.keys(this.SUBCLASSES);
  }

  private static get SUBCLASSES(): Record<
    string,
    new (value: string) => Metatag
  > {
    return {
      rating: MetatagRating,
      score: MetatagScore,
      tagcount: MetatagTagcount,
      uploaderid: MetatagUploaderid,
      is: MetatagIs,
      has: MetatagHas,
    };
  }

  static create(name: string, value: string): Metatag | null {
    const cls = this.SUBCLASSES[name];

    if (cls === undefined) return null;

    return new cls(value);
  }
}

class MetatagRating extends Metatag {
  override match(post: Post): boolean {
    return this.value
      .split(",")
      .map((s) => s.slice(0, 1))
      .includes(post.rating);
  }
}

class MetatagScore extends Metatag {
  override match(post: Post): boolean {
    const range = Range.parse(this.value);
    if (range === null) return false;

    return range.includes(post.score);
  }
}

class MetatagTagcount extends Metatag {
  override match(post: Post): boolean {
    const range = Range.parse(this.value);
    if (range === null) return false;

    return range.includes(post.tags.length);
  }
}

class MetatagUploaderid extends Metatag {
  override match(post: Post): boolean {
    const range = Range.parse(this.value);
    if (range === null) return false;

    return range.includes(post.uploaderId);
  }
}

class MetatagIs extends Metatag {
  override match(post: Post): boolean {
    switch (this.value) {
      case "pending":
        return post.isPending;
      case "flagged":
        return post.isFlagged;
      case "deleted":
        return post.isDeleted;
      case "banned":
        return post.isBanned;
      case "child":
        return post.hasParent;
      case "parent":
        return post.hasChildren;
      default:
        return false;
    }
  }
}

class MetatagHas extends Metatag {
  override match(post: Post): boolean {
    switch (this.value) {
      case "parent":
        return post.hasParent;
      case "children":
        return post.hasChildren;
      default:
        return false;
    }
  }
}
