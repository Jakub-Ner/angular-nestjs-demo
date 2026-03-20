import { Component, input, output, OnInit } from '@angular/core';
import { Task, TasksService } from '../../../api';
import { FormsModule } from '@angular/forms';
import { TaskDateCell } from '../../../shared/task-date-cell';

@Component({
  selector: 'app-task-element-edit',
  standalone: true,
  imports: [FormsModule, TaskDateCell],
  styleUrls: ['../task-list/task-list.css'],
  template: `
    <div class="task-cell-primary">
      <input
        type="checkbox"
        [checked]="editableTask.status === 'DONE'"
        (change)="toggleStatus()"
        class="task-checkbox"
      />
      <input
        type="text"
        [(ngModel)]="editableTask.title"
        class="task-input w-full text-start font-medium px-2"
        placeholder="Task title"
        autofocus
      />
    </div>

    <app-task-date-cell [date]="editableTask.createdAt" />

    <div class="task-cell-secondary">
      <input
        type="datetime-local"
        [(ngModel)]="editableTask.due"
        class="task-input w-full text-sm text-gray-700"
      />
    </div>

    <app-task-date-cell [date]="editableTask.completedAt" />

    <div class="task-cell-center">
      <select
        [(ngModel)]="editableTask.status"
        class="task-input w-full text-xs font-semibold text-gray-700 border"
      >
        <option value="" disabled selected>Select a status</option>
        <option value="OPEN">Open</option>
        <option value="DONE">Done</option>
      </select>
    </div>

    <div class="task-cell-right">
      <button type="button" class="task-btn-gray" (click)="onCancel()" title="Cancel">
        <span class="material-icons">close</span>
      </button>
      <button type="button" class="task-btn-blue" (click)="onSave()" title="Save">
        <span class="material-icons">check</span>
      </button>
    </div>
  `,
  host: {
    class: 'task-row border-blue-200 bg-blue-50/50 z-10',
  },
})
export class TaskElementEdit implements OnInit {
  task = input.required<Task>();

  saveRequested = output<Task>();
  cancelRequested = output<void>();

  editableTask!: Task;

  ngOnInit() {
    this.editableTask = { ...this.task() };
  }

  toggleStatus() {
    this.editableTask.status = this.editableTask.status === 'DONE' ? 'OPEN' : 'DONE';
  }

  onSave() {
    this.saveRequested.emit(this.editableTask);
  }

  onCancel() {
    this.cancelRequested.emit();
  }
}
