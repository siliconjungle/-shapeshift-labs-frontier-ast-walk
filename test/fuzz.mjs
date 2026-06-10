import assert from 'node:assert';
import {
  createAstRegistryGraph,
  traceImportClosure,
  walkFrontierSources
} from '../dist/index.js';

const args = parseArgs(process.argv.slice(2));
const cases = readPositiveInt(args.cases, 500);
let seed = readPositiveInt(args.seed, 0x51a7);

for (let index = 0; index < cases; index++) {
  const sourceCount = 2 + nextInt(20);
  const inputs = [];
  for (let i = 0; i < sourceCount; i++) {
    const file = i % 3 === 0
      ? `apps/web/src/components/C${i}.tsx`
      : i % 3 === 1
        ? `packages/domain/src/m${i}.ts`
        : `apps/api/src/h${i}.ts`;
    const imports = [];
    if (i > 0 && nextInt(2) === 0) imports.push(`import { x${i - 1} } from './${basename(inputs[i - 1].file).replace(/\.[^.]+$/, '')}';`);
    if (nextInt(3) === 0) imports.push("import { state } from '@shapeshift-labs/frontier-dom';");
    const logic = file.includes('/components/') && nextInt(5) === 0 ? "fetch('/api/fuzz');" : '';
    inputs.push({
      file,
      text: [
        ...imports,
        `export function ${file.includes('/components/') ? 'C' + i : 'x' + i}() {`,
        logic,
        '  return 1;',
        '}'
      ].join('\n')
    });
  }
  const graph = walkFrontierSources(inputs);
  assert.strictEqual(graph.summary.sourceCount, inputs.length);
  assert.ok(graph.summary.importCount >= 0);
  assert.ok(createAstRegistryGraph(graph).entries.length >= inputs.length);
  assert.ok(traceImportClosure(graph, [inputs[0].file]).length >= 1);
}

console.log('frontier-ast-walk fuzz ok cases=' + cases);

function basename(file) {
  return file.slice(file.lastIndexOf('/') + 1);
}

function nextInt(max) {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed % max;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--cases') out.cases = argv[++i];
    else if (argv[i] === '--seed') out.seed = argv[++i];
  }
  return out;
}

function readPositiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
