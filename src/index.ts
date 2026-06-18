export const FRONTIER_AST_WALK_KIND = 'frontier.ast-walk.source-graph';
export const FRONTIER_AST_SOURCE_KIND = 'frontier.ast-walk.source';
export const FRONTIER_AST_BUSINESS_LOGIC_KIND = 'frontier.ast-walk.business-logic';
export const FRONTIER_AST_REGISTRY_KIND = 'frontier.ast-walk.registry';

export type FrontierAstImportKind = 'static' | 'side-effect' | 'export' | 'dynamic' | 'require' | string;
export type FrontierAstExportKind = 'function' | 'class' | 'const' | 'let' | 'var' | 'type' | 'interface' | 'default' | 're-export' | string;
export type FrontierAstDeclarationKind = 'function' | 'class' | 'const' | 'let' | 'var' | 'type' | 'interface' | string;
export type FrontierAstSemanticOwnershipRegionKind = 'exported-declaration' | 're-export' | string;
export type FrontierAstSourceLayer =
  | 'frontend-route'
  | 'frontend-component'
  | 'backend-handler'
  | 'domain'
  | 'test'
  | 'config'
  | 'generated'
  | 'unknown'
  | string;
export type FrontierAstBusinessLogicRule =
  | 'effectful-call-in-adapter'
  | 'domain-symbol-outside-domain'
  | 'business-logic-in-generated-source'
  | string;
export type FrontierAstSeverity = 'error' | 'warning' | 'info' | 'hint';

export interface FrontierAstPosition {
  line: number;
  column: number;
  index: number;
}

export interface FrontierAstRange {
  start: FrontierAstPosition;
  end?: FrontierAstPosition;
}

export interface FrontierAstImportRecord {
  id: string;
  specifier: string;
  kind: FrontierAstImportKind;
  typeOnly: boolean;
  localNames: string[];
  importedNames: string[];
  range: FrontierAstRange;
}

export interface FrontierAstExportRecord {
  id: string;
  name: string;
  localName?: string;
  kind: FrontierAstExportKind;
  source?: string;
  range: FrontierAstRange;
}

export interface FrontierAstDeclarationRecord {
  id: string;
  name: string;
  kind: FrontierAstDeclarationKind;
  exported: boolean;
  async: boolean;
  range: FrontierAstRange;
}

export interface FrontierAstSemanticOwnershipRegionRecord {
  id: string;
  file: string;
  kind: FrontierAstSemanticOwnershipRegionKind;
  name: string;
  stableKey: string;
  owner?: string;
  exportKind?: FrontierAstExportKind;
  declarationKind?: FrontierAstDeclarationKind;
  source?: string;
  exportId?: string;
  declarationId?: string;
  range: FrontierAstRange;
  tags: string[];
}

export interface FrontierAstCallRecord {
  id: string;
  name: string;
  root: string;
  receiver?: string;
  kind: 'call' | 'new';
  range: FrontierAstRange;
}

export interface FrontierAstBusinessLogicFinding {
  kind: typeof FRONTIER_AST_BUSINESS_LOGIC_KIND;
  id: string;
  file: string;
  layer: FrontierAstSourceLayer;
  rule: FrontierAstBusinessLogicRule;
  severity: FrontierAstSeverity;
  symbol?: string;
  range?: FrontierAstRange;
  message: string;
  tags: string[];
}

export interface FrontierAstSourceInput {
  id?: string;
  file: string;
  text: string;
  package?: string;
  feature?: string;
  owner?: string;
  layer?: FrontierAstSourceLayer;
  tags?: readonly string[];
  metadata?: unknown;
}

export interface FrontierAstWalkOptions {
  rootDir?: string;
  frontendRouteRoots?: readonly string[];
  frontendComponentRoots?: readonly string[];
  backendHandlerRoots?: readonly string[];
  domainRoots?: readonly string[];
  generatedRoots?: readonly string[];
  testPatterns?: readonly string[];
  configPatterns?: readonly string[];
  adapterLayers?: readonly FrontierAstSourceLayer[];
  forbiddenAdapterCalls?: readonly string[];
  allowedAdapterDeclarations?: readonly string[];
  businessLogicSeverity?: FrontierAstSeverity;
}

