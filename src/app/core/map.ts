import {CellTypes} from './cellTypes';
import {Node} from './node';
import {PathFindingAlgorithm} from './algorithm/pathfindingAlgorithm';
import {Dijkstra} from './algorithm/dijkstra';

export class Map {
  speed: number
  row: number;
  col: number;
  source: Node;
  target: Node;
  map: Array<Array<CellTypes>>;
  algorithm: PathFindingAlgorithm;

  constructor(rows: number, cols: number, speed = 5) {
    this.row = rows;
    this.col = cols;
    this.speed = speed
    this.map = Array.from({length: rows}, () => Array(cols).fill(CellTypes.Empty));
    this.source = new Node(0, 0)
    this.target = new Node(rows - 1, cols - 1)
    this.updateCell(this.source, CellTypes.Source)
    this.updateCell(this.target, CellTypes.Target)
    this.algorithm = new Dijkstra()
  }

  reset() {
    this.updateCell(this.source, CellTypes.Source)
    this.updateCell(this.target, CellTypes.Target)
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        if (this.map[i][j] === CellTypes.Source || this.map[i][j] === CellTypes.Target || this.map[i][j] === CellTypes.Block) continue;
        this.clearCell(new Node(i, j))
      }
    }
  }

  updateCell(node: Node, type: CellTypes): void {
    if (type === CellTypes.Source) {
      this.clearCell(this.source);
      this.source = node;
    } else if (type === CellTypes.Target) {
      this.clearCell(this.target);
      this.target = node;
    }
    this.map[node.r][node.c] = type;
  }

  async find(): Promise<Array<number> | undefined> {
    this.reset()
    const graph = this.buildAdjacencyMatrix();
    const source = this.convertNodeToIndex(this.source);
    const target = this.convertNodeToIndex(this.target);
    const cb = async (visited: Array<boolean>) => {
      await this.updateVisited(visited, CellTypes.Explored)
    }
    const path = await this.algorithm.find_path(graph, source, target, cb);
    console.info('Path:', path);

    const pathNodes = path.map(i => this.convertIndexToNode(i));
    for (const node of pathNodes) {
      this.updateCell(node, CellTypes.Path)
      await this.delay()
    }
    return path;
  }

  private delay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.speed));
  }

  private getCellType(node: Node): CellTypes {
    return this.map[node.r][node.c];
  }

  private convertNodeToIndex(node: Node): number {
    return node.r * this.col + node.c
  }

  private convertIndexToNode(i: number): Node {
    const r = Math.floor(i / this.col);
    const c = i % this.col;
    return new Node(r, c)
  }

  private clearCell(node: Node): void {
    if (this.isValidNode(node)) {
      this.map[node.r][node.c] = CellTypes.Empty;
    }
  }

  private async updateVisited(visited: Array<boolean>, type: CellTypes): Promise<void> {
    for (let i = 0; i < visited.length; i++) {
      const node = this.convertIndexToNode(i);
      if (visited[i] && this.getCellType(node) !== type) {
        this.updateCell(node, type);
        await this.delay();
      }
    }
  }

  private buildAdjacencyMatrix(): number[][] {
    const r = this.map.length;
    const c = this.map[0].length;
    const graph: number[][] = Array.from({length: r * c}, () => Array(r * c).fill(0));
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        if (this.map[i][j] === CellTypes.Block) continue;
        const curr = this.convertNodeToIndex(new Node(i, j));
        const leftNode = new Node(i, j - 1);
        const rightNode = new Node(i, j + 1);
        const upperNode = new Node(i - 1, j);
        const bottomNode = new Node(i + 1, j);
        // adding diagonals
        const d1 = new Node(i + 1, j + 1);
        const d2 = new Node(i + 1, j - 1);
        const d3 = new Node(i - 1, j + 1);
        const d4 = new Node(i - 1, j - 1);
        //
        [leftNode, rightNode, upperNode, bottomNode, d1, d2, d3, d4].forEach((node) => {
            if (this.isValidNode(node)) {
              graph[curr][this.convertNodeToIndex(node)] = 1;
            }
          }
        )
      }
    }
    return graph;
  }

  private isValidNode(node: Node): boolean {
    return (node.r >= 0) && (node.r < this.row) && (node.c >= 0) && (node.c < this.col) && (this.getCellType(node) !== CellTypes.Block);
  }
}

