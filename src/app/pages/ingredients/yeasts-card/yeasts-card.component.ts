import {Component, Input} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {Yeast} from "models";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'yeasts-card',
  templateUrl: 'yeasts-card.component.html',
  standalone: true,
  imports: [IonicModule, DecimalPipe],
})
export class YeastsCardComponent {
  @Input()
  yeast!: Yeast;

}