export interface FrontierAstSourceRecord {
  kind: typeof FRONTIER_AST_SOURCE_KIND;
  id: string;
  file: string;
  package?: string;
  feature?: string;
  owner?: string;
  layer: FrontierAstSourceLayer;
  lines: number;
  imports: FrontierAstImportRecord[];
  exports: FrontierAstExportRecord[];
  declarations: FrontierAstDeclarationRecord[];
  semanticOwnershipRegions: FrontierAstSemanticOwnershipRegionRecord[];
  calls: FrontierAstCallRecord[];
  frontierPackages: string[];
  localImportSpecifiers: string[];
  businessLogic: FrontierAstBusinessLogicFinding[];
  tags: string[];
  metadata?: unknown;
}

export interface FrontierAstImportEdge {
  from: string;
  to: string;
  specifier: string;
  kind: FrontierAstImportKind;
}

export interface FrontierAstSourceGraph {
  kind: typeof FRONTIER_AST_WALK_KIND;
  version: 1;
  generatedAt: number;
  sources: FrontierAstSourceRecord[];
  edges: FrontierAstImportEdge[];
  summary: {
    sourceCount: number;
    importCount: number;
    exportCount: number;
    declarationCount: number;
    semanticOwnershipRegionCount: number;
    callCount: number;
    frontierPackageCount: number;
    businessLogicFindingCount: number;
  };
}

export interface FrontierAstRegistryGraph {
  kind: typeof FRONTIER_AST_REGISTRY_KIND;
  entries: Array<{
    id: string;
    kind: string;
    source?: string;
    package?: string;
    feature?: string;
    owner?: string;
    tags?: string[];
    metadata?: unknown;
  }>;
  edges: Array<{
    from: string;
    to: string;
    kind: string;
    metadata?: unknown;
  }>;
}

export interface FrontierAstLintResource {
  id: string;
  kind: string;
  package?: string;
  feature?: string;
  owner?: string;
  files: string[];
  imports: string[];
  effects: string[];
  tags: string[];
  metadata?: unknown;
}

