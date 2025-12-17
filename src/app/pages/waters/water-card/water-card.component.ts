import {Component, Input} from "@angular/core";
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
  @Input()
  water!: Water;

}
