package com.wealthmesh.finance.persistence;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OwnershipJpaRepository extends JpaRepository<CheckingOwnerEntity, AccountOwnerKey> {
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("delete from CheckingOwnerEntity o where o.id.accountId = :id")
    void deleteForAccount(@Param("id") UUID id);
}
