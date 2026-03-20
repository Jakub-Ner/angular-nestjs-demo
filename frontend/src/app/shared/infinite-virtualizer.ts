import { computed, effect, untracked, Signal } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { injectVirtualizer, Virtualizer } from '@tanstack/angular-virtual';

type InfiniteDataResponse<T> = {
  data: T[];
  meta: {
    nextCursor: any;
    hasMore: boolean;
  };
};

type InfiniteVirtualizerOptions<T, TParams> = {
  queryKey: (params: TParams) => any[];
  fetcher: (params: TParams, limit: number, cursor: any) => Observable<InfiniteDataResponse<T>>;
  signals: () => TParams;
  scrollElement: () => HTMLElement | null;
  limit?: number;
  estimateSize?: number;
  overscan?: number;
};

export function injectInfiniteVirtualizer<T, TParams>({
  queryKey,
  fetcher,
  signals: signals,
  scrollElement,
  limit = 20,
  estimateSize = 100,
  overscan = 5,
}: InfiniteVirtualizerOptions<T, TParams>) {
  const infiniteQuery = injectInfiniteQuery(() => ({
    queryKey: queryKey(signals()),
    queryFn: ({ pageParam }) => {
      return lastValueFrom(fetcher(signals(), limit, pageParam as string));
    },
    initialPageParam: null,
    getNextPageParam: (lastPage: InfiniteDataResponse<T>) => {
      return lastPage.meta.hasMore ? lastPage.meta.nextCursor : null;
    },
  }));

  const items = computed(() => {
    return infiniteQuery.data()?.pages.flatMap((page) => page.data) ?? [];
  });

  const virtualizer = injectVirtualizer(() => ({
    count: items().length,
    scrollElement: scrollElement(),
    estimateSize: () => estimateSize,
    overscan: overscan,
  }));

  effect(() => {
    const virtualItems = virtualizer.getVirtualItems();

    if (virtualItems.length === 0) {
      return;
    }

    const lastItem = virtualItems[virtualItems.length - 1];

    if (lastItem.index >= items().length - 1) {
      if (infiniteQuery.hasNextPage() && !infiniteQuery.isFetchingNextPage()) {
        untracked(() => {
          infiniteQuery.fetchNextPage();
        });
      }
    }
  });

  return {
    infiniteQuery,
    virtualizer,
    items,
  };
}
