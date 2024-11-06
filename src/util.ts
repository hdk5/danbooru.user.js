import type {
  InitializedResourceOptions,
  InitializedResourceReturn,
  NoInfer,
  ResourceFetcher,
} from 'solid-js'
import { createResource } from 'solid-js'

// https://github.com/solidjs/solid/issues/1862
export function createLazyResource<T, R = unknown>(
  fetcher: ResourceFetcher<true, T, R>,
  options: InitializedResourceOptions<NoInfer<T>, true>,
): InitializedResourceReturn<T, R> {
  let initialized = false
  const [resource, { mutate, refetch }] = createResource(
    // eslint-disable-next-line ts/promise-function-async
    (source, info) => initialized ? fetcher(source, info) : options.initialValue,
    options,
  ) satisfies InitializedResourceReturn<T, R>

  return [
    resource,
    {
      mutate,
      // eslint-disable-next-line ts/promise-function-async
      refetch: (info) => {
        initialized = true
        return refetch(info)
      },
    },
  ]
}
