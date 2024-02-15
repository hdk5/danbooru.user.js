import { For, Show, createEffect, createRoot, createSignal, on } from 'solid-js'
import { clsx } from 'clsx'
import _ from 'lodash'
import $ from 'jquery'
import type { ValueOf } from 'type-fest'
import type { VoidComponent } from 'solid-js'

import css from './tag-preview.user.scss'
import { ChevronDownIcon, SpinnerIcon } from './icons'
import { createLazyResource } from './util'

GM_addStyle(css)

const QUERY_CHUNK = 1000

const $post_tag_string = $<HTMLTextAreaElement>('#post_tag_string')
const $post_old_tag_string = $<HTMLInputElement>('#post_old_tag_string')

function getAutoTags(tag: string) {
  const tags = [] as string[]

  const cosplayMatch = tag.match(/^(.+)_\(cosplay\)$/i)
  if (cosplayMatch) {
    const [, name] = cosplayMatch as [string, string]
    tags.push(name)
    tags.push('cosplay')
  }

  if (tag.match(/_school_uniform$/i))
    tags.push('school_uniform')

  if (tag.match(/_\(meme\)$/i))
    tags.push('meme')

  return tags
}

interface TagRecord {
  readonly [name: string]: {
    readonly category: number
    readonly deprecated: boolean
    readonly alias: string | null
    readonly implications: readonly string[]
  }
}
async function fetchTags(): Promise<TagRecord> {
  const defaultTag = {
    category: 0,
    deprecated: false,
    alias: null,
    implications: [],
  } as ValueOf<TagRecord>

  const tagNames = currentTags()
  const tags = _(tagNames)
    .keyBy()
    .mapValues(() => defaultTag)
    .value()

  const visited = [] as string[]
  for (;;) {
    const tagsChunk = _(tags)
      .keys()
      .difference(visited)
      .slice(0, QUERY_CHUNK)
      .value()
    visited.push(...tagsChunk)

    if (_.isEmpty(tagsChunk))
      break

    const data = await $.post('/tags.json', {
      _method: 'get',
      limit: QUERY_CHUNK,
      only: 'name,category,is_deprecated,antecedent_alias[consequent_name],antecedent_implications[consequent_name]',
      search: {
        name_array: tagsChunk,
      },
    }) as {
      name: string
      category: number
      is_deprecated: boolean
      antecedent_alias?: {
        consequent_name: string
      }
      antecedent_implications: {
        consequent_name: string
      }[]
    }[]

    data.forEach((data) => {
      const tag = tags[data.name] = {
        category: data.category,
        deprecated: data.is_deprecated,
        alias: data.antecedent_alias?.consequent_name ?? null,
        implications: [
          ...data.antecedent_implications.map(i => i.consequent_name),
          ...getAutoTags(data.name),
        ],
      } as ValueOf<TagRecord>

      if (tag.alias !== null)
        tags[tag.alias] ??= defaultTag

      for (const implication of tag.implications)
        tags[implication] ??= defaultTag
    })
  }

  return tags
}

interface TagTree {
  readonly [name: string]: {
    readonly category: number
    readonly deprecated: boolean
    readonly aliases: readonly string[]
    readonly implications: TagTree
  }
}
function makeTagTree(tags: TagRecord) {
  // TODO: consider reversed direction option
  const recursive = (subTags: TagRecord, level = 0): TagTree => _(subTags)
    .pickBy(tag => tag.alias === null)
    .pickBy(tag => level !== 0 || _.isEmpty(tag.implications))
    .mapValues((tag, name) => ({
      category: tag.category,
      deprecated: tag.deprecated,
      aliases: _(tags)
        .pickBy(tag => tag.alias === name)
        .keys()
        .value(),
      implications: recursive(
        _.pickBy(tags, tag => tag.implications.includes(name)),
        level + 1,
      ),
    }))
    .value()

  return recursive(tags)
}

