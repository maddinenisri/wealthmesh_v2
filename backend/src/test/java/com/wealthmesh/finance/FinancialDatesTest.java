package com.wealthmesh.finance;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

class FinancialDatesTest {
    private final FinancialDates dates = new FinancialDates(Clock.fixed(
            Instant.parse("2026-09-06T03:59:59Z"), ZoneId.of("America/New_York")));

    @Test
    void acceptsStrictPastAndTodayDatesWithoutTimestampConversion() {
        assertThat(dates.today().toString()).isEqualTo("2026-09-05");
        assertThat(dates.zone()).isEqualTo("America/New_York");
        assertThat(dates.parse("2026-09-01").toString()).isEqualTo("2026-09-01");
        assertThat(dates.parse("2026-09-05")).isEqualTo(dates.today());
        assertThat(dates.parse("2024-02-29").toString()).isEqualTo("2024-02-29");
        assertThat(dates.parse("0001-01-01").getYear()).isEqualTo(1);
        var midnight = new FinancialDates(Clock.fixed(
                Instant.parse("2026-10-01T04:00:00Z"), ZoneId.of("America/New_York")));
        assertThat(midnight.today().toString()).isEqualTo("2026-10-01");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"2026-09-06", "2026-02-29", "2026-9-01", "0000-01-01", "10000-01-01",
        "9999-12-31", "2026-09-01T00:00:00Z", " 2026-09-01", "2026-13-01"})
    void rejectsInvalidAndFutureDates(String input) {
        assertThatThrownBy(() -> dates.parse(input)).isInstanceOf(FinanceException.class);
    }
}
