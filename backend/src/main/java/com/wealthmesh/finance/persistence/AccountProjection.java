package com.wealthmesh.finance.persistence;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record AccountProjection(UUID id, String name, String bank, BigDecimal amount, LocalDate date,
        UUID memberId, String memberName, String memberLabel) {
}
