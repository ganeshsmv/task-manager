import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { toErrorMessage } from '../../core/error-message';
import { TASK_LIMITS, Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

/** Whitespace-only titles are rejected on the client too, matching @NotBlank on the server. */
const notBlank = Validators.pattern(/\S/);

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent {
  @Output() readonly created = new EventEmitter<Task>();

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly taskService = inject(TaskService);

  readonly limits = TASK_LIMITS;
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.group({
    title: ['', [Validators.required, notBlank, Validators.maxLength(TASK_LIMITS.titleMaxLength)]],
    description: ['', [Validators.maxLength(TASK_LIMITS.descriptionMaxLength)]],
  });

  get title() {
    return this.form.controls.title;
  }

  get description() {
    return this.form.controls.description;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, description } = this.form.getRawValue();
    this.saving.set(true);
    this.errorMessage.set(null);

    this.taskService
      .create({ title: title.trim(), description: description.trim() || undefined })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (task) => {
          this.form.reset();
          this.created.emit(task);
        },
        error: (err) => this.errorMessage.set(toErrorMessage(err, 'save the task')),
      });
  }
}
