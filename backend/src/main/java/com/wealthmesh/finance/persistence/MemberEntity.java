package com.wealthmesh.finance.persistence;

import com.wealthmesh.finance.FinanceText;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "household_member")
public class MemberEntity extends AssignedUuidEntity {
    @Column(name = "household_id", nullable = false, updatable = false)
    private UUID householdId;
    @Column(nullable = false, columnDefinition = "text")
    private String name;
    @Column(columnDefinition = "text")
    private String label;
    @Column(name = "name_key", nullable = false, columnDefinition = "text")
    private String nameKey;
    @Column(name = "label_key", nullable = false, columnDefinition = "text")
    private String labelKey;
    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "timestamptz")
    private Instant createdAt;
    @Column(name = "updated_at", nullable = false, columnDefinition = "timestamptz")
    private Instant updatedAt;

    protected MemberEntity() { }

    public MemberEntity(UUID id, UUID householdId, String name, String label) {
        super(id);
        this.householdId = householdId;
        this.createdAt = Instant.now();
        correctText(name, label);
    }

    public String name() {
        return name;
    }

    public String label() {
        return label;
    }

    public void correctText(String name, String label) {
        this.name = name;
        this.label = label;
        this.nameKey = FinanceText.key(name);
        this.labelKey = FinanceText.key(label);
        this.updatedAt = Instant.now();
    }
}
