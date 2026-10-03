package com.wealthmesh.finance;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(assignableTypes = FinanceController.class)
public class FinanceErrors {
    private static final Logger LOGGER = LoggerFactory.getLogger(FinanceErrors.class);

    @ExceptionHandler(FinanceException.class)
    public ResponseEntity<ErrorBody> rejected(FinanceException failure, HttpServletRequest request) {
        if (failure.status() >= 500) {
            log(failure, request);
        }
        return ResponseEntity.status(failure.status()).body(
                new ErrorBody(failure.code(), failure.getMessage(), failure.fieldErrors()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorBody> malformed(HttpMessageNotReadableException failure) {
        return ResponseEntity.badRequest().body(new ErrorBody("INVALID_INPUT", "Send valid JSON fields", Map.of()));
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorBody> unavailable(DataAccessException failure, HttpServletRequest request) {
        log(failure, request);
        return ResponseEntity.status(503).body(new ErrorBody("FINANCE_UNAVAILABLE",
                "The local server could not save or read household information. Try again.", Map.of()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorBody> unexpected(RuntimeException failure, HttpServletRequest request) {
        log(failure, request);
        return ResponseEntity.status(500).body(new ErrorBody("UNEXPECTED_FAILURE",
                "The local server could not complete this request. Check the server logs.", Map.of()));
    }

    private void log(RuntimeException failure, HttpServletRequest request) {
        LOGGER.warn("finance_request_failed request_id={} operation={} cause={}",
                request.getAttribute("financeRequestId"), request.getMethod(), failure.getClass().getSimpleName());
    }

    public record ErrorBody(String code, String message, Map<String, String> fieldErrors) { }
}
