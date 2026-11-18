package com.example.taskmanager.dto;

import com.example.taskmanager.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Payload accepted by POST /api/tasks.
 */
public record CreateTaskRequest(

        @NotBlank(message = "Title is required")
        @Size(max = Task.TITLE_MAX_LENGTH, message = "Title must be at most {max} characters")
        String title,

        @Size(max = Task.DESCRIPTION_MAX_LENGTH, message = "Description must be at most {max} characters")
        String description
) {
}
