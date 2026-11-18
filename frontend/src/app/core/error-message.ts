import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../models/task.model';

/**
 * Turns any HTTP failure into one sentence a user can act on.
 */
export function toErrorMessage(error: unknown, action: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return `Could not ${action}. Please try again.`;
  }

  if (error.status === 0) {
    return `Could not ${action}: the server is not reachable. Check that the backend is running on port 8080.`;
  }

  const body = error.error as Partial<ApiError> | null;
  const fieldMessages = body?.fieldErrors ? Object.values(body.fieldErrors) : [];
  if (fieldMessages.length > 0) {
    return fieldMessages.join(' ');
  }

  if (error.status >= 500) {
    return `Could not ${action} because of a server error. Please try again.`;
  }

  return body?.message ?? `Could not ${action} (HTTP ${error.status}).`;
}
