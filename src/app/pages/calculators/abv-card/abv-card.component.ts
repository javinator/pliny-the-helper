import {Component} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {DecimalPipe} from "@angular/common";
import {CalculatorUtil} from "utils";

@Component({
  selector: 'abv-card',
  templateUrl: 'abv-card.component.html',
  standalone: true,
  styleUrls: ['../calculators.page.scss'],
  imports: [IonicModule, DecimalPipe],
})
export class AbvCardComponent {
  og?: number;
  fg?: number;

  changeOg(event: any) {
    this.og = event.detail.value;
  }

  changeFg(event: any) {
    this.fg = event.detail.value;
  }

  abv() {
    if (this.og && this.fg) {
      return CalculatorUtil.abv(this.og, this.fg);
    } else {
      return 0;
    }
  }

  attenuation() {
    if (this.og && this.fg) {
      return ((this.og - this.fg) / (this.og - 1)) * 100
    } else {
      return 0;
    }
  }
}