function parseTagString(tags: string): string[] {
  // TODO: use own StringParser to handle cases like:
  // - quoted metatag values (source:"a \' b")
  // - category changes (char:a)
  // - etc.
  return Danbooru.Utility.splitWords(tags.toLowerCase())
}

function currentTags(): string[] {
  const tagString = $post_tag_string.val() ?? ''
  return parseTagString(tagString)
}

function oldTags(): string[] {
  const tagString = $post_old_tag_string.val() ?? ''
  return parseTagString(tagString)
}

interface MakeTagStringOptions {
  deprecated?: boolean | 'keep'
  aliased?: boolean
  implicated?: boolean
}
function makeTagString(
  tags: TagRecord,
  {
    deprecated = true,
    aliased = true,
    implicated = true,
  }: MakeTagStringOptions = {},
): string {
  const old = oldTags()
  const implicit = _(tags)
    .map(tag => tag.implications)
    .flatten()
    .uniq()
    .value()

  // TODO: think of a better way to order tags in both preview pane and input field:
  // - keep the original order
  // - group related tags together
  // - - consider "virtual" groups like [1girl multiple_girls] or whatever makes kittey hard

  // somewhat unfinished of above
  // const groupTogether = (name: string): string[] => {
  //   const tag = tags[name]!

  //   // hair_past_waist -> very_long_hair
  //   if (tag.alias !== null)
  //     return groupTogether(tag.alias)

  //   // very_long_hair -> long_hair
  //   if (!_.isEmpty(tag.implications)) {
  //     return _(tag.implications)
  //       .sortBy()
  //       .map(tag => groupTogether(tag))
  //       .flatten()
  //       .uniq()
  //       .value()
  //   }

  //   // very_long_hair -> hair_past_waist
  //   const revAliases = _(tags)
  //     .pickBy(other => other.alias === name)
  //     .keys()
  //     .value()

  //   // long_hair -> very_long_hair -> absurdly_long_hair
  //   const deepRevImplications = (name: string): string[] => _(tags)
  //     .pickBy(tag => tag.implications.includes(name))
  //     .keys()
  //     .map(name => [name, ...deepRevImplications(name)])
  //     .flatten()
  //     .value()

  //   return [
  //     name,
  //     ...revAliases,
  //     ...deepRevImplications(name),
  //   ]
  // }

  return _(tags)
    // .keys()
    // .sortBy()
    // .map(name => groupTogether(name))
    // .flatten()
    // .uniq()
    // .map(name => ({ name, ...tags[name]! } as const))
    .map((tag, name) => ({ name, ...tag } as const))
    .filter(tag => (
      deprecated === true
      || !tag.deprecated
      || (deprecated === 'keep' && old.includes(tag.name))),
    )
    .filter(tag => aliased || tag.alias === null)
    .filter(tag => implicated || !implicit.includes(tag.name))
    .sortBy(tag => tag.name)
    .groupBy(tag => tag.category)
    .values()
    .sortBy(tags => tags[0]!.category || Number.POSITIVE_INFINITY)
    .map(tag => _(tag).map(tag => tag.name).join(' '))
    .join('\n')
}

const Tag: VoidComponent<{
  name: string
  type: number
  deprecated: boolean
  alias?: boolean
  level: number
}> = (props) => {
  return (
    <li class="flex items-center gap-1 w-fit leading-none">
      <input type="checkbox" tabindex="-1" />
      <Show
        when={props.level > 0}
      >
        <span
          class="nested-tag-icon text-muted select-none"
          style={{ 'margin-left': `${0.75 * (props.level - 1)}rem` }}
        >
          {props.alias ? '￩' : '↳'}
        </span>
      </Show>
      <span>
        <a
          class={clsx('break-words', `tag-type-${props.type}`, props.level > 0 && `tag-nesting-level-${props.level}`)}
          data-tag-name={props.name}
          data-is-deprecated={props.deprecated}
          href={`/posts?tags=${encodeURIComponent(props.name)}`}
        >
          {props.name.replaceAll('_', ' ')}
        </a>
      </span>
    </li>
  )
}

