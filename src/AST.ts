import { Post } from "./Post";

export abstract class AST {
  abstract match(post: Post): boolean;
}

export class ASTAll extends AST {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override match(_post: Post): boolean {
    return true;
  }
}

export class ASTNone extends AST {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override match(_post: Post): boolean {
    return false;
  }
}

export class ASTAnd extends AST {
  readonly left: AST;
  readonly right: AST;

  constructor(left: AST, right: AST) {
    super();
    this.left = left;
    this.right = right;
  }

  override match(post: Post): boolean {
    return this.left.match(post) && this.right.match(post);
  }
}

export class ASTOr extends AST {
  readonly left: AST;
  readonly right: AST;

  constructor(left: AST, right: AST) {
    super();
    this.left = left;
    this.right = right;
  }

  override match(post: Post): boolean {
    return this.left.match(post) || this.right.match(post);
  }
}

export class ASTNot extends AST {
  readonly node: AST;

  constructor(node: AST) {
    super();
    this.node = node;
  }

  override match(post: Post): boolean {
    return !this.node.match(post);
  }
}

export class ASTTag extends AST {
  readonly tag: string;

  constructor(tag: string) {
    super();
    this.tag = tag;
  }

  override match(post: Post): boolean {
    return post.tags.includes(this.tag);
  }
}

export class ASTWildcard extends AST {
  readonly wildcard: string;
  private regex: RegExp;

  constructor(wildcard: string) {
    super();
    this.wildcard = wildcard;
    this.regex = RegExp(`^${wildcard.replaceAll("*", ".*")}$`, "i");
  }

  override match(post: Post): boolean {
    return post.tags.some(
      (tag: string): boolean => this.regex.exec(tag) !== null,
    );
  }
}

export class ASTMetatag extends AST {
  readonly name: string;
  readonly value: string;

  constructor(name: string, value: string) {
    super();
    this.name = name;
    this.value = value;
  }

  override match(post: Post): boolean {
    if (this.name === "rating") {
      return post.rating === this.value.slice(0, 1);
    }

    if (this.name === "score") {
      if (this.value.startsWith(">")) {
        const value = parseInt(this.value.slice(1));
        return post.score > value;
      }

      if (this.value.startsWith("<")) {
        const value = parseInt(this.value.slice(1));
        return post.score < value;
      }

      const value = parseInt(this.value);
      return post.score === value;
    }

    if (this.name === "uploaderid") {
      const value = parseInt(this.value);
      return post.uploaderId === value;
    }

    if (this.name === "is") {
      if (this.value === "pending") {
        return post.isPending;
      }

      if (this.value === "flagged") {
        return post.isFlagged;
      }

      if (this.value === "deleted") {
        return post.isDeleted;
      }

      if (this.value === "banned") {
        return post.isBanned;
      }

      return false;
    }

    if (this.name === "has") {
      if (this.value === "parent") {
        return post.hasParent;
      }

      if (this.value === "children") {
        return post.hasChildren;
      }

      return false;
    }

    return false;
  }
}
