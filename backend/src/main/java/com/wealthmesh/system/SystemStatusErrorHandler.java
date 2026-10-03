package com.wealthmesh.system;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = SystemStatusController.class)
public class SystemStatusErrorHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(SystemStatusErrorHandler.class);

    @ExceptionHandler({MetadataMissingException.class, DataAccessException.class})
    public ResponseEntity<SystemUnavailable> unavailable(RuntimeException failure) {
        LOGGER.warn("system_status_unavailable cause={}", failure.getClass().getSimpleName());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new SystemUnavailable("SYSTEM_UNAVAILABLE", "Setup status is unavailable."));
    }

    public record SystemUnavailable(String code, String message) {
    }
}
