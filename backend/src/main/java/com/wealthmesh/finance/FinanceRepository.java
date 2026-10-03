package com.wealthmesh.finance;

import com.wealthmesh.finance.persistence.AccountProjection;
import com.wealthmesh.finance.persistence.CheckingEntity;
import com.wealthmesh.finance.persistence.CheckingJpaRepository;
import com.wealthmesh.finance.persistence.CheckingOwnerEntity;
import com.wealthmesh.finance.persistence.HouseholdEntity;
import com.wealthmesh.finance.persistence.HouseholdJpaRepository;
import com.wealthmesh.finance.persistence.MemberEntity;
import com.wealthmesh.finance.persistence.MemberJpaRepository;
import com.wealthmesh.finance.persistence.OwnershipJpaRepository;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public class FinanceRepository {
    private final HouseholdJpaRepository households;
    private final MemberJpaRepository members;
    private final CheckingJpaRepository accounts;
    private final OwnershipJpaRepository ownership;

    public FinanceRepository(HouseholdJpaRepository households, MemberJpaRepository members,
            CheckingJpaRepository accounts, OwnershipJpaRepository ownership) {
        this.households = households;
        this.members = members;
        this.accounts = accounts;
        this.ownership = ownership;
    }

    public Optional<FinanceViews.Household> household() {
        return households.findAll().stream().findFirst()
                .map(entity -> new FinanceViews.Household(entity.getId(), entity.name()));
    }

    public List<FinanceViews.Member> members(UUID householdId) {
        return members.findByHouseholdIdOrderByCreatedAtAscIdAsc(householdId).stream()
                .map(this::memberView).toList();
    }

    public List<FinanceViews.Account> accounts(UUID householdId) {
        return reconstruct(accounts.listAccounts(householdId));
    }

    public Optional<FinanceViews.Account> account(UUID id) {
        return reconstruct(accounts.accountDetails(id)).stream().findFirst();
    }

    private List<FinanceViews.Account> reconstruct(List<AccountProjection> rows) {
        Map<UUID, AccountProjection> details = new LinkedHashMap<>();
        Map<UUID, List<FinanceViews.Member>> owners = new LinkedHashMap<>();
        for (AccountProjection row : rows) {
            if (row.memberId() == null) {
                throw new FinanceException(503, "FINANCE_INTEGRITY", "An account has incomplete ownership. "
                        + "Check the local server logs.", Map.of());
            }
            details.putIfAbsent(row.id(), row);
            owners.computeIfAbsent(row.id(), ignored -> new ArrayList<>()).add(
                    new FinanceViews.Member(row.memberId(), row.memberName(), row.memberLabel()));
        }
        return details.values().stream().map(row -> new FinanceViews.Account(row.id(), "CHECKING", row.name(),
                row.bank(), owners.get(row.id()), "USD", row.amount().toPlainString(), row.date().toString())).toList();
    }

    public void insertHousehold(FinanceCommands.HouseholdDraft draft) {
        households.saveAndFlush(new HouseholdEntity(draft.id(), draft.name()));
    }

    public void renameHousehold(UUID id, String name) {
        households.findById(id).orElseThrow(() -> missing("Household")).rename(name);
        households.flush();
    }

    public void insertMember(UUID householdId, FinanceCommands.MemberDraft draft) {
        members.saveAndFlush(new MemberEntity(draft.id(), householdId, draft.name(), draft.label()));
    }

    public void editMember(UUID householdId, FinanceCommands.MemberDraft draft) {
        var member = members.findByIdAndHouseholdId(draft.id(), householdId).orElseThrow(() -> missing("Member"));
        member.correctText(draft.name(), draft.label());
        members.flush();
    }

    public void insertAccount(UUID householdId, FinanceCommands.CheckingDraft draft) {
        accounts.saveAndFlush(new CheckingEntity(draft.id(), householdId, draft.details().name(),
                draft.details().bank(), draft.money().value(), draft.date()));
        insertOwners(householdId, draft.id(), draft.details().ownerIds());
    }

    public void editAccount(UUID householdId, UUID id, FinanceCommands.Details details) {
        var account = accounts.lockAccount(id, householdId).orElseThrow(() -> missing("Account"));
        account.changeDetails(details.name(), details.bank());
        // Flush the details, bulk-delete old links, and clear the persistence context before new links.
        ownership.deleteForAccount(id);
        insertOwners(householdId, id, details.ownerIds());
    }

    private void insertOwners(UUID householdId, UUID id, List<UUID> owners) {
        ownership.saveAllAndFlush(owners.stream()
                .map(member -> new CheckingOwnerEntity(householdId, id, member)).toList());
    }

    private FinanceViews.Member memberView(MemberEntity entity) {
        return new FinanceViews.Member(entity.getId(), entity.name(), entity.label());
    }

    public static FinanceException missing(String resource) {
        return new FinanceException(404, "NOT_FOUND", resource + " could not be found", Map.of());
    }
}
