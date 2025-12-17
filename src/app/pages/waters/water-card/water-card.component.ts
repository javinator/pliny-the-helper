import {Component, EventEmitter, input, Output} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {Water} from "models";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'water-card',
  templateUrl: 'water-card.component.html',
  standalone: true,
  imports: [IonicModule, DecimalPipe],
})
export class WaterCardComponent {
  @Output() deleteWater = new EventEmitter<void>();
  water = input.required<Water>();

}
