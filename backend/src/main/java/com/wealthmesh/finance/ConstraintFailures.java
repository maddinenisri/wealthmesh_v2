package com.wealthmesh.finance;

import java.util.Set;
import org.hibernate.exception.ConstraintViolationException;

public final class ConstraintFailures {
    private ConstraintFailures() { }

    public static boolean unique(RuntimeException failure, Set<String> allowed) {
        Throwable cause = failure;
        while (cause != null) {
            if (cause instanceof ConstraintViolationException constraint) {
                return "23505".equals(constraint.getSQLState()) && allowed.contains(constraint.getConstraintName());
            }
            cause = cause.getCause();
        }
        return false;
    }
}
