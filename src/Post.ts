export class Post {
  constructor(private post: PostHTMLElement) {}

  private get flags(): string[] {
    return this.post.dataset.flags.split(" ");
  }

  get tags(): string[] {
    return this.post.dataset.tags.split(" ");
  }

  get score(): number {
    return parseInt(this.post.dataset.score)!;
  }

  get rating(): string {
    return this.post.dataset.rating;
  }

  get uploaderId(): number {
    return parseInt(this.post.dataset.uploaderId)!;
  }

  get isActive(): boolean {
    return !(this.isPending || this.isDeleted || this.isFlagged);
  }

  get isPending(): boolean {
    return this.flags.includes("pending");
  }

  get isFlagged(): boolean {
    return this.flags.includes("flagged");
  }

  get isDeleted(): boolean {
    return this.flags.includes("deleted");
  }
  get isBanned(): boolean {
    return this.flags.includes("banned");
  }

  get hasParent(): boolean {
    return this.post.classList.contains("post-status-has-parent");
  }

  get hasChildren(): boolean {
    return this.post.classList.contains("post-status-has-children");
  }

  get vote(): 1 | 0 | -1 | null {
    const voteContainer = document.querySelector(
      "#post-info-score, .post-preview-score",
    );

    if (voteContainer === null) return null;

    if (voteContainer.querySelector(".post-upvote-link.post-unvote-link"))
      return 1;

    if (voteContainer.querySelector(".post-downvote-link.post-unvote-link"))
      return -1;

    return 0;
  }
}
