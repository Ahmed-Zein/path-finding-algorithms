export type Action = (visited: Array<boolean>) => Promise<void>;

export interface PathFindingAlgorithm {
  find_path(graph: Array<Array<number>>, source: number, target: number, callback: Action | null): Promise<Array<number>>;
}

export class PathFindingAlgorithmBase {

  protected find_outNode(dst: Array<number>, visited: Array<boolean>): number {
    let idx = -1, min_cost = Number.MAX_SAFE_INTEGER;
    dst.forEach((cost, i) => {
      if (!visited[i] && cost < min_cost) {
        min_cost = cost;
        idx = i;
      }
    })
    return idx;
  }

  protected recover_path(dst: Array<number>, target: number): Array<number> {
    const path: Array<number> = [];
    let current = target;
    while (current != -1) {
      path.push(current);
      current = dst[current];

    }
    return path.reverse();
  }
}
