import {Component, HostListener, Input} from '@angular/core';
import {CellTypes} from '../../core/cellTypes';
import {Map} from '../../core/map';
import {Node} from '../../core/node';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {

  @Input({required: true}) map!: Map;
  @Input() mode: CellTypes = CellTypes.Block;

  changeMode(cell: CellTypes) {
    this.mode = cell;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    switch (event.key.toLowerCase()) {
      case 'e':
        this.changeMode(CellTypes.Empty)
        break;
      case 'b':
        this.changeMode(CellTypes.Block)
        break;
      case 's':
        this.changeMode(CellTypes.Source)
        break;
      case 't':
        this.changeMode(CellTypes.Target)
        break;
      default:
        break; // No action
    }
  }

  cellStyle(cell: CellTypes): string {
    switch (cell) {
      case CellTypes.Empty:
        return 'Empty';
      case CellTypes.Block:
        return 'Block';
      case CellTypes.Source:
        return 'Source';
      case CellTypes.Target:
        return 'Target';
      case CellTypes.Explored:
        return 'Explored';
      default:
        return 'Path';
    }
  }

  updateNode(i: number, j: number) {
    this.map.updateCell(new Node(i, j), this.mode)
  }
}
