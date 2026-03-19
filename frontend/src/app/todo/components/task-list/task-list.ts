import {
  Component,
  computed,
  input,
  effect,
  inject,
  viewChild,
  ElementRef,
  untracked,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { injectVirtualizer } from '@tanstack/angular-virtual';
import { TasksService } from '../../../api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe],
  styleUrls: ['./task-list.css'],
  template: `
    <div #scrollContainer class="h-[70vh] overflow-auto border border-gray-300 rounded-md bg-white">
      <div
        class="sticky top-0 z-20 grid task-grid-cols items-center border-b-2 border-gray-100 bg-white px-4 font-semibold text-lg text-gray-700 h-[50px]"
      >
        <div class="p-2">Task Details</div>
        <div class="p-2">Created At</div>
        <div class="p-2">Due Date</div>
        <div class="p-2 text-center">Status</div>
        <div class="p-2 text-right">Actions</div>
      </div>

      <div class="relative w-full" [style.height.px]="virtualizer.getTotalSize()">
        @for (vRow of virtualizer.getVirtualItems(); track vRow.key) {
          @let task = allTasks()[vRow.index];

          <div
            class="absolute left-0 top-0 grid w-full task-grid-cols items-center border-b border-gray-50 px-4 hover:bg-blue-50/30 transition-colors"
            [style.transform]="'translateY(' + vRow.start + 'px)'"
            [style.height.px]="vRow.size"
          >
            <div class="flex items-center gap-3 p-2 min-w-0">
              <input
                type="checkbox"
                [checked]="task?.status === 'DONE'"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="font-medium text-gray-900 truncate">{{ task?.title }}</span>
            </div>

            <div class="p-2 text-sm text-gray-500">
              @if (task?.createdAt) {
                {{ task?.createdAt | date: 'short' }}
              } @else {
                -
              }
            </div>

            <div class="p-2 text-sm text-gray-500">
              @if (task?.due) {
                {{ task?.due | date: 'short' }}
              } @else {
                -
              }
            </div>

            <div class="p-2 text-center">
              <span
                class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                [class]="
                  task?.status === 'DONE'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-amber-100 text-amber-800'
                "
              >
                {{ task?.status === 'DONE' ? 'Done' : 'Pending' }}
              </span>
            </div>

            <div class="p-2 text-right">
              <button
                type="button"
                class="text-sm font-semibold text-blue-600 hover:text-blue-800 active:text-blue-900"
              >
                Edit
              </button>
            </div>
          </div>
        } @empty {
          <div class="p-8 text-center text-gray-500">No tasks found.</div>
        }
      </div>
    </div>
  `,
})
export class TaskList {
  tasksService = inject(TasksService);
  showCompleted = input<boolean>(false);

  infiniteQuery = injectInfiniteQuery(() => ({
    queryKey: ['tasks', this.showCompleted()],
    queryFn: ({ pageParam }) => {
      console.log('Fetching page with cursor:', pageParam);
      return lastValueFrom(this.tasksService.tasksControllerFindAll(20, pageParam as string));
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.meta.hasMore ? lastPage.meta.nextCursor : null;
    },
  }));

  allTasks = computed(() => {
    const currentData = this.infiniteQuery.data();
    console.log('Current Data:', currentData);
    return currentData?.pages.flatMap((page) => page.data) ?? [];
  });

  parentRef = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  virtualizer = injectVirtualizer(() => ({
    count: this.allTasks().length,
    scrollElement: this.parentRef()?.nativeElement ?? null,
    estimateSize: () => 100,
    overscan: 5,
  }));

  constructor() {
    effect(() => {
      const virtualItems = this.virtualizer.getVirtualItems();

      if (virtualItems.length === 0) {
        return;
      }

      const lastItem = virtualItems[virtualItems.length - 1];

      if (lastItem.index >= this.allTasks().length - 1) {
        if (this.infiniteQuery.hasNextPage() && !this.infiniteQuery.isFetchingNextPage()) {
          untracked(() => {
            this.infiniteQuery.fetchNextPage();
          });
        }
      }
    });
  }
}
