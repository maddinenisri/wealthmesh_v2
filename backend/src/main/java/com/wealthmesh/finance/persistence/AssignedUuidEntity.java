package com.wealthmesh.finance.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostPersist;
import jakarta.persistence.Transient;
import java.util.UUID;
import org.springframework.data.domain.Persistable;

@MappedSuperclass
public abstract class AssignedUuidEntity implements Persistable<UUID> {
    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;
    @Transient
    private boolean fresh = true;

    protected AssignedUuidEntity() { }

    protected AssignedUuidEntity(UUID id) {
        this.id = id;
    }

    @Override
    public UUID getId() {
        return id;
    }

    @PostLoad
    @PostPersist
    protected void markPersisted() {
        fresh = false;
    }

    @Override
    public boolean isNew() {
        return fresh;
    }
}
