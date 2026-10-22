import {Component, input, ChangeDetectionStrategy} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {BeerStyle} from "models";

@Component({
  selector: 'style-card',
  templateUrl: 'style-card.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [IonicModule],
})
export class StyleCardComponent {
  style = input.required<BeerStyle>();

  color() {
    return Math.floor((Number(this.style().maxColor) + Number(this.style().minColor)) / 2);
  }
}
