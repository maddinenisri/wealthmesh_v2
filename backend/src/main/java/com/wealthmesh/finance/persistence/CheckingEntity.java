package com.wealthmesh.finance.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "checking_account")
public class CheckingEntity extends AssignedUuidEntity {
    @Column(name = "household_id", nullable = false, updatable = false)
    private UUID householdId;
    @Column(nullable = false, columnDefinition = "text")
    private String name;
    @Column(columnDefinition = "text")
    private String bank;
    @Column(nullable = false, updatable = false, columnDefinition = "text")
    private String currency = "USD";
    @Column(name = "opening_amount", nullable = false, updatable = false, precision = 14, scale = 2)
    private BigDecimal openingAmount;
    @Column(name = "balance_date", nullable = false, updatable = false)
    @JdbcTypeCode(SqlTypes.LOCAL_DATE)
    private LocalDate balanceDate;
    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "timestamptz")
    private Instant createdAt;
    @Column(name = "updated_at", nullable = false, columnDefinition = "timestamptz")
    private Instant updatedAt;

    protected CheckingEntity() { }

    public CheckingEntity(UUID id, UUID householdId, String name, String bank, BigDecimal amount, LocalDate date) {
        super(id);
        this.householdId = householdId;
        this.openingAmount = amount;
        this.balanceDate = date;
        this.createdAt = Instant.now();
        changeDetails(name, bank);
    }

    public void changeDetails(String name, String bank) {
        this.name = name;
        this.bank = bank;
        this.updatedAt = Instant.now();
    }
}
