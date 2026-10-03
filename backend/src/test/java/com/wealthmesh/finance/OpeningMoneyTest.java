package com.wealthmesh.finance;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

class OpeningMoneyTest {
    @ParameterizedTest
    @CsvSource(delimiter = '|', textBlock = """
            5000 | 5000.00
            5000.0 | 5000.00
            $5,000.00 | 5000.00
            -125.50 | -125.50
            -$125.50 | -125.50
            -0.00 | 0.00
            999999999999.99 | 999999999999.99
            -999999999999.99 | -999999999999.99
            """)
    void parsesExactUsdWithoutRounding(String input, String expected) {
        assertThat(OpeningMoney.parse(input).value().toPlainString()).isEqualTo(expected);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {" ", "0", "$0.00"})
    void blankAndZeroMeanZero(String input) {
        assertThat(OpeningMoney.parse(input).value().toPlainString()).isEqualTo("0.00");
    }

    @ParameterizedTest
    @ValueSource(strings = {"five thousand", "1.000", "1.001", "1e3", "+1", "(1)", "1 000",
        "€1", "1,00", "1234,000", ".50", "5.", "1000000000000", "-1000000000000"})
    void rejectsInvalidAmountsRatherThanRounding(String input) {
        assertThatThrownBy(() -> OpeningMoney.parse(input)).isInstanceOf(FinanceException.class)
                .hasMessage("Enter a valid amount");
    }

    @Test
    void sumsCentsAndOverdraftsExactlyBeyondTheIndividualRange() {
        var sum = OpeningMoney.parse("999999999999.99").value()
                .add(OpeningMoney.parse("999999999999.99").value())
                .add(OpeningMoney.parse("0.10").value()).add(OpeningMoney.parse("0.20").value())
                .add(OpeningMoney.parse("-125.50").value());
        assertThat(sum.toPlainString()).isEqualTo("1999999999874.78");
    }
}