const DEFAULT_FRONTEND_ROUTE_ROOTS = ['apps/web/src/routes', 'app', 'src/routes'];
const DEFAULT_FRONTEND_COMPONENT_ROOTS = ['apps/web/src/components', 'src/components', 'components'];
const DEFAULT_BACKEND_HANDLER_ROOTS = ['apps/api/src', 'server', 'api'];
const DEFAULT_DOMAIN_ROOTS = ['packages/domain/src', 'packages/contracts/src/domain', 'packages/contracts/src', 'src/domain', 'domain'];
const DEFAULT_GENERATED_ROOTS = ['generated', 'dist', '.frontier-framework', '.frontier'];
const DEFAULT_TEST_PATTERNS = ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', 'test/**', 'tests/**'];
const DEFAULT_CONFIG_PATTERNS = ['frontier.config.*', 'vite.config.*', 'tsconfig.json', 'package.json'];
const DEFAULT_ADAPTER_LAYERS = ['frontend-route', 'frontend-component', 'backend-handler'];
const DEFAULT_FORBIDDEN_ADAPTER_CALLS = [
  'fetch',
  'WebSocket',
  'EventSource',
  'BroadcastChannel',
  'Worker',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'caches',
  'navigator.clipboard',
  'setTimeout',
  'setInterval',
  'Date.now',
  'Math.random'
];
const DEFAULT_ALLOWED_ADAPTER_DECLARATIONS = [
  'Page',
  'Layout',
  'Route',
  'Component',
  'default',
  'handleFrontierRequest',
  'loader',
  'action',
  'headers',
  'meta',
  'links'
];

export function walkFrontierSource(input: FrontierAstSourceInput, options: FrontierAstWalkOptions = {}): FrontierAstSourceRecord {
  const file = normalizePath(input.file);
  const text = input.text ?? '';
  const stripped = stripTriviaAndLiterals(text);
  const imports = extractImports(text, stripped, file);
  const exports = extractExports(text, stripped, file);
  const declarations = extractDeclarations(stripped, file, exports);
  const semanticOwnershipRegions = extractSemanticOwnershipRegions(text, stripped, file, exports, declarations, input.owner);
  const calls = extractCalls(stripped, file);
  const layer = input.layer ?? classifySourceLayer(file, options);
  const frontierPackages = unique(imports.map((item) => frontierPackageName(item.specifier)).filter(isString));
  const localImportSpecifiers = unique(imports.map((item) => item.specifier).filter((specifier) => isLocalSpecifier(specifier)));
  const source: FrontierAstSourceRecord = {
    kind: FRONTIER_AST_SOURCE_KIND,
    id: input.id ?? 'source:' + file,
    file,
    package: input.package,
    feature: input.feature,
    owner: input.owner,
    layer,
    lines: countLines(text),
    imports,
    exports,
    declarations,
    semanticOwnershipRegions,
    calls,
    frontierPackages,
    localImportSpecifiers,
    businessLogic: [],
    tags: unique([layer, ...(input.tags ?? [])]),
    metadata: input.metadata
  };
  source.businessLogic = analyzeBusinessLogic(source, options);
  return source;
}

export function walkFrontierSources(inputs: readonly (FrontierAstSourceInput | FrontierAstSourceRecord)[], options: FrontierAstWalkOptions = {}): FrontierAstSourceGraph {
  const sources = inputs.map((input) => isSourceRecord(input) ? input : walkFrontierSource(input, options));
  const byFile = new Map(sources.map((source) => [source.file, source]));
  const edges: FrontierAstImportEdge[] = [];
  for (const source of sources) {
    for (const imported of source.imports) {
      const target = resolveImportTarget(source.file, imported.specifier, byFile);
      edges.push({
        from: source.id,
        to: target?.id ?? imported.specifier,
        specifier: imported.specifier,
        kind: imported.kind
      });
    }
  }
  const frontierPackages = new Set<string>();
  for (const source of sources) for (const pkg of source.frontierPackages) frontierPackages.add(pkg);
  return {
    kind: FRONTIER_AST_WALK_KIND,
    version: 1,
    generatedAt: Date.now(),
    sources,
    edges,
    summary: {
      sourceCount: sources.length,
      importCount: sources.reduce((sum, source) => sum + source.imports.length, 0),
      exportCount: sources.reduce((sum, source) => sum + source.exports.length, 0),
      declarationCount: sources.reduce((sum, source) => sum + source.declarations.length, 0),
      semanticOwnershipRegionCount: sources.reduce((sum, source) => sum + (source.semanticOwnershipRegions ?? []).length, 0),
      callCount: sources.reduce((sum, source) => sum + source.calls.length, 0),
      frontierPackageCount: frontierPackages.size,
      businessLogicFindingCount: sources.reduce((sum, source) => sum + source.businessLogic.length, 0)
    }
  };
}

export function classifySourceLayer(file: string, options: FrontierAstWalkOptions = {}): FrontierAstSourceLayer {
  const normalized = normalizePath(file);
  if (matchesAnyPath(normalized, options.configPatterns ?? DEFAULT_CONFIG_PATTERNS)) return 'config';
  if (matchesAnyPath(normalized, options.testPatterns ?? DEFAULT_TEST_PATTERNS)) return 'test';
  if (pathStartsWithAny(normalized, options.generatedRoots ?? DEFAULT_GENERATED_ROOTS)) return 'generated';
  if (pathStartsWithAny(normalized, options.frontendRouteRoots ?? DEFAULT_FRONTEND_ROUTE_ROOTS)) return 'frontend-route';
  if (pathStartsWithAny(normalized, options.frontendComponentRoots ?? DEFAULT_FRONTEND_COMPONENT_ROOTS)) return 'frontend-component';
  if (pathStartsWithAny(normalized, options.backendHandlerRoots ?? DEFAULT_BACKEND_HANDLER_ROOTS)) return 'backend-handler';
  if (pathStartsWithAny(normalized, options.domainRoots ?? DEFAULT_DOMAIN_ROOTS)) return 'domain';
  return 'unknown';
}

export function analyzeBusinessLogic(source: FrontierAstSourceRecord, options: FrontierAstWalkOptions = {}): FrontierAstBusinessLogicFinding[] {
  const findings: FrontierAstBusinessLogicFinding[] = [];
  const adapterLayers = new Set(options.adapterLayers ?? DEFAULT_ADAPTER_LAYERS);
  const forbiddenCalls = options.forbiddenAdapterCalls ?? DEFAULT_FORBIDDEN_ADAPTER_CALLS;
  const allowedDeclarations = new Set(options.allowedAdapterDeclarations ?? DEFAULT_ALLOWED_ADAPTER_DECLARATIONS);
  const severity = options.businessLogicSeverity ?? 'error';
  if (adapterLayers.has(source.layer)) {
    for (const call of source.calls) {
      if (!forbiddenCalls.some((name) => callMatches(call, name))) continue;
      findings.push({
        kind: FRONTIER_AST_BUSINESS_LOGIC_KIND,
        id: source.id + ':effectful-call:' + call.name + ':' + call.range.start.index,
        file: source.file,
        layer: source.layer,
        rule: 'effectful-call-in-adapter',
        severity,
        symbol: call.name,
        range: call.range,
        message: source.file + ' calls ' + call.name + ' inside a ' + source.layer + ' adapter. Move business logic into a domain module, Frontier action, effect, tool, worker, or workflow surface.',
        tags: ['business-logic', 'adapter', source.layer]
      });
    }
    for (const declaration of source.declarations) {
      if (!declaration.exported) continue;
      if (allowedDeclarations.has(declaration.name) || isComponentName(declaration.name)) continue;
      findings.push({
        kind: FRONTIER_AST_BUSINESS_LOGIC_KIND,
        id: source.id + ':domain-symbol:' + declaration.name,
        file: source.file,
        layer: source.layer,
        rule: 'domain-symbol-outside-domain',
        severity,
        symbol: declaration.name,
        range: declaration.range,
        message: source.file + ' exports "' + declaration.name + '" from a ' + source.layer + ' adapter. Export domain logic from a domain package instead.',
        tags: ['business-logic', 'adapter', source.layer]
      });
    }
  }
  if (source.layer === 'generated' && source.declarations.some((item) => item.exported)) {
    findings.push({
      kind: FRONTIER_AST_BUSINESS_LOGIC_KIND,
      id: source.id + ':generated-business-logic',
      file: source.file,
      layer: source.layer,
      rule: 'business-logic-in-generated-source',
      severity: 'warning',
      message: source.file + ' exports symbols from generated source. Prefer generated adapters that point back to authored domain modules.',
      tags: ['business-logic', 'generated']
    });
  }
  return findings;
}

export function createAstRegistryGraph(graph: FrontierAstSourceGraph): FrontierAstRegistryGraph {
  const entries: FrontierAstRegistryGraph['entries'] = [];
  for (const source of graph.sources) {
    entries.push({
      id: source.id,
      kind: 'source',
      source: source.file,
      package: source.package,
      feature: source.feature,
      owner: source.owner,
      tags: source.tags,
      metadata: { layer: source.layer, lines: source.lines }
    });
    for (const declaration of source.declarations) {
      entries.push({
        id: source.id + '#declaration:' + declaration.name,
        kind: 'declaration',
        source: source.file,
        package: source.package,
        feature: source.feature,
        owner: source.owner,
        tags: ['declaration', declaration.kind, declaration.exported ? 'exported' : 'local'],
        metadata: declaration
      });
    }
    for (const region of source.semanticOwnershipRegions ?? []) {
      entries.push({
        id: region.id,
        kind: 'semantic-ownership-region',
        source: source.file,
        package: source.package,
        feature: source.feature,
        owner: region.owner ?? source.owner,
        tags: region.tags,
        metadata: region
      });
    }
    for (const finding of source.businessLogic) {
      entries.push({
        id: finding.id,
        kind: 'business-logic-finding',
        source: finding.file,
        feature: source.feature,
        owner: source.owner,
        tags: finding.tags,
        metadata: finding
      });
    }
  }
  return {
    kind: FRONTIER_AST_REGISTRY_KIND,
    entries,
    edges: graph.edges.map((edge) => ({
      from: edge.from,
      to: edge.to,
      kind: 'imports',
      metadata: { specifier: edge.specifier, importKind: edge.kind }
    }))
  };
}

export function createAstLintResources(graph: FrontierAstSourceGraph): FrontierAstLintResource[] {
  return graph.sources.map((source) => ({
    id: source.id,
    kind: 'source',
    package: source.package,
    feature: source.feature,
    owner: source.owner,
    files: [source.file],
    imports: source.imports.map((item) => item.specifier),
    effects: source.businessLogic.map((finding) => finding.rule + ':' + (finding.symbol ?? 'source')),
    tags: unique(['source', source.layer, ...source.tags, ...source.businessLogic.flatMap((finding) => finding.tags)]),
    metadata: {
      layer: source.layer,
      declarations: source.declarations.map((item) => item.name),
      semanticOwnershipRegions: source.semanticOwnershipRegions ?? [],
      calls: source.calls.map((item) => item.name),
      businessLogic: source.businessLogic
    }
  }));
}

export function traceImportClosure(graph: FrontierAstSourceGraph, sourceIdsOrFiles: readonly string[]): string[] {
  const seeds = new Set(sourceIdsOrFiles);
  const byId = new Map(graph.sources.map((source) => [source.id, source]));
  const byFile = new Map(graph.sources.map((source) => [source.file, source]));
  const visited = new Set<string>();
  const queue: string[] = [];
  for (const seed of seeds) {
    const source = byId.get(seed) ?? byFile.get(normalizePath(seed));
    if (source) queue.push(source.id);
  }
  while (queue.length > 0) {
    const current = queue.shift() as string;
    if (visited.has(current)) continue;
    visited.add(current);
    for (const edge of graph.edges) {
      if (edge.from === current && byId.has(edge.to) && !visited.has(edge.to)) queue.push(edge.to);
    }
  }
  return Array.from(visited);
}

function extractImports(text: string, stripped: string, file: string): FrontierAstImportRecord[] {
  const imports: FrontierAstImportRecord[] = [];
  const add = (specifier: string, kind: FrontierAstImportKind, index: number, raw: string, typeOnly = false, names: { localNames?: string[]; importedNames?: string[] } = {}) => {
    imports.push({
      id: file + ':import:' + imports.length,
      specifier,
      kind,
      typeOnly,
      localNames: unique(names.localNames ?? []),
      importedNames: unique(names.importedNames ?? []),
      range: rangeAt(text, index, raw.length)
    });
  };
  collectMatches(text, /\bimport\s+(type\s+)?(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g, (match) => {
    const raw = match[0];
    const specifier = match[2];
    const typeOnly = Boolean(match[1]) || /\bimport\s+type\b/.test(raw);
    const sideEffect = /^import\s+['"]/.test(raw.trim());
    add(specifier, sideEffect ? 'side-effect' : 'static', match.index, raw, typeOnly, importNames(raw));
  });
  collectMatches(text, /\bexport\s+(?:type\s+)?(?:\*\s+(?:as\s+[A-Za-z_$][\w$]*\s+)?from|\{[\s\S]*?\}\s+from)\s+['"]([^'"]+)['"]/g, (match) => {
    add(match[1], 'export', match.index, match[0], /\bexport\s+type\b/.test(match[0]), importNames(match[0]));
  });
  collectMatches(stripped, /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g, (match) => add(match[1], 'dynamic', match.index, match[0]));
  collectMatches(stripped, /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g, (match) => add(match[1], 'require', match.index, match[0]));
  return imports;
}

function extractExports(text: string, stripped: string, file: string): FrontierAstExportRecord[] {
  const exports: FrontierAstExportRecord[] = [];
  const add = (name: string, kind: FrontierAstExportKind, index: number, raw: string, source?: string, localName?: string) => {
    exports.push({ id: file + ':export:' + exports.length, name, localName, kind, source, range: rangeAt(text, index, raw.length) });
  };
  collectMatches(stripped, /\bexport\s+default\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)?/g, (match) => add(match[1] ?? 'default', 'default', match.index, match[0]));
  collectMatches(stripped, /\bexport\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g, (match) => add(match[1], 'function', match.index, match[0]));
  collectMatches(stripped, /\bexport\s+class\s+([A-Za-z_$][\w$]*)/g, (match) => add(match[1], 'class', match.index, match[0]));
  collectMatches(stripped, /\bexport\s+(const|let|var)\s+([A-Za-z_$][\w$]*)/g, (match) => add(match[2], match[1], match.index, match[0]));
  collectMatches(stripped, /\bexport\s+(type|interface)\s+([A-Za-z_$][\w$]*)/g, (match) => add(match[2], match[1], match.index, match[0]));
  collectMatches(text, /\bexport\s+\*\s+as\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"]/g, (match) => add(match[1], 're-export', match.index, match[0], match[2], '*'));
  collectMatches(text, /\bexport\s+\*\s+from\s+['"]([^'"]+)['"]/g, (match) => add('*', 're-export', match.index, match[0], match[1], '*'));
  collectMatches(text, /\bexport\s+(?:type\s+)?\{([^}]+)\}(?:\s+from\s+['"]([^'"]+)['"])?/g, (match) => {
    for (const specifier of splitExportSpecifiers(match[1])) add(specifier.exportedName, match[2] ? 're-export' : 'default', match.index, match[0], match[2], specifier.localName);
  });
  return exports;
}

function extractDeclarations(stripped: string, file: string, exports: readonly FrontierAstExportRecord[]): FrontierAstDeclarationRecord[] {
  const declarations: FrontierAstDeclarationRecord[] = [];
  const exported = new Set(exports.filter((item) => !item.source).flatMap((item) => [item.name, item.localName].filter(isString)));
  const add = (name: string, kind: FrontierAstDeclarationKind, index: number, raw: string, async = false, explicitExport = false) => {
    declarations.push({
      id: file + ':declaration:' + declarations.length,
      name,
      kind,
      exported: explicitExport || exported.has(name),
      async,
      range: rangeAt(stripped, index, raw.length)
    });
  };
  collectMatches(stripped, /\b(export\s+)?(async\s+)?function\s+([A-Za-z_$][\w$]*)/g, (match) => add(match[3], 'function', match.index, match[0], Boolean(match[2]), Boolean(match[1])));
  collectMatches(stripped, /\b(export\s+)?class\s+([A-Za-z_$][\w$]*)/g, (match) => add(match[2], 'class', match.index, match[0], false, Boolean(match[1])));
  collectMatches(stripped, /\b(export\s+)?(const|let|var)\s+([A-Za-z_$][\w$]*)/g, (match) => add(match[3], match[2], match.index, match[0], false, Boolean(match[1])));
  collectMatches(stripped, /\b(export\s+)?(type|interface)\s+([A-Za-z_$][\w$]*)/g, (match) => add(match[3], match[2], match.index, match[0], false, Boolean(match[1])));
  return uniqueBy(declarations, (item) => item.kind + ':' + item.name + ':' + item.range.start.index);
}

function extractSemanticOwnershipRegions(
  text: string,
  stripped: string,
  file: string,
  exports: readonly FrontierAstExportRecord[],
  declarations: readonly FrontierAstDeclarationRecord[],
  owner?: string
): FrontierAstSemanticOwnershipRegionRecord[] {
  const regions: FrontierAstSemanticOwnershipRegionRecord[] = [];
  for (const declaration of declarations) {
    if (!declaration.exported) continue;
    const exportRecord = findLocalExportForDeclaration(exports, declaration);
    const exportName = exportRecord?.name ?? declaration.name;
    const stableKey = semanticOwnershipStableKey('exported-declaration', declaration.kind, declaration.name, exportName);
    regions.push({
      id: semanticOwnershipRegionId(file, stableKey),
      file,
      kind: 'exported-declaration',
      name: declaration.name,
      stableKey,
      owner,
      exportKind: exportRecord?.kind,
      declarationKind: declaration.kind,
      exportId: exportRecord?.id,
      declarationId: declaration.id,
      range: declarationRegionRange(text, stripped, declaration.range),
      tags: unique(['semantic-ownership-region', 'exported-declaration', declaration.kind, exportName === declaration.name ? 'named-export' : 'aliased-export'])
    });
  }
  for (const exportRecord of exports) {
    if (exportRecord.kind !== 're-export') continue;
    const stableKey = semanticOwnershipStableKey('re-export', exportRecord.source ?? 'unknown-source', exportRecord.name);
    regions.push({
      id: semanticOwnershipRegionId(file, stableKey),
      file,
      kind: 're-export',
      name: exportRecord.name,
      stableKey,
      owner,
      exportKind: exportRecord.kind,
      source: exportRecord.source,
      exportId: exportRecord.id,
      range: exportRecord.range,
      tags: unique(['semantic-ownership-region', 're-export', exportRecord.name === '*' ? 'star-export' : 'named-export'])
    });
  }
  return uniqueBy(regions, (item) => item.id);
}

function extractCalls(stripped: string, file: string): FrontierAstCallRecord[] {
  const calls: FrontierAstCallRecord[] = [];
  const add = (name: string, kind: 'call' | 'new', index: number, raw: string) => {
    if (['if', 'for', 'while', 'switch', 'catch', 'function', 'return', 'typeof'].includes(name)) return;
    const parts = name.split('.');
    calls.push({
      id: file + ':call:' + calls.length,
      name,
      root: parts[0],
      receiver: parts.length > 1 ? parts.slice(0, -1).join('.') : undefined,
      kind,
      range: rangeAt(stripped, index, raw.length)
    });
  };
  collectMatches(stripped, /\bnew\s+([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(/g, (match) => add(match[1], 'new', match.index, match[0]));
  collectMatches(stripped, /(?<![\w$])([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(/g, (match) => add(match[1], 'call', match.index, match[0]));
  return uniqueBy(calls, (item) => item.kind + ':' + item.name + ':' + item.range.start.index);
}

function stripTriviaAndLiterals(text: string): string {
  let out = '';
  let index = 0;
  while (index < text.length) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '/' && next === '/') {
      const end = text.indexOf('\n', index + 2);
      const stop = end === -1 ? text.length : end;
      out += ' '.repeat(stop - index);
      index = stop;
    } else if (char === '/' && next === '*') {
      const end = text.indexOf('*/', index + 2);
      const stop = end === -1 ? text.length : end + 2;
      out += preserveNewlinesAsSpaces(text.slice(index, stop));
      index = stop;
    } else if (char === '"' || char === "'" || char === '`') {
      const stop = readStringEnd(text, index, char);
      out += preserveNewlinesAsSpaces(text.slice(index, stop));
      index = stop;
    } else {
      out += char;
      index++;
    }
  }
  return out;
}

