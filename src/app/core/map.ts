import {Dijkstra, PathFindingAlgorithm} from "./algorithm/dijkstra";
import {CellTypes} from './cellTypes';
import {Node} from './node';

export class Map {
  speed: number;
  row: number;
  col: number;
  source: Node;
  target: Node;
  map: Array<Array<CellTypes>>;
  algorithm: PathFindingAlgorithm;

  constructor(rows: number, cols: number, speed = 500) {
    this.row = rows;
    this.col = cols;
    this.speed = speed
    this.map = Array.from({length: rows}, () => Array(cols).fill(CellTypes.Empty));
    this.source = new Node(0, 0)
    this.target = new Node(rows - 1, cols - 1)
    this.updateCell(this.source, CellTypes.Source)
    this.updateCell(this.target, CellTypes.Target)
    this.algorithm = new Dijkstra();
  }

  updateCell(node: Node, type: CellTypes,): void {
    if (type === CellTypes.Source) {
      if (this.source) {
        this.updateCell(this.source, CellTypes.Empty)
      }
      this.source = node;
    }
    if (type === CellTypes.Target) {
      if (this.target) {
        this.map[this.target.r][this.target.c] = CellTypes.Empty;
      }
      this.target = node
    }
    this.map[node.r][node.c] = type;
  }

  async find(): Promise<Array<number> | undefined> {
    const graph = this.buildAdjacencyMatrix();

    if (!this.source || !this.target) {
      console.error('Source or Target is not set.');
      return;
    }

    const source = this.convert2DToIndex(this.source);
    const target = this.convert2DToIndex(this.target);
    const cb = (visited: Array<boolean>) => {
      this.updateVisited(visited, CellTypes.Explored)
    }
    const path = this.algorithm.find_path(graph, source, target, cb);
    console.info('Source:', source, 'Target:', target, 'Path:', path);

    for (let i = 0; i < path.length; i++) {
      const node = this.convertIndexTo2D(path[i]);
      this.updateCell(node, CellTypes.Path);
      await this.delay();

    }
    return path;
  }

  delay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.speed));
  }

  type(node: Node): CellTypes {
    return this.map[node.r][node.c];
  }

  convert2DToIndex(node: Node): number {
    return node.r * this.col + node.c
  }

  convertIndexTo2D(i: number): Node {
    const r = Math.floor(i / this.col);
    const c = i % this.col;
    return new Node(r, c)
  }

  private updateVisited(visited: Array<boolean>, type: CellTypes): void {
    visited.forEach(async (visited, i) => {
      await this.delay()
      if (visited) {
        const node = this.convertIndexTo2D(i);
        this.updateCell(node, type)
      }
    })
  }

  private buildAdjacencyMatrix(): number[][] {
    const r = this.map.length;
    const c = this.map[0].length;
    const graph: number[][] = Array.from({length: r * c}, () => Array(r * c).fill(0));
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        if (this.map[i][j] === CellTypes.Block) continue;
        const curr = this.convert2DToIndex(new Node(i, j));
        const leftNode = new Node(i, j - 1);
        const rightNode = new Node(i, j + 1);
        const upperNode = new Node(i - 1, j);
        const bottomNode = new Node(i + 1, j);

        [leftNode, rightNode, upperNode, bottomNode].forEach((node) => {
            if (this.isValidNode(node)) {
              graph[curr][this.convert2DToIndex(node)] = 1;
            }
          }
        )
      }
    }
    return graph;
  }

  private isValidNode(node: Node): boolean {
    return (node.r >= 0) && (node.r < this.row) && (node.c >= 0) && (node.c < this.col) && (this.type(node) !== CellTypes.Block);
  }
}

