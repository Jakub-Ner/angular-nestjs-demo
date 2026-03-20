import { Component, input, inject, viewChild, ElementRef } from '@angular/core';
import { TasksService } from '../../../api';
import { injectInfiniteVirtualizer } from '../../../shared/infinite-virtualizer';
import { TaskElement } from '../task-element/task-element';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskElement],
  styleUrls: ['./task-list.css'],
  template: `
    <div #scrollContainer class="h-[70vh] overflow-auto border border-gray-300 rounded-md bg-white">
      <div
        class="sticky top-0 z-20 grid task-grid-cols items-center border-b-2 border-gray-100 bg-white px-4 font-semibold text-lg text-gray-700 h-12"
      >
        <div class="p-2">Task Details</div>
        <div class="p-2">Created At</div>
        <div class="p-2">Due Date</div>
        <div class="p-2">Completed at</div>
        <div class="p-2 text-center">Status</div>
        <div class="p-2 text-center">Actions</div>
      </div>

      <div class="relative w-full" [style.height.px]="virtualizer.getTotalSize()">
        @for (vRow of virtualizer.getVirtualItems(); track vRow.key) {
          @let task = allTasks()[vRow.index];

          <app-task-element
            [task]="task"
            [style.transform]="'translateY(' + vRow.start + 'px)'"
            [style.height.px]="vRow.size"
          />
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
  parentRef = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  private infiniteVirtualizer = injectInfiniteVirtualizer({
    queryKey: (showCompleted) => ['tasks', showCompleted],
    fetcher: (showCompleted, limit, cursor) =>
      this.tasksService.tasksControllerFindAll(limit, cursor, showCompleted ? 'DONE' : 'OPEN'),
    signals: () => this.showCompleted(),
    scrollElement: () => this.parentRef()?.nativeElement ?? null,
  });

  allTasks = this.infiniteVirtualizer.items;
  virtualizer = this.infiniteVirtualizer.virtualizer;
  infiniteQuery = this.infiniteVirtualizer.infiniteQuery;
}