function readStringEnd(text: string, start: number, quote: string): number {
  let index = start + 1;
  while (index < text.length) {
    const char = text[index];
    if (char === '\\') {
      index += 2;
      continue;
    }
    if (char === quote) return index + 1;
    index++;
  }
  return text.length;
}

function preserveNewlinesAsSpaces(value: string): string {
  return value.replace(/[^\n\r]/g, ' ');
}

function importNames(raw: string): { localNames: string[]; importedNames: string[] } {
  const importedNames: string[] = [];
  const localNames: string[] = [];
  const braces = raw.match(/\{([\s\S]*?)\}/);
  if (braces) {
    for (const item of splitNames(braces[1])) {
      const parts = item.split(/\s+as\s+/);
      importedNames.push(parts[0].trim());
      localNames.push((parts[1] ?? parts[0]).trim());
    }
  }
  const defaultImport = raw.match(/\bimport\s+(?:type\s+)?([A-Za-z_$][\w$]*)\s*(?:,|\s+from)/);
  if (defaultImport) localNames.push(defaultImport[1]);
  return { localNames: unique(localNames.filter(Boolean)), importedNames: unique(importedNames.filter(Boolean)) };
}

function splitNames(value: string): string[] {
  return value.split(',').map((part) => part.trim()).filter(Boolean).map((part) => {
    const alias = part.match(/\s+as\s+([A-Za-z_$][\w$]*)$/);
    return alias ? alias[1] : part.replace(/^type\s+/, '').trim();
  });
}

