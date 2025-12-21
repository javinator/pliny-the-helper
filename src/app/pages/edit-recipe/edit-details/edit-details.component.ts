import {Component, input, output} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe} from "models";
import {DatePipe, DecimalPipe} from "@angular/common";
import {CalculatorUtil} from "utils";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'edit-details-card',
  templateUrl: 'edit-details.component.html',
  styleUrls: ['edit-details.component.scss'],
  standalone: true,
  imports: [IonicModule, DecimalPipe, DatePipe, FormsModule],
})
export class EditDetailsComponent {
  recipe = input.required<Recipe>();
  showCost = input(false);
  costCurrency = input('CHF');
  saveEditRecipe = output<Recipe>();

  getOgRangeBar() {
    if (this.recipe().style?.minOg && this.recipe().style?.maxOg) {
      const start = (this.recipe().style!.minOg - 1.02) / 0.125 * 100;
      const end = (this.recipe().style!.maxOg - 1.02) / 0.125 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return '';
  }

  getOgRangeMarker(og?: number) {
    og = og || 1;
    if (this.recipe().style?.minOg && this.recipe().style?.maxOg) {
      const color =
        (og >= this.recipe().style!.minOg && og <= this.recipe().style!.maxOg)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = (og - 1.02) / 0.125 * 100;
      position = position < 0 ? 0 : position;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return '';
  }

  getFgRangeBar() {
    if (this.recipe().style?.minFg && this.recipe().style?.maxFg) {
      const start = (this.recipe().style!.minFg - 0.998) / 0.05 * 100;
      const end = (this.recipe().style!.maxFg - 0.998) / 0.05 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return '';
  }

  getFgRangeMarker(fg?: number) {
    fg = fg || 0.998;
    if (this.recipe().style?.minFg && this.recipe().style?.maxFg) {
      const color =
        (fg >= this.recipe().style!.minFg && fg <= this.recipe().style!.maxFg)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = (fg - 0.998) / 0.05 * 100;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return '';
  }

  getAbvRangeBar() {
    if (this.recipe().style?.minAbv && this.recipe().style?.maxAbv) {
      const start = this.recipe().style!.minAbv / 15 * 100;
      const end = this.recipe().style!.maxAbv / 15 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return '';
  }

  getAbvRangeMarker(abv?: number) {
    abv = abv || 0;
    if (this.recipe().style?.minAbv && this.recipe().style?.maxAbv) {
      const color =
        (abv >= this.recipe().style!.minAbv && abv <= this.recipe().style!.maxAbv)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = abv / 15 * 100;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return '';
  }

  getIbuRangeBar() {
    if (this.recipe().style?.minIbu && this.recipe().style?.maxIbu) {
      const start = this.recipe().style!.minIbu / 120 * 100;
      const end = this.recipe().style!.maxIbu / 120 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return '';
  }

  getIbuRangeMarker() {
    if (this.recipe().style?.minIbu && this.recipe().style?.maxIbu) {
      const color =
        (this.recipe().IBU >= this.recipe().style!.minIbu && this.recipe().IBU <= this.recipe().style!.maxIbu)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = this.recipe().IBU / 120 * 100;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return '';
  }

  getSrmRangeBar() {
    if (this.recipe().style?.minColor && this.recipe().style?.maxColor) {
      const start = this.recipe().style!.minColor / 41 * 100;
      let end = this.recipe().style!.maxColor / 41 * 100;
      end = end > 100 ? 100 : end;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return '';
  }

  getSrmRangeMarker() {
    if (this.recipe().style?.minColor && this.recipe().style?.maxColor) {
      const color =
        (this.recipe().color >= this.recipe().style!.minColor && this.recipe().color <= this.recipe().style!.maxColor)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = this.recipe().color / 42 * 100;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return '';
  }

  getCarbRangeBar() {
    if (this.recipe().style?.minCarb && this.recipe().style?.maxCarb) {
      const start = this.recipe().style!.minCarb! / 5 * 100;
      let end = this.recipe().style!.maxCarb! / 5 * 100;
      end = end > 100 ? 100 : end;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return '';
  }

  getCarbRangeMarker() {
    if (this.recipe().style?.minCarb && this.recipe().style?.maxCarb && this.recipe().carbonation) {
      const color =
        (this.recipe().carbonation! >= this.recipe().style!.minCarb! && this.recipe().carbonation! <= this.recipe().style!.maxCarb!)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = this.recipe().carbonation! / 5 * 100;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return '';
  }

  getMeasuredAbv() {
    return CalculatorUtil.abv(this.recipe().measuredOG || 1, this.recipe().measuredFG || 1)
  }

  getAverageAttenuation() {
    if (this.recipe().yeasts.length > 0) {
      return this.recipe().yeasts.reduce((total, next) => total + next.attenuation, 0) / this.recipe().yeasts.length
    }
    return 0;
  }

  getMeasuredAttenuation() {
    return CalculatorUtil.attenuation(this.recipe().measuredOG || 1, this.recipe().measuredFG || 1) * 100 || 0
  }

  getAttenuationBar() {
    if (this.getAverageAttenuation() > 0) {
      let start = (this.getAverageAttenuation() - 5);
      let end = (this.getAverageAttenuation() + 5);
      start = start < 0 ? 0 : start;
      end = end > 100 ? 100 : end;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return '';
  }

  getAttenuationMarker() {
    const color =
      (this.getMeasuredAttenuation() >= this.getAverageAttenuation() - 5 && this.getMeasuredAttenuation() <= this.getAverageAttenuation() + 5)
        ? 'background-color: var(--ion-color-primary);'
        : 'background-color: var(--ion-color-danger);';
    let position = this.getMeasuredAttenuation();
    position = position > 100 ? 100 : position;
    return 'left:' + position + '%;' + color;
  }

  getEfficiencyMarker() {
    if (this.recipe().calculatedEfficiency) {
      const color =
        (this.recipe().calculatedEfficiency! >= 60 && this.recipe().calculatedEfficiency! <= 85)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = (this.recipe().calculatedEfficiency! - 50) / 40 * 100;
      position = position > 100 ? 100 : position < 0 ? 0 : position;
      return 'left:' + position + '%;' + color;
    }
    return 'left: 0%; background-color: var(--ion-color-danger);';
  }

  saveRecipe() {
    this.saveEditRecipe.emit(this.recipe());
  }

  convertCost() {
    if (this.recipe().cost) {
      switch (this.costCurrency()) {
        case ('EUR'):
          return this.recipe().cost! * 1.08;
        case ('GBP'):
          return this.recipe().cost! * 0.95;
        case ('USD'):
          return this.recipe().cost! * 1.25;
        default:
          return this.recipe().cost;
      }
    }
    return;
  }
}
