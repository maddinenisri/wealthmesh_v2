package com.wealthmesh.finance;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.StreamSupport;
import org.springframework.stereotype.Component;
import tools.jackson.databind.JsonNode;

@Component
public class FinanceCommandReader {
    private final FinancialDates dates;

    public FinanceCommandReader(FinancialDates dates) {
        this.dates = dates;
    }

    public FinanceCommands.HouseholdDraft household(JsonNode body, UUID id) {
        fields(body, id == null ? Set.of("id", "name") : Set.of("name"));
        return new FinanceCommands.HouseholdDraft(id == null ? uuid(text(body, "id", false), "id") : id,
                FinanceText.required(text(body, "name", false), "name", "Enter a household name"));
    }

    public String householdName(JsonNode body) {
        fields(body, Set.of("name"));
        return FinanceText.required(text(body, "name", false), "name", "Enter a household name");
    }

    public FinanceCommands.MemberDraft member(JsonNode body, UUID id) {
        fields(body, id == null ? Set.of("id", "name", "label") : Set.of("name", "label"));
        return new FinanceCommands.MemberDraft(id == null ? uuid(text(body, "id", false), "id") : id,
                FinanceText.required(text(body, "name", false), "name", "Enter a member name"),
                FinanceText.optional(text(body, "label", true), "label", 80));
    }

    public FinanceCommands.CheckingDraft checking(JsonNode body) {
        fields(body, Set.of("id", "name", "bank", "ownerIds", "openingAmount", "balanceDate"));
        return new FinanceCommands.CheckingDraft(uuid(text(body, "id", false), "id"), detailsValues(body),
                OpeningMoney.parse(text(body, "openingAmount", true)), dates.parse(text(body, "balanceDate", false)));
    }

    public FinanceCommands.Details details(JsonNode body) {
        fields(body, Set.of("name", "bank", "ownerIds"));
        return detailsValues(body);
    }

    private FinanceCommands.Details detailsValues(JsonNode body) {
        return new FinanceCommands.Details(
                FinanceText.required(text(body, "name", false), "name", "Enter an account name"),
                FinanceText.optional(text(body, "bank", true), "bank", 120), owners(body.get("ownerIds")));
    }

    private List<UUID> owners(JsonNode value) {
        if (value == null || !value.isArray() || value.isEmpty()) {
            throw FinanceException.invalid("ownerIds", "Choose at least one owner");
        }
        List<UUID> ids = StreamSupport.stream(value.spliterator(), false).map(item -> {
            if (!item.isString()) {
                throw FinanceException.invalid("ownerIds", "Choose valid household members");
            }
            return uuid(item.asString(), "ownerIds");
        }).toList();
        if (new HashSet<>(ids).size() != ids.size()) {
            throw FinanceException.invalid("ownerIds", "Choose each owner only once");
        }
        return ids;
    }

    private void fields(JsonNode body, Set<String> allowed) {
        if (body == null || !body.isObject()) {
            throw FinanceException.invalid("form", "Send an object with the required fields");
        }
        for (String field : body.propertyNames()) {
            if (!allowed.contains(field)) {
                throw FinanceException.invalid("form", "Remove unsupported fields");
            }
        }
    }

    private String text(JsonNode body, String field, boolean optional) {
        JsonNode value = body.get(field);
        if (optional && (value == null || value.isNull())) {
            return null;
        }
        if (value == null || !value.isString()) {
            throw FinanceException.invalid(field, "Enter valid text for " + field);
        }
        return value.asString();
    }

    public UUID uuid(String value, String field) {
        if (value == null || !value.matches("[0-9a-fA-F]{8}(?:-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}")) {
            throw FinanceException.invalid(field, "Use a valid identifier");
        }
        return UUID.fromString(value);
    }
}