const TagSubList: VoidComponent<{
  tree: TagTree
  level: number
}> = props => (
  <For each={_(props.tree)
    .map((tag, name) => ({ name, ...tag }))
    .sortBy(tag => tag.name)
    .sortBy(tag => !tag.deprecated)
    .sortBy(tag => tag.category || Number.POSITIVE_INFINITY)
    .value()}
  >
    {tag => (
      <>
        <Tag
          name={tag.name}
          type={tag.category}
          deprecated={tag.deprecated}
          level={props.level}
        />
        <For each={[...tag.aliases]}>
          {alias => (
            <Tag
              name={alias}
              type={tag.category}
              deprecated={tag.deprecated}
              alias={true}
              level={props.level + 1}
            />
          )}
        </For>
        <TagSubList
          tree={tag.implications}
          level={props.level + 1}
        />
      </>
    )}
  </For>
)

const TagList: VoidComponent<{
  tags: TagRecord
}> = props => (
  <ul class="tag-list">
    <TagSubList
      tree={makeTagTree(props.tags)}
      level={0}
    />
  </ul>
)

const PreviewColumn: VoidComponent = () => {
  const [collapsed, setCollapsed] = createSignal(true)
  const toggleCollapsed = () => setCollapsed(collapsed => (!collapsed))

  const [tags, { refetch: refetchTags }] = createLazyResource(
    () => fetchTags(),
    { initialValue: {} },
  )
  createEffect(on(
    tags,
    () => Danbooru.RelatedTag.update_selected(),
    { defer: true },
  ))

  const onHeaderClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleCollapsed()

    if (!collapsed() && e.button === 0 && !e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey)
      void refetchTags()
  }

  const onRefreshClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    void refetchTags()
  }

  const updateTagString = (opts: MakeTagStringOptions) => {
    let tagString = makeTagString(tags(), opts)
    tagString = `${tagString} `

    if ($post_tag_string.val() !== tagString) {
      $post_tag_string.val(tagString)

      Danbooru.RelatedTag.update_selected()
      $post_tag_string.trigger('input')
    }
  }

  const onExpandClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    updateTagString({
      deprecated: 'keep',
      aliased: false,
      implicated: true,
    })
  }

  const onCompactClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    updateTagString({
      deprecated: 'keep',
      aliased: false,
      implicated: false,
    })
  }

  return (
    <div
      class="tag-column card p-2 h-fit space-y-1 preview-related-tags-column"
    >
      <div
        class="related-tags-header flex items-center justify-between gap-2 pr-2 cursor-pointer select-none"
        onClick={onHeaderClick}
      >
        <h6>
          <SpinnerIcon
            class={clsx('text-muted', 'align-middle', tags.loading || 'invisible')}
          />
          {' '}
          Preview
        </h6>
        <div
          class={clsx('text-sm', 'ml-auto', collapsed() && 'hidden')}
        >
          <a class="button-outline-primary button-xs" onClick={onRefreshClick}>refresh</a>
          {' '}
          <a class="button-outline-primary button-xs" onClick={onExpandClick}>expand</a>
          {' '}
          <a class="button-outline-primary button-xs" onClick={onCompactClick}>compact</a>
        </div>
        <ChevronDownIcon
          class={clsx('link-color', collapsed() && 'rotate-180')}
        />
      </div>
      <Show when={!(collapsed() || tags.loading)}>
        <TagList tags={tags()} />
      </Show>
    </div>
  )
}

const $related_tags_container = $<HTMLDivElement>('#related-tags-container')
if ($related_tags_container.length === 1)
  createRoot(() => $related_tags_container.prepend(<PreviewColumn /> as HTMLDivElement))
