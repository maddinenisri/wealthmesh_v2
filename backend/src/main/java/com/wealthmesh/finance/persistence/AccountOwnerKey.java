package com.wealthmesh.finance.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Embeddable
public class AccountOwnerKey implements Serializable {
    private static final long serialVersionUID = 1L;
    @Column(name = "account_id", nullable = false, updatable = false)
    private UUID accountId;
    @Column(name = "member_id", nullable = false, updatable = false)
    private UUID memberId;

    protected AccountOwnerKey() { }

    public AccountOwnerKey(UUID accountId, UUID memberId) {
        this.accountId = accountId;
        this.memberId = memberId;
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof AccountOwnerKey key)) {
            return false;
        }
        return Objects.equals(accountId, key.accountId) && Objects.equals(memberId, key.memberId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(accountId, memberId);
    }
}
