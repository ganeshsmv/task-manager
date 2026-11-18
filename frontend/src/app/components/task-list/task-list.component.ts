import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Task } from '../../models/task.model';

/** Presentational component: renders whatever tasks it is given. */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  @Input({ required: true }) tasks: Task[] = [];
}
