export function scenarioInventory(source, file) {
  const entries = [];
  let tags = [];
  for (const [index, line] of source.split(/\r?\n/).entries()) {
    const trimmed = line.trim();
    if (trimmed.startsWith('@'))
      tags.push(...trimmed.split(/\s+/).filter((tag) => tag.startsWith('@')));
    const match = /^\s*(Scenario Outline|Scenario):\s*(.*)$/.exec(line);
    if (!match) continue;
    entries.push({
      file,
      line: index + 1,
      name: match[2],
      kind: match[1],
      tags,
      ids: tags.filter((tag) => /^@V2_/.test(tag)),
    });
    tags = [];
  }
  return entries;
}

export function identityDiagnostics(scenarios) {
  const byId = new Map();
  for (const scenario of scenarios) {
    for (const id of scenario.ids) {
      const references = byId.get(id) ?? [];
      references.push(`${scenario.file}:${scenario.line}`);
      byId.set(id, references);
    }
  }
  return {
    uniqueIds: byId.size,
    missingIds: scenarios.filter((scenario) => !scenario.ids.length),
    multipleIds: scenarios.filter((scenario) => scenario.ids.length > 1),
    duplicates: [...byId.entries()].filter(([, references]) => references.length > 1),
  };
}
