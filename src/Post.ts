export class Post {
  private constructor(
    readonly tags: string[],
    readonly score: number,
    readonly rating: string,
    readonly uploaderId: number,
    readonly isPending: boolean,
    readonly isFlagged: boolean,
    readonly isDeleted: boolean,
    readonly isBanned: boolean,
    readonly hasParent: boolean,
    readonly hasChildren: boolean,
  ) {}

  get isActive(): boolean {
    return !(this.isPending || this.isDeleted || this.isFlagged);
  }

  static fromElement(post: PostHTMLElement): Post {
    const tags = post.dataset.tags.split(" ");
    const score = parseInt(post.dataset.score)!;
    const rating = post.dataset.rating;
    const uploaderId = parseInt(post.dataset.uploaderId)!;

    const flags = post.dataset.flags.split(" ");
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
