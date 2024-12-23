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

  constructor(rows: number, cols: number, speed = 5) {
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

  clearCell(node: Node): void {
    if (this.isValidNode(node)) {
      this.map[node.r][node.c] = CellTypes.Empty;
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
    const graph = this.buildAdjacencyMatrix();
    const source = this.convert2DToIndex(this.source);
    const target = this.convert2DToIndex(this.target);
    const cb = async (visited: Array<boolean>) => {
      await this.updateVisited(visited, CellTypes.Explored)
    }
    const path = await this.algorithm.find_path(graph, source, target, cb);
    console.info('Path:', path);

    const pathNodes = path.map(i => this.convertIndexTo2D(i));
    for (const node of pathNodes) {
      this.updateCell(node, CellTypes.Path)
      await this.delay()
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

  private async updateVisited(visited: Array<boolean>, type: CellTypes): Promise<void> {
    for (let i = 0; i < visited.length; i++) {
      const node = this.convertIndexTo2D(i);
      if (visited[i] && this.type(node) !== type) {
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

