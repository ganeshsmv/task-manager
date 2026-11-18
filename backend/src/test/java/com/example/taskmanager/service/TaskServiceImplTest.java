package com.example.taskmanager.service;

import com.example.taskmanager.dto.CreateTaskRequest;
import com.example.taskmanager.dto.TaskResponse;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.mapper.TaskMapper;
import com.example.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for the service in isolation (repository mocked).
 */
@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    private TaskServiceImpl taskService;

    @BeforeEach
    void setUp() {
        taskService = new TaskServiceImpl(taskRepository, new TaskMapper());
    }

    @Test
    void createTask_trimsInputAndSaves() {
        when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TaskResponse response = taskService.createTask(new CreateTaskRequest("  Buy milk ", "  "));

        ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(captor.capture());
        assertThat(captor.getValue().getTitle()).isEqualTo("Buy milk");
        assertThat(captor.getValue().getDescription()).isNull();
        assertThat(response.title()).isEqualTo("Buy milk");
    }

    @Test
    void getAllTasks_mapsEntitiesToResponses() {
        when(taskRepository.findAllByOrderByCreatedAtDescIdDesc())
                .thenReturn(List.of(new Task("A", "desc"), new Task("B", null)));

        List<TaskResponse> result = taskService.getAllTasks();

        assertThat(result).extracting(TaskResponse::title).containsExactly("A", "B");
    }
}
