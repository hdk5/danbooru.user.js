import { Metatag } from "./Blacklist";
import { Post } from "./Post";
import { QueryParser } from "./QueryParser";

$(() => {
  if ($("#blacklist-box").length === 0) {
    return;
  }

  Danbooru.Blacklist.post_match = (post, entry): boolean => {
    if (entry.disabled) {
      return false;
    }

    return entry.ast.match(Post.fromElement(post));
  };

  const super_parse_entry = Danbooru.Blacklist.parse_entry;
  Danbooru.Blacklist.parse_entry = (str): BlacklistEntry => {
    const entry = super_parse_entry(str);

    entry.ast = QueryParser.parse(str, Object.values(Metatag));

    return entry;
  };

  Danbooru.Blacklist.entries = [];
  $("#blacklist-list").empty();
  $("#blacklist-box").hide();

  Danbooru.Blacklist.initialize_all();
});
