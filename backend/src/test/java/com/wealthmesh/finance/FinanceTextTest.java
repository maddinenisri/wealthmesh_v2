package com.wealthmesh.finance;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class FinanceTextTest {
    @Test
    void normalizesUnicodeWhitespaceAndComparisonKeys() {
        assertThat(FinanceText.required("  Ma\u0301ya\t  Patel  ", "name", "Enter a member name"))
                .isEqualTo("Máya Patel");
        assertThat(FinanceText.key("  SAM\tParent ")).isEqualTo("sam parent");
        assertThat(FinanceText.optional("  ", "label", 80)).isNull();
        assertThat(FinanceText.key(null)).isEmpty();
        assertThat(FinanceText.key("Sam-Á")).isEqualTo("sam-á");
    }

    @Test
    void requiredNamesAndCodePointLimitsAreAuthoritative() {
        assertThatThrownBy(() -> FinanceText.required(" ", "name", "Enter a member name"))
                .isInstanceOf(FinanceException.class).hasMessage("Enter a member name");
        assertThat(FinanceText.required("😀".repeat(120), "name", "Required"))
                .isEqualTo("😀".repeat(120));
        assertThatThrownBy(() -> FinanceText.required("😀".repeat(121), "name", "Required"))
                .isInstanceOf(FinanceException.class);
        assertThatThrownBy(() -> FinanceText.optional("x".repeat(81), "label", 80))
                .isInstanceOf(FinanceException.class);
        assertThatThrownBy(() -> FinanceText.optional("x".repeat(121), "bank", 120))
                .isInstanceOf(FinanceException.class);
    }
}
