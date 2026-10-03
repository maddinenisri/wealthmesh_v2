package com.wealthmesh.finance;

import java.text.Normalizer;
import java.util.Locale;

public final class FinanceText {
    private FinanceText() { }

    public static String required(String value, String field, String message) {
        String normalized = optional(value, field, 120);
        if (normalized == null) {
            throw FinanceException.invalid(field, message);
        }
        return normalized;
    }

    public static String optional(String value, String field, int limit) {
        if (value == null) {
            return null;
        }
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFC)
                .replaceAll("(?U)\\s+", " ").strip();
        if (normalized.codePointCount(0, normalized.length()) > limit) {
            throw FinanceException.invalid(field, "Use at most " + limit + " characters");
        }
        return normalized.isEmpty() ? null : normalized;
    }

    public static String key(String value) {
        String normalized = optional(value, "name", 120);
        return normalized == null ? "" : normalized.toLowerCase(Locale.ROOT);
    }
}
