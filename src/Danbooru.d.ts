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
    post_match: (post: HTMLElement, entry: BlacklistEntry) => boolean;
    initialize_all: () => void;
  };
};