function splitExportSpecifiers(value: string): Array<{ localName: string; exportedName: string }> {
  return value.split(',').map((part) => part.trim()).filter(Boolean).map((part) => {
    const withoutType = part.replace(/^type\s+/, '').trim();
    const alias = withoutType.match(/^(.+?)\s+as\s+([A-Za-z_$][\w$]*)$/);
    const localName = alias ? alias[1].trim() : withoutType;
    return {
      localName,
      exportedName: alias ? alias[2] : localName
    };
  });
}

function findLocalExportForDeclaration(exports: readonly FrontierAstExportRecord[], declaration: FrontierAstDeclarationRecord): FrontierAstExportRecord | undefined {
  return exports.find((item) => !item.source && (item.name === declaration.name || item.localName === declaration.name));
}

function semanticOwnershipStableKey(kind: string, ...parts: string[]): string {
  return [kind, ...parts].map(stableIdPart).join(':');
}

function semanticOwnershipRegionId(file: string, stableKey: string): string {
  return file + '#semanticOwnershipRegion:' + stableKey;
}

function stableIdPart(value: string): string {
  const normalized = value.trim().replace(/\s+/g, '_').replace(/[^A-Za-z0-9_.@/$*-]+/g, '_').replace(/^_+|_+$/g, '');
  if (normalized === '*') return 'star';
  return normalized.length > 0 ? normalized : 'anonymous';
}

