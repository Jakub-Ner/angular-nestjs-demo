import { Routes } from '@angular/router';
import { Todo } from './todo/todo';

export const routes: Routes = [
  {
    path: '',
    component: Todo,
    title: 'My Todo App',
  },
];
