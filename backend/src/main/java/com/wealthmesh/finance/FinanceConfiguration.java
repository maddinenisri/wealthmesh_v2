package com.wealthmesh.finance;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FinanceConfiguration {
    @Bean
    public FinancialDates financialDates() {
        return new FinancialDates(Clock.systemDefaultZone());
    }
}