function resolveImportTarget(sourceFile: string, specifier: string, byFile: Map<string, FrontierAstSourceRecord>): FrontierAstSourceRecord | undefined {
  if (!isLocalSpecifier(specifier)) return undefined;
  const base = normalizePath(dirname(sourceFile) + '/' + specifier);
  const candidates = [
    base,
    base + '.ts',
    base + '.tsx',
    base + '.js',
    base + '.jsx',
    base + '.mjs',
    base + '.mts',
    base + '/index.ts',
    base + '/index.tsx',
    base + '/index.js',
    base + '/index.jsx'
  ].map(normalizePath);
  for (const candidate of candidates) {
    const found = byFile.get(candidate);
    if (found) return found;
  }
  return undefined;
}

function callMatches(call: FrontierAstCallRecord, name: string): boolean {
  return call.name === name || call.root === name || call.name.startsWith(name + '.') || name.startsWith(call.name + '.');
}

function frontierPackageName(specifier: string): string | undefined {
  if (!specifier.startsWith('@shapeshift-labs/frontier')) return undefined;
  const parts = specifier.split('/');
  return parts.length >= 2 ? parts.slice(0, 2).join('/') : specifier;
}

function isComponentName(name: string): boolean {
  return /^[A-Z][A-Za-z0-9_]*$/.test(name);
}

