import { Component, input, output } from '@angular/core';
import { Task } from '../../../api';
import { TitleCasePipe } from '@angular/common';
import { TaskDateCell } from '../../../shared/task-date-cell';

@Component({
  selector: 'app-task-element-readonly',
  standalone: true,
  imports: [TitleCasePipe, TaskDateCell],
  styleUrls: ['../task-list/task-list.css'],
  template: `
    <div class="task-cell-primary">
      <input
        type="checkbox"
        (change)="onMarkAsDoneToggle($event)"
        [checked]="task()?.status === 'DONE'"
        class="task-checkbox"
      />
      <span class="font-medium text-gray-900 px-2 truncate">{{ task()?.title }}</span>
    </div>

    <app-task-date-cell [date]="task()?.createdAt" />

    <app-task-date-cell [date]="task()?.due" />

    <app-task-date-cell [date]="task()?.completedAt" />

    <div class="task-cell-center">
      <span
        class="task-badge"
        [class]="
          task()?.status === 'DONE' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
        "
        class="px-2 py-1 rounded"
      >
        {{ task()?.status | titlecase }}
      </span>
    </div>

    <div class="task-cell-center">
      <button type="button" class="task-btn-blue" (click)="onEditClick()" title="Edit">
        <span class="material-icons">edit</span>
      </button>
    </div>
  `,
  host: {
    class: 'task-row border-gray-50 hover:bg-blue-50/30',
  },
})
export class TaskElementReadonly {
  task = input.required<Task>();

  editRequested = output<void>();
  statusChangeRequested = output<Task.StatusEnum>();

  onEditClick() {
    this.editRequested.emit();
  }

  onMarkAsDoneToggle(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const newStatus = isChecked ? Task.StatusEnum.Done : Task.StatusEnum.Open;

    this.statusChangeRequested.emit(newStatus);
  }
}
