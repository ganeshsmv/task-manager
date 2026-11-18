package com.example.taskmanager.dto;

import java.time.Instant;
import java.util.Map;

/**
 * Uniform error body returned for every failed request.
 *
 * @param fieldErrors validation messages keyed by field name (empty when not a validation error)
 */
public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        Map<String, String> fieldErrors
) {
}
