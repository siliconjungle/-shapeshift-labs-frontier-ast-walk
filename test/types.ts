import {
  type FrontierAstSourceGraph,
  walkFrontierSource,
  walkFrontierSources
} from '../src/index.ts';

const source = walkFrontierSource({
  file: 'apps/web/src/components/HomeView.tsx',
  text: "import { state } from '@shapeshift-labs/frontier-dom';\nexport function HomeView() { return state; }\n"
});

const graph: FrontierAstSourceGraph = walkFrontierSources([source]);
graph.sources[0].imports.map((item) => item.specifier);
