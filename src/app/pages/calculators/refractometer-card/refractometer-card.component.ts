import {Component, Input, OnInit} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {DecimalPipe} from "@angular/common";
import {CalculatorUtil} from "utils";
import {Settings} from "models";
import {CONFIG} from "../../../app.constants";

@Component({
  selector: 'refractometer-card',
  templateUrl: 'refractometer-card.component.html',
  standalone: true,
  styleUrls: ['../calculators.component.scss'],
  imports: [IonicModule, DecimalPipe],
})
export class RefractometerCardComponent implements OnInit {
  unit = 'gravity';

  og?: number;
  fg?: number;
  wcf!: number;
  formula!: String;

  @Input()
  settings?: Settings;

  ngOnInit() {
    this.wcf = this.settings?.wortCorrectionFactor || CONFIG.defaultWFC;
    this.formula = 'Terrill';
  }

  changeUnit(event: any) {
    this.unit = event.detail.value;
  }

  changeWCF(event: any) {
    this.wcf = event.detail.value;
  }

  changeOg(event: any) {
    this.og = event.detail.value;
  }

  changeFg(event: any) {
    this.fg = event.detail.value;
  }

  changeFormula(event: any) {
    this.formula = event.detail.value;
  }

  calcOG() {
    if (this.og && this.wcf) {
      const sg = this.unit === 'gravity' ? this.og : CalculatorUtil.brixToSg(this.og);
      return correctReading(sg, this.wcf);
    } else {
      return 0;
    }
  }

  calcFG() {
    if (this.fg && this.wcf) {
      const sg = this.unit === 'gravity' ? this.fg : CalculatorUtil.brixToSg(this.fg);
      return correctReading(sg, this.wcf);
    } else {
      return 0;
    }
  }

  calcRefractometerFG() {
    if (this.og && this.fg && this.wcf) {
      const obrix = CalculatorUtil.sgToBrix(this.calcOG());
      const fbrix = CalculatorUtil.sgToBrix(this.calcFG());
      if (this.formula === 'Novotny') {
        return (0.00001335 * obrix * obrix) - (0.00003239 * obrix * fbrix) + (0.00002916 * fbrix * fbrix)
          - (0.002421 * obrix) + (0.006219 * fbrix) + 1;
      } else {
        return 1.000 - (0.0044993 * obrix) + (0.011774 * fbrix)
          + (0.00027581 * obrix * obrix) - (0.0012717 * fbrix * fbrix)
          - (0.00000728 * obrix * obrix * obrix) + (0.000063293 * fbrix * fbrix * fbrix);
      }
    } else {
      return 0;
    }
  }

  abv() {
    if (this.og && this.fg) {
      return CalculatorUtil.abv(this.calcOG(), this.calcRefractometerFG());
    } else {
      return 0;
    }
  }

  attenuation() {
    if (this.og && this.fg) {
      const og = this.calcOG();
      return ((og - this.calcRefractometerFG()) / (og - 1)) * 100
    } else {
      return 0;
    }
  }
}

function correctReading(sg: number, wcf: number) {
  return (sg - 1) / wcf + 1;
}
