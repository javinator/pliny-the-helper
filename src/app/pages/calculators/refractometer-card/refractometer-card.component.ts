import {Component} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {DecimalPipe} from "@angular/common";
import {CalculatorUtil} from "../../../utils/calculator.utils";

@Component({
  selector: 'refractometer-card',
  templateUrl: 'refractometer-card.component.html',
  standalone: true,
  styleUrls: ['../../edit-recipe/edit-details/edit-details.component.scss'],
  imports: [IonicModule, DecimalPipe],
})
export class RefractometerCardComponent {
  unit = 'gravity';

  og?: number;
  fg?: number;

  changeUnit(event: any) {
    this.unit = event.detail.value;
  }

  changeOg(event: any) {
    this.og = event.detail.value;
  }

  changeFg(event: any) {
    this.fg = event.detail.value;
  }

  calcGravity() {
    if (this.og && this.fg) {
      const obrix = this.unit === 'gravity' ? CalculatorUtil.sgToBrix(this.og) : this.og;
      const fbrix = this.unit === 'gravity' ? CalculatorUtil.sgToBrix(this.fg) : this.fg;
      return 1.000 - (0.004493 * obrix) + (0.011774 * fbrix)
        + (0.00027581 * obrix * obrix) - (0.0012717 * fbrix * fbrix)
        - (0.00000728 * obrix * obrix * obrix) + (0.000063293 * fbrix * fbrix * fbrix);
    } else {
      return 0;
    }
  }

  abv() {
    if (this.og && this.fg) {
      return CalculatorUtil.abv(this.unit === 'gravity' ? this.og : CalculatorUtil.brixToSg(this.og), this.calcGravity());
    } else {
      return 0;
    }
  }

  attenuation() {
    if (this.og && this.fg) {
      const og = this.unit === 'gravity' ? this.og : CalculatorUtil.brixToSg(this.og);
      return ((og - this.calcGravity()) / (og - 1)) * 100
    } else {
      return 0;
    }
  }

}
