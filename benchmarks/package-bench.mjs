import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import {
  createAstRegistryGraph,
  walkFrontierSources
} from '../dist/index.js';

const args = parseArgs(process.argv.slice(2));
const out = args.out;
const sources = Array.from({ length: 800 }, (_value, index) => ({
  file: index % 2 === 0 ? `apps/web/src/components/C${index}.tsx` : `packages/domain/src/m${index}.ts`,
  text: [
    index > 0 ? `import { x${index - 1} } from '../m${index - 1}';` : "import { state } from '@shapeshift-labs/frontier-dom';",
    `export function ${index % 2 === 0 ? 'C' + index : 'x' + index}() {`,
    index % 17 === 0 ? "fetch('/api/bench');" : '',
    '  return 1;',
    '}'
  ].join('\n')
}));

const rows = [];
for (let i = 0; i < 9; i++) {
  const start = performance.now();
  const graph = walkFrontierSources(sources);
  const walkMs = performance.now() - start;
  const registryStart = performance.now();
  const registry = createAstRegistryGraph(graph);
  const registryMs = performance.now() - registryStart;
  rows.push({ walkMs, registryMs, findings: graph.summary.businessLogicFindingCount, entries: registry.entries.length });
}

const report = {
  generatedAt: new Date().toISOString(),
  package: '@shapeshift-labs/frontier-ast-walk',
  sources: sources.length,
  measures: {
    walkMs: summarize(rows.map((row) => row.walkMs)),
    registryMs: summarize(rows.map((row) => row.registryMs)),
    findings: rows[rows.length - 1].findings,
    entries: rows[rows.length - 1].entries
  }
};

if (out) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify(report, null, 2));

function summarize(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    minMs: sorted[0],
    medianMs: sorted[Math.floor(sorted.length / 2)],
    maxMs: sorted[sorted.length - 1],
    p95Ms: sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)]
  };
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out') out.out = argv[++i];
  }
  return out;
}
