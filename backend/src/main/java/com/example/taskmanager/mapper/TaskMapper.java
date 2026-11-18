package com.example.taskmanager.mapper;

import com.example.taskmanager.dto.CreateTaskRequest;
import com.example.taskmanager.dto.TaskResponse;
import com.example.taskmanager.entity.Task;
import org.springframework.stereotype.Component;

/**
 * Converts between API DTOs and the JPA entity so the entity never leaves the service layer.
 */
@Component
public class TaskMapper {

    public Task toEntity(CreateTaskRequest request) {
        return new Task(request.title().trim(), normalize(request.description()));
    }

    public TaskResponse toResponse(Task task) {
        return new TaskResponse(task.getId(), task.getTitle(), task.getDescription(), task.getCreatedAt());
    }

    /** Stores blank descriptions as null so "optional" means one thing in the database. */
    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
