package com.wealthmesh.finance;

import java.util.List;
import java.util.UUID;

public final class FinanceViews {
    private FinanceViews() { }

    public record Household(UUID id, String name) { }
    public record Member(UUID id, String name, String label) { }
    public record Account(UUID id, String type, String name, String bank, List<Member> owners,
            String currency, String balance, String balanceDate) {
        public Account {
            owners = List.copyOf(owners);
        }
    }
    public record Total(String currency, String amount) { }
    public record Overview(Household household, List<Member> members, List<Account> accounts,
            Total checkingTotal, String today, String financialZone) { }
    public record Saved<T>(T value, boolean created) { }
}
