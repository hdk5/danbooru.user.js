export class Post {
  readonly tags: string[];
  readonly score: number;
  readonly rating: string;
  readonly uploaderId: number;
  readonly isPending: boolean;
  readonly isFlagged: boolean;
  readonly isDeleted: boolean;
  readonly isBanned: boolean;
  readonly hasParent: boolean;
  readonly hasChildren: boolean;

  private constructor(
    tags: string[],
    score: number,
    rating: string,
    uploaderId: number,
    isPending: boolean,
    isFlagged: boolean,
    isDeleted: boolean,
    isBanned: boolean,
    hasParent: boolean,
    hasChildren: boolean,
  ) {
    this.tags = tags;
    this.score = score;
    this.rating = rating;
    this.uploaderId = uploaderId;
    this.isPending = isPending;
    this.isFlagged = isFlagged;
    this.isDeleted = isDeleted;
    this.isBanned = isBanned;
    this.hasParent = hasParent;
    this.hasChildren = hasChildren;
  }

  static fromElement(post: HTMLElement): Post {
    const tags = post.dataset["tags"]!.split(" ");
    const score = parseInt(post.dataset["score"]!)!;
    const rating = post.dataset["rating"]!;
    const uploaderId = parseInt(post.dataset["uploaderId"]!)!;

    const flags = post.dataset["flags"]!.split(" ");
    const isPending = flags.includes("pending");
    const isFlagged = flags.includes("flagged");
    const isDeleted = flags.includes("deleted");
    const isBanned = flags.includes("banned");

    const hasParent = post.classList.contains("post-status-has-parent");
    const hasChildren = post.classList.contains("post-status-has-children");

    return new Post(
      tags,
      score,
      rating,
      uploaderId,
      isPending,
      isFlagged,
      isDeleted,
      isBanned,
      hasParent,
      hasChildren,
    );
  }
}