function isLocalSpecifier(specifier: string): boolean {
  return specifier.startsWith('./') || specifier.startsWith('../') || specifier.startsWith('/');
}

function pathStartsWithAny(file: string, roots: readonly string[]): boolean {
  return roots.some((root) => {
    const normalized = normalizePath(root).replace(/\/+$/, '');
    return file === normalized || file.startsWith(normalized + '/');
  });
}

function matchesAnyPath(file: string, patterns: readonly string[]): boolean {
  return patterns.some((pattern) => matchesGlob(file, pattern));
}

function matchesGlob(value: string, pattern: string): boolean {
  const normalizedValue = normalizePath(value);
  const normalizedPattern = normalizePath(pattern);
  if (normalizedPattern === normalizedValue) return true;
  if (!/[*?]/.test(normalizedPattern)) return normalizedValue === normalizedPattern || normalizedValue.endsWith('/' + normalizedPattern);
  let source = '^';
  for (let index = 0; index < normalizedPattern.length; index++) {
    const char = normalizedPattern[index];
    if (char === '*' && normalizedPattern[index + 1] === '*') {
      if (normalizedPattern[index + 2] === '/') {
        source += '(?:.*/)?';
        index += 2;
      } else {
        source += '.*';
        index++;
      }
    } else if (char === '*') {
      source += '[^/]*';
    } else if (char === '?') {
      source += '[^/]';
    } else {
      source += escapeRegExp(char);
    }
  }
  return new RegExp(source + '$').test(normalizedValue);
}

