import {Component} from '@angular/core';
import {Map} from '../../core/map';
import {CellTypes} from '../../core/cellTypes';
import {FormsModule} from '@angular/forms';
import {MapComponent} from '../../components/map/map.component';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {Dijkstra} from '../../core/algorithm/dijkstra';
import {Astar} from '../../core/algorithm/astar';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    FormsModule,
    MapComponent,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  configuration = {rows: 18, columns: 20, speed: 100, Algorithm: 'Dijkstra'};
  map = new Map(this.configuration.rows, this.configuration.columns, this.configuration.speed);
  mode = CellTypes.Block;
  protected readonly CellTypes = CellTypes;

  async find() {
    this.changeAlgorithm(this.configuration.Algorithm);
    await this.map.find();
  }

  updateMap() {
    this.map = new Map(this.configuration.rows, this.configuration.columns, this.configuration.speed);
  }

  changeMode(mode: CellTypes) {
    this.mode = mode
  }

  changeAlgorithm(algo: string) {
    this.configuration.Algorithm = algo
    switch (algo) {
      case 'Astar':
        this.map.algorithm = new Astar(this.map.row, this.map.col);
        break;
      default:
        this.map.algorithm = new Dijkstra();
    }
  }

  onSliderChange() {
    this.map.speed = this.configuration.speed
  }
}


