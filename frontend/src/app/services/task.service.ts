import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CreateTaskRequest, Task } from '../models/task.model';

/** The only place in the app that knows about the tasks REST API. */
@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/tasks`;

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  create(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, request);
  }
}
