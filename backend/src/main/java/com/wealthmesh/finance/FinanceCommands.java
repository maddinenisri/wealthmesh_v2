package com.wealthmesh.finance;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public final class FinanceCommands {
    private FinanceCommands() { }
    public record HouseholdDraft(UUID id, String name) { }
    public record MemberDraft(UUID id, String name, String label) { }
    public record Details(String name, String bank, List<UUID> ownerIds) {
        public Details {
            ownerIds = List.copyOf(ownerIds);
        }
    }
    public record CheckingDraft(UUID id, Details details, OpeningMoney money, LocalDate date) { }
}
