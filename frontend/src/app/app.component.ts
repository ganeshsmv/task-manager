import { Component, OnInit, inject, signal } from '@angular/core';

import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { toErrorMessage } from './core/error-message';
import { Task } from './models/task.model';
import { TaskService } from './services/task.service';

/** Page container: owns the task list state and wires the form and list together. */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskFormComponent, TaskListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly taskService = inject(TaskService);

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.loadError.set(null);

    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: (err) => {
        this.loadError.set(toErrorMessage(err, 'load tasks'));
        this.loading.set(false);
      },
    });
  }

  onTaskCreated(task: Task): void {
    // Newest first, matching the order returned by GET /api/tasks.
    this.tasks.update((tasks) => [task, ...tasks]);
  }
}
