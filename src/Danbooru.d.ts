type AST = import("./AST").AST;

interface BlacklistEntry {
  tags: string;
  disabled: boolean;
  ast: AST;
}

declare let Danbooru: {
  Blacklist: {
    entries: BlacklistEntry[];
    parse_entry: (str: string) => BlacklistEntry;
    post_match: (post: PostHTMLElement, entry: BlacklistEntry) => boolean;
    initialize_all: () => void;
    apply: () => number;
    update_sidebar: () => void;
  };
};

interface PostHTMLDataset extends DOMStringMap {
  tags: string;
  score: string;
  rating: string;
  uploaderId: string;
  flags: string;
}

interface PostHTMLElement extends HTMLElement {
  readonly dataset: PostHTMLDataset;
}
