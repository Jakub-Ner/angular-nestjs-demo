import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { inject, Component, input, signal } from '@angular/core';
import { Task, TasksService } from '../../../api';
import { TaskElementReadonly } from './task-element-readonly';
import { TaskElementEdit } from './task-element-edit';

@Component({
  selector: 'app-task-element',
  standalone: true,
  imports: [TaskElementEdit, TaskElementReadonly],
  styleUrls: ['../task-list/task-list.css'],
  template: `
    @let pendingTask = mutation.variables();
    @let displayTask = pendingTask && pendingTask.id === task().id ? pendingTask : task();

    @if (isEditing()) {
      <app-task-element-edit
        (cancelRequested)="toggleEditing(false)"
        (saveRequested)="onSaveRequested($event)"
        [task]="displayTask"
      />
    } @else {
      <app-task-element-readonly
        (statusChangeRequested)="onStatusChangeRequested($event)"
        (editRequested)="toggleEditing(true)"
        [task]="displayTask"
      />
    }
  `,
  host: {
    class: 'block relative',
  },
})
export class TaskElement {
  private tasksService = inject(TasksService);
  private queryClient = inject(QueryClient);

  task = input.required<Task>();
  isEditing = signal(false);

  mutation = injectMutation(() => ({
    mutationFn: (updatedTask: Task) => {
      const { id, createdAt, completedAt, ...updateData } = updatedTask;
      return lastValueFrom(this.tasksService.tasksControllerUpdate(updatedTask.id, updateData));
    },
    onSettled: () => {
      this.queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  }));

  toggleEditing(on: boolean) {
    this.isEditing.set(on);
  }

  onStatusChangeRequested(newStatus: Task.StatusEnum) {
    this.onSaveRequested({ ...this.task(), status: newStatus });
  }

  onSaveRequested(updatedTask: Task) {
    this.toggleEditing(false);

    this.mutation.mutate(updatedTask);
  }
}
