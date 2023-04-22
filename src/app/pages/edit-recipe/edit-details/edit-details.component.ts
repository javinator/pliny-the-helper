import {Component, Input} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe} from "models";
import {DatePipe, DecimalPipe} from "@angular/common";
import {CalculatorUtil} from "utils";
import {FormsModule} from "@angular/forms";
import {StorageService} from "services";

@Component({
  selector: 'edit-details-card',
  templateUrl: 'edit-details.component.html',
  styleUrls: ['../../../app.component.scss', 'edit-details.component.scss'],
  standalone: true,
  imports: [IonicModule, DecimalPipe, DatePipe, FormsModule],
})
export class EditDetailsComponent {
  constructor(private storage: StorageService) {
  }

  @Input()
  recipe!: Recipe;

  getOgRangeBar() {
    if (this.recipe.style?.minOg && this.recipe.style?.maxOg) {
      const start = (this.recipe.style.minOg - 1.02) / 0.125 * 100;
      const end = (this.recipe.style.maxOg - 1.02) / 0.125 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return '';
  }

  getOgRangeMarker(og?: number) {
    og = og || 1;
    if (this.recipe.style?.minOg && this.recipe.style?.maxOg) {
      const color =
        (og >= this.recipe.style.minOg && og <= this.recipe.style.maxOg)
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
    if (this.recipe.style?.minFg && this.recipe.style?.maxFg) {
      const start = (this.recipe.style.minFg - 0.998) / 0.05 * 100;
      const end = (this.recipe.style.maxFg - 0.998) / 0.05 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return '';
  }

  getFgRangeMarker(fg?: number) {
    fg = fg || 0.998;
    if (this.recipe.style?.minFg && this.recipe.style?.maxFg) {
      const color =
        (fg >= this.recipe.style.minFg && fg <= this.recipe.style.maxFg)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = (fg - 0.998) / 0.05 * 100;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return '';
  }

  getAbvRangeBar() {
    if (this.recipe.style?.minAbv && this.recipe.style?.maxAbv) {
      const start = this.recipe.style.minAbv / 15 * 100;
      const end = this.recipe.style.maxAbv / 15 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return '';
  }

  getAbvRangeMarker(abv?: number) {
    abv = abv || 0;
    if (this.recipe.style?.minAbv && this.recipe.style?.maxAbv) {
      const color =
        (abv >= this.recipe.style.minAbv && abv <= this.recipe.style.maxAbv)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = abv / 15 * 100;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return '';
  }

  getIbuRangeBar() {
    if (this.recipe.style?.minIbu && this.recipe.style?.maxIbu) {
      const start = this.recipe.style.minIbu / 120 * 100;
      const end = this.recipe.style.maxIbu / 120 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return '';
  }

  getIbuRangeMarker() {
    if (this.recipe.style?.minIbu && this.recipe.style?.maxIbu) {
      const color =
        (this.recipe.IBU >= this.recipe.style.minIbu && this.recipe.IBU <= this.recipe.style.maxIbu)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = this.recipe.IBU / 120 * 100;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return '';
  }

  getSrmRangeBar() {
    if (this.recipe.style?.minColor && this.recipe.style?.maxColor) {
      const start = this.recipe.style.minColor / 41 * 100;
      const end = this.recipe.style.maxColor / 41 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return '';
  }

  getSrmRangeMarker() {
    if (this.recipe.style?.minColor && this.recipe.style?.maxColor) {
      const color =
        (this.recipe.color >= this.recipe.style.minColor && this.recipe.color <= this.recipe.style.maxColor)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = this.recipe.color / 42 * 100;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return '';
  }

  getMeasuredAbv() {
    return CalculatorUtil.abv(this.recipe.measuredOG || 1, this.recipe.measuredFG || 1)
  }

  calculateEfficiency() {
    const vol = this.recipe.measuredVol || this.recipe.batchSize;
    const og = this.recipe.measuredOG || 1;
    this.recipe.calculatedEfficiency = this.recipe.efficiency * (vol / this.recipe.batchSize) * ((og - 1) / (this.recipe.OG - 1))
  }

  getEfficiencyMarker() {
    if (this.recipe.calculatedEfficiency) {
      const color =
        (this.recipe.calculatedEfficiency >= 60 && this.recipe.calculatedEfficiency <= 85)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = (this.recipe.calculatedEfficiency - 50) / 40 * 100;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return 'left: 0%; background-color: var(--ion-color-danger);';
  }

  saveRecipe() {
    this.storage.saveRecipe(this.recipe);
  }
}
