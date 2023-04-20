import {Component, Input} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {BeerStyle} from "models";

@Component({
  selector: 'style-card',
  templateUrl: 'style-card.component.html',
  standalone: true,
  imports: [IonicModule],
})
export class StyleCardComponent {
  @Input()
  style!: BeerStyle;

  color() {
    return Math.floor((Number(this.style.maxColor) + Number(this.style.minColor)) / 2);
  }
}
