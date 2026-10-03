package com.wealthmesh.finance;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

@Service
public class FinanceService {
    private final FinanceRepository repository;
    private final FinancialDates dates;
    private final TransactionTemplate transactions;
    private final TransactionTemplate reads;

    public FinanceService(FinanceRepository repository, FinancialDates dates, PlatformTransactionManager manager) {
        this.repository = repository;
        this.dates = dates;
        this.transactions = new TransactionTemplate(manager);
        this.reads = new TransactionTemplate(manager);
        this.reads.setReadOnly(true);
    }

    public FinanceViews.Overview overview() {
        return reads.execute(status -> readOverview());
    }

    private FinanceViews.Overview readOverview() {
        var household = repository.household().orElse(null);
        var members = household == null ? List.<FinanceViews.Member>of() : repository.members(household.id());
        var accounts = household == null ? List.<FinanceViews.Account>of() : repository.accounts(household.id());
        BigDecimal total = accounts.stream().map(account -> new BigDecimal(account.balance()))
                .reduce(new BigDecimal("0.00"), BigDecimal::add);
        return new FinanceViews.Overview(household, members, accounts,
                new FinanceViews.Total("USD", total.toPlainString()),
                dates.today().toString(), dates.zone());
    }

    public FinanceViews.Saved<FinanceViews.Household> createHousehold(FinanceCommands.HouseholdDraft draft) {
        try {
            return transactions.execute(status -> {
                repository.insertHousehold(draft);
                return new FinanceViews.Saved<>(new FinanceViews.Household(draft.id(), draft.name()), true);
            });
        } catch (DataIntegrityViolationException conflict) {
            requireUnique(conflict, Set.of("household_pkey", "household_singleton_key"));
            var saved = reads.execute(status -> repository.household().orElseThrow(() -> conflict));
            if (saved.id().equals(draft.id()) && saved.name().equals(draft.name())) {
                return new FinanceViews.Saved<>(saved, false);
            }
            throw conflict("HOUSEHOLD_EXISTS", "This installation already has a household");
        }
    }

    public FinanceViews.Household renameHousehold(String name) {
        return transactions.execute(status -> {
            UUID id = requireHousehold().id();
            repository.renameHousehold(id, name);
            return new FinanceViews.Household(id, name);
        });
    }

    public FinanceViews.Saved<FinanceViews.Member> createMember(FinanceCommands.MemberDraft draft) {
        UUID householdId = requireHousehold().id();
        try {
            return transactions.execute(status -> {
                repository.insertMember(householdId, draft);
                return new FinanceViews.Saved<>(new FinanceViews.Member(draft.id(), draft.name(), draft.label()), true);
            });
        } catch (DataIntegrityViolationException conflict) {
            requireUnique(conflict, Set.of("household_member_pkey",
                    "household_member_household_id_name_key_label_key_key"));
            var saved = reads.execute(status -> repository.members(householdId).stream()
                    .filter(member -> member.id().equals(draft.id())).findFirst());
            if (saved.isPresent()) {
                if (saved.get().name().equals(draft.name()) && Objects.equals(saved.get().label(), draft.label())) {
                    return new FinanceViews.Saved<>(saved.get(), false);
                }
                throw conflict("CREATE_ID_CONFLICT", "This member identifier is already saved with different details");
            }
            throw memberPairConflict(draft.label());
        }
    }

    public FinanceViews.Member editMember(FinanceCommands.MemberDraft draft) {
        try {
            return transactions.execute(status -> {
                repository.editMember(requireHousehold().id(), draft);
                return new FinanceViews.Member(draft.id(), draft.name(), draft.label());
            });
        } catch (DataIntegrityViolationException conflict) {
            requireUnique(conflict, Set.of("household_member_household_id_name_key_label_key_key"));
            throw memberPairConflict(draft.label());
        }
    }

    public FinanceViews.Saved<FinanceViews.Account> createChecking(FinanceCommands.CheckingDraft draft) {
        UUID householdId = requireHousehold().id();
        try {
            return transactions.execute(status -> {
                validateOwners(householdId, draft.details().ownerIds());
                repository.insertAccount(householdId, draft);
                return new FinanceViews.Saved<>(account(draft.id()), true);
            });
        } catch (DataIntegrityViolationException conflict) {
            requireUnique(conflict, Set.of("checking_account_pkey"));
            var saved = reads.execute(status -> repository.account(draft.id()).orElseThrow(() -> conflict));
            if (matches(saved, draft)) {
                return new FinanceViews.Saved<>(saved, false);
            }
            throw conflict("CREATE_ID_CONFLICT", "This account identifier is already saved with different details");
        }
    }

    public FinanceViews.Account editChecking(UUID id, FinanceCommands.Details details) {
        return transactions.execute(status -> {
            UUID householdId = requireHousehold().id();
            validateOwners(householdId, details.ownerIds());
            repository.editAccount(householdId, id, details);
            return account(id);
        });
    }

    public FinanceViews.Account account(UUID id) {
        return reads.execute(status -> repository.account(id).orElseThrow(() -> FinanceRepository.missing("Account")));
    }

    private FinanceViews.Household requireHousehold() {
        return reads.execute(status -> repository.household().orElseThrow(
                () -> FinanceRepository.missing("Household")));
    }

    private void validateOwners(UUID householdId, List<UUID> owners) {
        var available = repository.members(householdId).stream().map(FinanceViews.Member::id).toList();
        if (owners.isEmpty() || new HashSet<>(owners).size() != owners.size() || !available.containsAll(owners)) {
            throw FinanceException.invalid("ownerIds", "Choose valid household members");
        }
    }

    private boolean matches(FinanceViews.Account saved, FinanceCommands.CheckingDraft draft) {
        var owners = saved.owners().stream().map(FinanceViews.Member::id).toList();
        return saved.name().equals(draft.details().name()) && Objects.equals(saved.bank(), draft.details().bank())
                && new HashSet<>(owners).equals(new HashSet<>(draft.details().ownerIds()))
                && new BigDecimal(saved.balance()).compareTo(draft.money().value()) == 0
                && saved.balanceDate().equals(draft.date().toString());
    }

    private void requireUnique(DataIntegrityViolationException failure, Set<String> allowed) {
        if (!ConstraintFailures.unique(failure, allowed)) {
            throw failure;
        }
    }

    private FinanceException memberPairConflict(String label) {
        String message = label == null ? "Add a distinguishing label for this name"
                : "This name and label are already in use. Use a different label";
        return new FinanceException(409, "MEMBER_PAIR_EXISTS", message, Map.of("label", message));
    }

    private FinanceException conflict(String code, String message) {
        return new FinanceException(409, code, message, Map.of());
    }
}
