import {Component} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {DecimalPipe} from "@angular/common";
import {CalculatorUtil} from "utils";

@Component({
  selector: 'hydrometer-card',
  templateUrl: 'hydrometer-card.component.html',
  standalone: true,
  styleUrls: ['../calculators.component.scss'],
  imports: [IonicModule, DecimalPipe],
})
export class HydrometerCardComponent {

  gravity?: number;
  wortTemp?: number;
  calTemp = 20;

  changeGravity(event: any) {
    this.gravity = event.detail.value;
  }

  changeWortTemp(event: any) {
    this.wortTemp = event.detail.value;
  }

  changeCalTemp(event: any) {
    this.calTemp = event.detail.value;
  }

  calcGravity() {
    if (this.gravity && this.wortTemp && this.calTemp) {
      const temp = CalculatorUtil.celsiusToFahrenheit(this.wortTemp);
      const ct = CalculatorUtil.celsiusToFahrenheit(this.calTemp);
      let cg = this.gravity * (1.00130346 - 0.000134722124 * temp + 0.00000204052596 * temp * temp - 0.00000000232820948 * temp * temp * temp);
      cg = cg / (1.00130346 - 0.000134722124 * ct + 0.00000204052596 * ct * ct - 0.00000000232820948 * ct * ct * ct);
      return cg;
    } else {
      return 0;
    }
  }
}
