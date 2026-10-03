import assert from 'node:assert/strict';
import { test } from 'node:test';
import { scenarioInventory, identityDiagnostics } from './requirements.mjs';

test('inventory counts outlines once, retains scenario tags and source lines', () => {
  const source =
    'Feature: Example\n\n  @V2_CHECKING_001 @edge\n  Scenario Outline: Open account\n    Examples:\n      | name |\n      | Maya |\n      | Sam |\n';
  assert.deepEqual(scenarioInventory(source, 'checking.feature'), [
    {
      file: 'checking.feature',
      line: 4,
      name: 'Open account',
      kind: 'Scenario Outline',
      tags: ['@V2_CHECKING_001', '@edge'],
      ids: ['@V2_CHECKING_001'],
    },
  ]);
});

test('missing scenario IDs remain explicit rather than disappearing from counts', () => {
  const entries = scenarioInventory(
    'Feature: Example\n  Scenario: Missing identity\n',
    'missing.feature',
  );
  assert.equal(entries.length, 1);
  assert.deepEqual(entries[0].ids, []);
});

test('duplicate identities report every source location and multiple IDs remain visible', () => {
  const scenarios = scenarioInventory(
    '@V2_ONE\nScenario: First\n@V2_ONE @V2_TWO\nScenario: Second\n',
    'example.feature',
  );
  const diagnostics = identityDiagnostics(scenarios);
  assert.equal(diagnostics.uniqueIds, 2);
  assert.deepEqual(diagnostics.duplicates, [
    ['@V2_ONE', ['example.feature:2', 'example.feature:4']],
  ]);
  assert.equal(diagnostics.multipleIds.length, 1);
});
