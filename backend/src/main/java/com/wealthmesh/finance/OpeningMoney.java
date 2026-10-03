package com.wealthmesh.finance;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.regex.Pattern;

public record OpeningMoney(BigDecimal value) {
    private static final Pattern GRAMMAR = Pattern.compile(
            "-?\\$?(?:[0-9]+|[0-9]{1,3}(?:,[0-9]{3})+)(?:\\.[0-9]{1,2})?");
    private static final BigDecimal LIMIT = new BigDecimal("999999999999.99");

    public OpeningMoney {
        if (value == null || value.abs().compareTo(LIMIT) > 0 || value.stripTrailingZeros().scale() > 2) {
            throw FinanceException.invalid("openingAmount", "Enter a valid amount");
        }
        value = value.setScale(2, RoundingMode.UNNECESSARY);
    }

    public static OpeningMoney parse(String input) {
        String text = input == null ? "" : input.strip();
        if (text.isEmpty()) {
            return new OpeningMoney(new BigDecimal("0.00"));
        }
        if (!GRAMMAR.matcher(text).matches()) {
            throw FinanceException.invalid("openingAmount", "Enter a valid amount");
        }
        return new OpeningMoney(new BigDecimal(text.replace("$", "").replace(",", "")));
    }
}
