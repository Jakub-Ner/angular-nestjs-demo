import { Component, signal } from '@angular/core';
import { TaskList } from './components/task-list/task-list';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [TaskList],
  template: `
    <main class="pt-10 pl-4 ">
      <h1 class="font-semibold text-2xl">My Great TODO List</h1>

      <div class="flex items-center gap-2 mt-4 text-base font-normal">
        <input
          type="checkbox"
          class="h-5 w-5"
          id="showCompleted"
          (change)="toggleShowCompleted()"
          [checked]="showCompleted()"
        />
        <label for="showCompleted">Show completed items</label>
      </div>

      <div class="border p-2 mt-5">
        <app-task-list [showCompleted]="showCompleted()" />
      </div>
    </main>
  `,
})
export class Todo {
  showCompleted = signal(false);

  toggleShowCompleted() {
    this.showCompleted.update((prev) => !prev);
  }
}
