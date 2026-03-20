import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-date-cell',
  standalone: true,
  imports: [DatePipe],
  template: `
    @if (date()) {
      {{ date() | date: 'short' }}
    } @else {
      --
    }
  `,
  host: {
    class: 'task-cell-secondary',
  },
})
export class TaskDateCell {
  date = input<string | Date | null | undefined>();
}
