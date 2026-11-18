package com.example.taskmanager.dto;

import java.time.Instant;

/**
 * Representation of a task returned by the API.
 */
public record TaskResponse(Long id, String title, String description, Instant createdAt) {
}
