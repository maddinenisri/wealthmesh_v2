package com.wealthmesh.finance.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "household")
public class HouseholdEntity extends AssignedUuidEntity {
    @Column(nullable = false)
    private boolean singleton = true;
    @Column(nullable = false, columnDefinition = "text")
    private String name;
    @Column(name = "created_at", nullable = false, updatable = false, columnDefinition = "timestamptz")
    private Instant createdAt;
    @Column(name = "updated_at", nullable = false, columnDefinition = "timestamptz")
    private Instant updatedAt;

    protected HouseholdEntity() { }

    public HouseholdEntity(UUID id, String name) {
        super(id);
        this.name = name;
        this.createdAt = Instant.now();
        this.updatedAt = createdAt;
    }

    public String name() {
        return name;
    }

    public void rename(String name) {
        this.name = name;
        this.updatedAt = Instant.now();
    }
}
