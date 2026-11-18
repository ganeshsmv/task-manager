package com.example.taskmanager.service;

import com.example.taskmanager.dto.CreateTaskRequest;
import com.example.taskmanager.dto.TaskResponse;

import java.util.List;

public interface TaskService {

    TaskResponse createTask(CreateTaskRequest request);

    /** Returns all tasks, newest first. */
    List<TaskResponse> getAllTasks();
}
