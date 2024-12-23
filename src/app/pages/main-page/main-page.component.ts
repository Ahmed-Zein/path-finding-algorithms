import {Component} from '@angular/core';
import {Map} from '../../core/map';
import {CellTypes} from '../../core/cellTypes';
import {FormsModule} from '@angular/forms';
import {MapComponent} from '../../components/map/map.component';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {Dijkstra} from '../../core/algorithm/dijkstra';

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
  dimensions = {rows: 10, columns: 8, speed: 100};
  map = new Map(this.dimensions.rows, this.dimensions.columns, this.dimensions.speed);
  mode = CellTypes.Block;
  protected readonly CellTypes = CellTypes;

  async find() {
    await this.map.find();
  }

  updateMap() {
    this.map = new Map(this.dimensions.rows, this.dimensions.columns, 100);
  }

  changeMode(mode: CellTypes) {
    this.mode = mode
  }

  changeAlgorithm(number: number) {
    this.map.algorithm = new Dijkstra();
  }
}


