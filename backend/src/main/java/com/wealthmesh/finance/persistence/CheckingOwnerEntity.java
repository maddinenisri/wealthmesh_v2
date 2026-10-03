package com.wealthmesh.finance.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostPersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.util.UUID;
import org.springframework.data.domain.Persistable;

@Entity
@Table(name = "checking_account_owner")
public class CheckingOwnerEntity implements Persistable<AccountOwnerKey> {
    @EmbeddedId
    private AccountOwnerKey id;
    @Column(name = "household_id", nullable = false, updatable = false)
    private UUID householdId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", insertable = false, updatable = false)
    private CheckingEntity account;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", insertable = false, updatable = false)
    private MemberEntity member;
    @Transient
    private boolean fresh = true;

    protected CheckingOwnerEntity() { }

    public CheckingOwnerEntity(UUID householdId, UUID accountId, UUID memberId) {
        this.id = new AccountOwnerKey(accountId, memberId);
        this.householdId = householdId;
    }

    @Override
    public AccountOwnerKey getId() {
        return id;
    }

    @Override
    public boolean isNew() {
        return fresh;
    }

    @PostLoad
    @PostPersist
    protected void markPersisted() {
        fresh = false;
    }
}
