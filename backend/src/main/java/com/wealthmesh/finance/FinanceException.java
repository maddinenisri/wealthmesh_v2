package com.wealthmesh.finance;

import java.util.Map;

public class FinanceException extends RuntimeException {
    private final int status;
    private final String code;
    private final Map<String, String> fieldErrors;

    public FinanceException(int status, String code, String message, Map<String, String> fieldErrors) {
        super(message);
        this.status = status;
        this.code = code;
        this.fieldErrors = Map.copyOf(fieldErrors);
    }

    public static FinanceException invalid(String field, String message) {
        return new FinanceException(400, "INVALID_INPUT", message, Map.of(field, message));
    }

    public int status() { return status; }
    public String code() { return code; }
    public Map<String, String> fieldErrors() { return fieldErrors; }
}
