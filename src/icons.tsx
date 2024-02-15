import { clsx } from 'clsx'
import { splitProps } from 'solid-js'

import type { JSX } from 'solid-js'
import type { Merge } from 'type-fest'

export const ICONS_PATH = '/packs/static/public/images/icons-f4ca0cd60cf43cc54f9a.svg'

type SvgIconProps = Merge<JSX.SVGElementTags['svg'], {
  name: string
  id?: string
  class?: string
}>

function SvgIcon(initProps: SvgIconProps) {
  const [props, options] = splitProps(initProps, ['name', 'id', 'class'])

  return (
    <svg
      class={clsx('icon', 'svg-icon', `${props.name}-icon`, props.class)}
      {...options}
    >
      <use
        fill="currentColor"
        href={`${ICONS_PATH}#${props.id ?? props.name}`}
      />
    </svg>
  )
}

export function SpinnerIcon(props: Omit<SvgIconProps, 'name' | 'viewBox'>) {
  return (
    <SvgIcon
      {...props}
      name="spinner"
      viewBox="0 0 512 512"
      class={clsx('animate-spin', props.class)}
    />
  )
}

export function ChevronDownIcon(props: Omit<SvgIconProps, 'name' | 'viewBox'>) {
  return (
    <SvgIcon
      {...props}
      name="chevron-down"
      viewBox="0 0 448 512"
    />
  )
}
