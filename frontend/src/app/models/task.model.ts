export interface Task {
  id: number;
  title: string;
  description: string | null;
  createdAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

/** Error body returned by the backend's GlobalExceptionHandler. */
export interface ApiError {
  status: number;
  message: string;
  fieldErrors?: Record<string, string>;
}

export const TASK_LIMITS = {
  titleMaxLength: 255,
  descriptionMaxLength: 2000,
} as const;
