# Graph GIM

see in: [graph.ts](https://github.com/feakin/feakin/blob/master/packages/exporter/src/model/graph.ts)

```typescript
export interface Graph {
  nodes: Node[];
  edges: Edge[];
  props?: GraphProperty;
  subgraphs?: Graph[];
}

export interface Node {
  id: string;
  label: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  subgraph?: boolean;

  data?: NodeData;
  props?: ElementProperty;
}

export interface Edge {
  id: string;
  label?: string;
  points: Point[];

  width?: number;
  height?: number;

  // like beziere curve need a cp
  controlPoints?: Point[];

  data?: EdgeData;

  props?: EdgeProperty;
}
```

