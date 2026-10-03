package com.wealthmesh.finance;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.JsonNode;

@RestController
public class FinanceController {
    private final FinanceService service;
    private final FinanceCommandReader commands;

    public FinanceController(FinanceService service, FinanceCommandReader commands) {
        this.service = service;
        this.commands = commands;
    }

    @GetMapping("/api/household")
    public FinanceViews.Overview overview() {
        return service.overview();
    }

    @PostMapping("/api/household")
    public ResponseEntity<FinanceViews.Household> createHousehold(@RequestBody JsonNode body) {
        return saved(service.createHousehold(commands.household(body, null)));
    }

    @PutMapping("/api/household")
    public FinanceViews.Household renameHousehold(@RequestBody JsonNode body) {
        return service.renameHousehold(commands.householdName(body));
    }

    @PostMapping("/api/household/members")
    public ResponseEntity<FinanceViews.Member> createMember(@RequestBody JsonNode body) {
        return saved(service.createMember(commands.member(body, null)));
    }

    @PutMapping("/api/household/members/{id}")
    public FinanceViews.Member editMember(@PathVariable String id, @RequestBody JsonNode body) {
        return service.editMember(commands.member(body, commands.uuid(id, "id")));
    }

    @PostMapping("/api/accounts/checking")
    public ResponseEntity<FinanceViews.Account> createChecking(@RequestBody JsonNode body) {
        return saved(service.createChecking(commands.checking(body)));
    }

    @GetMapping("/api/accounts/{id}")
    public FinanceViews.Account account(@PathVariable String id) {
        return service.account(commands.uuid(id, "id"));
    }

    @PutMapping("/api/accounts/{id}/details")
    public FinanceViews.Account editChecking(@PathVariable String id, @RequestBody JsonNode body) {
        return service.editChecking(commands.uuid(id, "id"), commands.details(body));
    }

    private <T> ResponseEntity<T> saved(FinanceViews.Saved<T> saved) {
        return ResponseEntity.status(saved.created() ? 201 : 200).body(saved.value());
    }
}
