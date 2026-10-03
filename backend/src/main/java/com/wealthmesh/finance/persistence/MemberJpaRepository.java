package com.wealthmesh.finance.persistence;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberJpaRepository extends JpaRepository<MemberEntity, UUID> {
    List<MemberEntity> findByHouseholdIdOrderByCreatedAtAscIdAsc(UUID householdId);
    Optional<MemberEntity> findByIdAndHouseholdId(UUID id, UUID householdId);
}
