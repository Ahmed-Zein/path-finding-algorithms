import {Action, PathFindingAlgorithm, PathFindingAlgorithmBase} from './pathfindingAlgorithm';

export class Dijkstra extends PathFindingAlgorithmBase implements PathFindingAlgorithm {
  public async find_path(graph: Array<Array<number>>, source: number, target: number, callback: Action | null): Promise<Array<number>> {
    const dst: Array<number> = Array(graph.length).fill(Number.MAX_SAFE_INTEGER);
    const precedence: Array<number> = Array(graph.length).fill(-1);
    const visited: Array<boolean> = Array(graph.length).fill(false);
    dst[source] = 0;

    for (let i = 0; i < dst.length; i++) {
      let out_node = this.find_outNode(dst, visited)
      if (out_node === -1 || out_node === target) break

      visited[out_node] = true;
      callback && await callback(visited)

      for (let j = 0; j < dst.length; j++) {
        if (graph[out_node][j] == 0 || visited[j])
          continue
        let new_cost = dst[out_node] + graph[out_node][j];
        if (new_cost < dst[j]) {
          dst[j] = new_cost;
          precedence[j] = out_node
        }
      }
    }
    return this.recover_path(precedence, target);
  }
}
