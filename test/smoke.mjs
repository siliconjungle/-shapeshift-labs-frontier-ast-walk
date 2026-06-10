import assert from 'node:assert';
import {
  FRONTIER_AST_WALK_KIND,
  classifySourceLayer,
  createAstLintResources,
  createAstRegistryGraph,
  traceImportClosure,
  walkFrontierSource,
  walkFrontierSources
} from '../dist/index.js';

const route = walkFrontierSource({
  file: 'apps/web/src/routes/index.tsx',
  text: [
    "import { tokenVar } from '@shapeshift-labs/frontier-design';",
    "import { HomeView } from '../components/HomeView';",
    '',
    'export default function Page() {',
    "  return <HomeView accent={tokenVar('color.accent')} />;",
    '}'
  ].join('\n')
});
assert.strictEqual(route.layer, 'frontend-route');
assert.ok(route.frontierPackages.includes('@shapeshift-labs/frontier-design'));
assert.strictEqual(route.businessLogic.length, 0);
assert.ok(route.imports.some((item) => item.specifier === '../components/HomeView'));
assert.ok(route.declarations.some((item) => item.name === 'Page'));

const componentWithLogic = walkFrontierSource({
  file: 'apps/web/src/components/HomeView.tsx',
  text: [
    "import { state } from '@shapeshift-labs/frontier-dom';",
    '',
    'export function HomeView() {',
    "  fetch('/api/todos');",
    '  return <main />;',
    '}',
    '',
    'export function calculateRevenue() {',
    '  return 42;',
    '}'
  ].join('\n')
});
assert.strictEqual(componentWithLogic.layer, 'frontend-component');
assert.ok(componentWithLogic.businessLogic.some((finding) => finding.rule === 'effectful-call-in-adapter' && finding.symbol === 'fetch'));
assert.ok(componentWithLogic.businessLogic.some((finding) => finding.rule === 'domain-symbol-outside-domain' && finding.symbol === 'calculateRevenue'));

const domain = walkFrontierSource({
  file: 'packages/domain/src/todos.ts',
  text: [
    "import { createPatch } from '@shapeshift-labs/frontier';",
    '',
    'export function calculateRevenue() {',
    '  return createPatch;',
    '}'
  ].join('\n')
});
assert.strictEqual(domain.layer, 'domain');
assert.strictEqual(domain.businessLogic.length, 0);

const graph = walkFrontierSources([
  {
    file: 'apps/web/src/routes/index.tsx',
    text: "import { HomeView } from '../components/HomeView';\nexport default function Page() { return <HomeView />; }\n"
  },
  {
    file: 'apps/web/src/components/HomeView.tsx',
    text: "import { calculateRevenue } from '../../../../packages/domain/src/todos';\nexport function HomeView() { return <main>{calculateRevenue()}</main>; }\n"
  },
  {
    file: 'packages/domain/src/todos.ts',
    text: 'export function calculateRevenue() { return 42; }\n'
  }
]);
assert.strictEqual(graph.kind, FRONTIER_AST_WALK_KIND);
assert.strictEqual(graph.summary.sourceCount, 3);
assert.ok(graph.edges.some((edge) => edge.from.endsWith('routes/index.tsx') && edge.to.endsWith('components/HomeView.tsx')));
assert.ok(traceImportClosure(graph, ['apps/web/src/routes/index.tsx']).some((id) => id.endsWith('packages/domain/src/todos.ts')));

const registry = createAstRegistryGraph(graph);
assert.ok(registry.entries.some((entry) => entry.kind === 'declaration' && entry.id.includes('calculateRevenue')));
assert.ok(registry.edges.some((edge) => edge.kind === 'imports'));

const lintResources = createAstLintResources(graph);
assert.ok(lintResources.some((resource) => resource.files.includes('apps/web/src/components/HomeView.tsx') && resource.imports.length === 1));

assert.strictEqual(classifySourceLayer('frontier.config.mjs'), 'config');
assert.strictEqual(classifySourceLayer('apps/api/src/handler.ts'), 'backend-handler');
assert.strictEqual(classifySourceLayer('generated/App.js'), 'generated');

console.log('frontier-ast-walk smoke ok');
