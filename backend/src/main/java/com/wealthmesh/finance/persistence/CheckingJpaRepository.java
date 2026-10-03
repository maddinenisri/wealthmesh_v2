package com.wealthmesh.finance.persistence;

import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

public interface CheckingJpaRepository extends JpaRepository<CheckingEntity, UUID> {
    String PROJECTION = """
            select new com.wealthmesh.finance.persistence.AccountProjection(
                a.id, a.name, a.bank, a.openingAmount, a.balanceDate, m.id, m.name, m.label)
            from CheckingEntity a
            left join CheckingOwnerEntity o on o.id.accountId = a.id and o.householdId = a.householdId
            left join o.member m
            """;

    @Query(PROJECTION + "where a.householdId = :householdId order by a.createdAt, a.id, m.createdAt, m.id")
    @QueryHints(@QueryHint(name = "jakarta.persistence.query.timeout", value = "3000"))
    List<AccountProjection> listAccounts(@Param("householdId") UUID householdId);

    @Query(PROJECTION + "where a.id = :id order by m.createdAt, m.id")
    @QueryHints(@QueryHint(name = "jakarta.persistence.query.timeout", value = "3000"))
    List<AccountProjection> accountDetails(@Param("id") UUID id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from CheckingEntity a where a.id = :id and a.householdId = :householdId")
    @QueryHints({@QueryHint(name = "jakarta.persistence.query.timeout", value = "3000"),
        @QueryHint(name = "jakarta.persistence.lock.timeout", value = "3000")})
    Optional<CheckingEntity> lockAccount(@Param("id") UUID id, @Param("householdId") UUID householdId);
}
