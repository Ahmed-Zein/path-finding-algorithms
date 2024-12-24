import {Action, PathFindingAlgorithm, PathFindingAlgorithmBase} from './pathfindingAlgorithm';

export class Astar extends PathFindingAlgorithmBase implements PathFindingAlgorithm {
  rows: number;
  cols: number;

  constructor(rows: number, cols: number) {
    super();
    this.rows = rows;
    this.cols = cols;
  }

  public async find_path(graph: Array<Array<number>>, source: number, target: number, callback: Action | null): Promise<Array<number>> {
    const actualDistance: Array<number> = Array(graph.length).fill(Number.MAX_SAFE_INTEGER);
    const heuristicDistance: Array<number> = Array(graph.length).fill(Number.MAX_SAFE_INTEGER);
    const precedence: Array<number> = Array(graph.length).fill(-1);
    const visited: Array<boolean> = Array(graph.length).fill(false);
    actualDistance[source] = 0;
    heuristicDistance[source] = 0;

    for (let i = 0; i < actualDistance.length; i++) {
      let out_node = this.find_outNode(heuristicDistance, visited)
      if (out_node === -1 || out_node === target) break

      visited[out_node] = true;
      callback && await callback(visited)

      for (let j = 0; j < actualDistance.length; j++) {
        if (graph[out_node][j] == 0 || visited[j])
          continue

        let new_cost = actualDistance[out_node] + graph[out_node][j]
        if (new_cost < actualDistance[j]) {
          actualDistance[j] = new_cost
          heuristicDistance[j] = new_cost + this.euclideanDistance(j, target);
          precedence[j] = out_node
        }
      }
    }
    return this.recover_path(precedence, target);
  }

  private manhattanDistance(src: number, target: number): number {
    const srcX = Math.floor(src / this.cols);
    const sryY = src % this.cols;
    const targetX = Math.floor(target / this.cols);
    const targetY = target % this.cols;
    return Math.abs(srcX - targetX) + Math.abs(sryY - targetY)
  }

  private euclideanDistance(src: number, target: number): number {
    const srcX = Math.floor(src / this.cols);
    const sryY = src % this.cols;
    const targetX = Math.floor(target / this.cols);
    const targetY = target % this.cols;
    const d = Math.pow(srcX - targetX, 2) + Math.pow(sryY - targetY, 2)
    return Math.sqrt(d);
  }
}
