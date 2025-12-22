import {Component, computed, input} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe} from "models";
import {DecimalPipe} from "@angular/common";
import {WaterUtil} from "utils";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'recipe-water-card',
  templateUrl: 'recipe-water.component.html',
  styleUrls: ['recipe-water.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, DecimalPipe],
})
export class RecipeWaterComponent {
  readonly MIN_MASH_PH = 5.2;
  readonly MAX_MASH_PH = 5.6;

  recipe = input.required<Recipe>();
  water = computed(() => this.recipe().waters[0]);
  mashWater = computed(() => WaterUtil.calculateMashWater(this.recipe()))

  getPhRangeBar() {
    const start = (this.MIN_MASH_PH - 4) / 3 * 100;
    const end = (this.MAX_MASH_PH - 4) / 3 * 100;
    return 'width: ' + (end - start) + '%; left: ' + start + '%;';
  }

  getPhRangeMarker() {
    const ph = this.mashWater().ph!;
    const color =
      (ph >= this.MIN_MASH_PH && ph <= this.MAX_MASH_PH)
        ? 'background-color: var(--ion-color-primary);'
        : 'background-color: var(--ion-color-danger);';
    let position = (ph - 4) / 3 * 100;
    position = position < 0 ? 0 : position;
    position = position > 100 ? 100 : position;
    return 'left:' + position + '%;' + color;
  }

  getAlkalinityRange() {
    return WaterUtil.getOptimalAlkalinityRange(this.recipe());
  }

  getAlkalinityRangeBar() {
    const alkalinity = this.getAlkalinityRange();
    const start = (alkalinity.min + 4) * 5;
    const end = (alkalinity.max + 4) * 5;
    return 'width: ' + (end - start) + '%; left: ' + start + '%;';
  }

  getAlkalinityRangeMarker() {
    const value = this.mashWater().alkalinity!;
    const alkalinity = this.getAlkalinityRange();
    const color =
      (value >= alkalinity.min && value <= alkalinity.max)
        ? 'background-color: var(--ion-color-primary);'
        : 'background-color: var(--ion-color-danger);';
    let position = (value + 4) * 5;
    position = position < 0 ? 0 : position;
    position = position > 100 ? 100 : position;
    return 'left:' + position + '%;' + color;
  }

  getCalciumRange() {
    return WaterUtil.getOptimalCalciumRange(this.recipe());
  }

  getCalciumRangeBar() {
    const range = this.getCalciumRange();
    const start = range.min / 2;
    const end = range.max / 2;
    return 'width: ' + (end - start) + '%; left: ' + start + '%;';
  }

  getCalciumRangeMarker() {
    const value = this.mashWater().calcium!;
    const range = this.getCalciumRange();
    const color =
      (value >= range.min && value <= range.max)
        ? 'background-color: var(--ion-color-primary);'
        : 'background-color: var(--ion-color-danger);';
    let position = value / 2;
    position = position < 0 ? 0 : position;
    position = position > 100 ? 100 : position;
    return 'left:' + position + '%;' + color;
  }

  getMagnesiumRange() {
    return WaterUtil.getOptimalMagnesiumRange(this.recipe());
  }

  getMagnesiumRangeBar() {
    const range = this.getMagnesiumRange();
    const start = range.min * 2;
    const end = range.max * 2;
    return 'width: ' + (end - start) + '%; left: ' + start + '%;';
  }

  getMagnesiumRangeMarker() {
    const value = this.mashWater().magnesium!;
    const range = this.getMagnesiumRange();
    const color =
      (value >= range.min && value <= range.max)
        ? 'background-color: var(--ion-color-primary);'
        : 'background-color: var(--ion-color-danger);';
    let position = value * 2;
    position = position < 0 ? 0 : position;
    position = position > 100 ? 100 : position;
    return 'left:' + position + '%;' + color;
  }

  getSodiumRange() {
    return WaterUtil.getOptimalSodiumRange(this.recipe());
  }

  getSodiumRangeBar() {
    const range = this.getSodiumRange();
    const start = range.min / 2.5;
    const end = range.max / 2.5;
    return 'width: ' + (end - start) + '%; left: ' + start + '%;';
  }

  getSodiumRangeMarker() {
    const value = this.mashWater().sodium!;
    const range = this.getSodiumRange();
    const color =
      (value >= range.min && value <= range.max)
        ? 'background-color: var(--ion-color-primary);'
        : 'background-color: var(--ion-color-danger);';
    let position = value / 2.5;
    position = position < 0 ? 0 : position;
    position = position > 100 ? 100 : position;
    return 'left:' + position + '%;' + color;
  }

  getChlorideRange() {
    return WaterUtil.getOptimalChlorideRange(this.recipe());
  }

  getChlorideRangeBar() {
    const range = this.getChlorideRange();
    const start = range.min / 4;
    const end = range.max / 4;
    return 'width: ' + (end - start) + '%; left: ' + start + '%;';
  }

  getChlorideRangeMarker() {
    const value = this.mashWater().chloride!;
    const range = this.getChlorideRange();
    const color =
      (value >= range.min && value <= range.max)
        ? 'background-color: var(--ion-color-primary);'
        : 'background-color: var(--ion-color-danger);';
    let position = value / 4;
    position = position < 0 ? 0 : position;
    position = position > 100 ? 100 : position;
    return 'left:' + position + '%;' + color;
  }

  getSulfateRange() {
    return WaterUtil.getOptimalSulfateRange(this.recipe());
  }

  getSulfateRangeBar() {
    const range = this.getSulfateRange();
    const start = range.min / 4;
    const end = range.max / 4;
    return 'width: ' + (end - start) + '%; left: ' + start + '%;';
  }

  getSulfateRangeMarker() {
    const value = this.mashWater().sulfate!;
    const range = this.getSulfateRange();
    const color =
      (value >= range.min && value <= range.max)
        ? 'background-color: var(--ion-color-primary);'
        : 'background-color: var(--ion-color-danger);';
    let position = value / 4;
    position = position < 0 ? 0 : position;
    position = position > 100 ? 100 : position;
    return 'left:' + position + '%;' + color;
  }

  getRatioRange() {
    return WaterUtil.getOptimalRatioRange(this.recipe());
  }

  getRatioRangeBar() {
    const range = this.getRatioRange();
    const start = range.min * 10;
    const end = range.max * 10;
    return 'width: ' + (end - start) + '%; left: ' + start + '%;';
  }

  getRatioRangeMarker() {
    const value = this.mashWater().sulfate! / this.mashWater().chloride!;
    const range = this.getRatioRange();
    const color =
      (value >= range.min && value <= range.max)
        ? 'background-color: var(--ion-color-primary);'
        : 'background-color: var(--ion-color-danger);';
    let position = value * 10;
    position = position < 0 ? 0 : position;
    position = position > 100 ? 100 : position;
    return 'left:' + position + '%;' + color;
  }
}
