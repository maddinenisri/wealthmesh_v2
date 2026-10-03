package com.wealthmesh.finance;

import java.time.Clock;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;

public final class FinancialDates {
    private final Clock clock;

    public FinancialDates(Clock clock) {
        this.clock = clock;
    }

    public LocalDate today() {
        return LocalDate.now(clock);
    }

    public String zone() {
        return clock.getZone().getId();
    }

    public LocalDate parse(String input) {
        if (input == null || !input.matches("[0-9]{4}-[0-9]{2}-[0-9]{2}")) {
            throw invalidDate();
        }
        try {
            LocalDate date = LocalDate.parse(input);
            if (date.getYear() < 1 || date.isAfter(today())) {
                throw invalidDate();
            }
            return date;
        } catch (DateTimeParseException failure) {
            throw invalidDate();
        }
    }

    private FinanceException invalidDate() {
        return FinanceException.invalid("balanceDate", "Choose a valid date, today or earlier");
    }
}