function collectMatches(text: string, expression: RegExp, visit: (match: RegExpExecArray) => void): void {
  expression.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = expression.exec(text)) !== null) visit(match);
}

function rangeAt(text: string, index: number, length: number): FrontierAstRange {
  return {
    start: positionAt(text, index),
    end: positionAt(text, index + length)
  };
}

function declarationRegionRange(text: string, stripped: string, range: FrontierAstRange): FrontierAstRange {
  const start = range.start.index;
  const minimumEnd = range.end?.index ?? start;
  const end = readDeclarationRegionEnd(stripped, start, minimumEnd);
  return rangeAt(text, start, Math.max(minimumEnd, end) - start);
}

function readDeclarationRegionEnd(stripped: string, start: number, minimumEnd: number): number {
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;
  let sawBrace = false;
  for (let index = start; index < stripped.length; index++) {
    const char = stripped[index];
    if (char === '(') parenDepth++;
    else if (char === ')') parenDepth = Math.max(0, parenDepth - 1);
    else if (char === '[') bracketDepth++;
    else if (char === ']') bracketDepth = Math.max(0, bracketDepth - 1);
    else if (char === '{') {
      sawBrace = true;
      braceDepth++;
    } else if (char === '}') {
      braceDepth = Math.max(0, braceDepth - 1);
      if (sawBrace && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0 && index + 1 >= minimumEnd) return readTrailingSemicolon(stripped, index + 1);
    } else if (char === ';' && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0 && index + 1 >= minimumEnd) {
      return index + 1;
    } else if ((char === '\n' || char === '\r') && !sawBrace && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0 && index >= minimumEnd) {
      return index;
    }
  }
  return Math.max(minimumEnd, stripped.length);
}

function readTrailingSemicolon(stripped: string, start: number): number {
  let index = start;
  while (index < stripped.length && /[ \t]/.test(stripped[index])) index++;
  return stripped[index] === ';' ? index + 1 : start;
}

function positionAt(text: string, index: number): FrontierAstPosition {
  let line = 1;
  let column = 1;
  const stop = Math.min(index, text.length);
  for (let i = 0; i < stop; i++) {
    if (text[i] === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column, index };
}

function countLines(source: string): number {
  if (source.length === 0) return 0;
  return source.replace(/\n$/, '').split(/\r\n|\r|\n/).length;
}

function dirname(file: string): string {
  const normalized = normalizePath(file);
  const index = normalized.lastIndexOf('/');
  return index === -1 ? '.' : normalized.slice(0, index);
}

function normalizePath(value: string): string {
  const normalized = value.replace(/\\/g, '/').replace(/\/+/g, '/');
  const parts: string[] = [];
  for (const part of normalized.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') parts.pop();
    else parts.push(part);
  }
  return (normalized.startsWith('/') ? '/' : '') + parts.join('/');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function unique<T extends string>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

function uniqueBy<T>(values: readonly T[], key: (value: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const value of values) {
    const id = key(value);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(value);
  }
  return out;
}

function isString(value: string | undefined): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isSourceRecord(value: FrontierAstSourceInput | FrontierAstSourceRecord): value is FrontierAstSourceRecord {
  return (value as FrontierAstSourceRecord).kind === FRONTIER_AST_SOURCE_KIND;
}
