import {Component, computed, inject, input, Input} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe} from "models";
import {DatePipe, DecimalPipe} from "@angular/common";
import {CalculatorUtil} from "utils";
import {FormsModule} from "@angular/forms";
import {StorageService} from "services";
import {WaterUtil} from "../../../../utils/water-calculator.utils";


@Component({
  selector: 'recipe-water-card',
  templateUrl: 'recipe-water.component.html',
  styleUrls: ['recipe-water.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, DecimalPipe],
})
export class RecipeWaterComponent {
  private storage = inject(StorageService);
  readonly MIN_MASH_PH = 5.2;
  readonly MAX_MASH_PH = 5.6;

  recipe = input.required<Recipe>();
  water = computed(() => this.recipe().waters[0]);

  getMashPh() {
    return WaterUtil.calculateMashPh(this.recipe());
  }

  getPhRangeBar() {
    const start = (this.MIN_MASH_PH - 4) / 3 * 100;
    const end = (this.MAX_MASH_PH - 4) / 3 * 100;
    return 'width: ' + (end - start) + '%; left: ' + start + '%;';
  }

  getPhRangeMarker() {
    const ph = this.getMashPh();
    const color =
      (ph >= this.MIN_MASH_PH && ph <= this.MAX_MASH_PH)
        ? 'background-color: var(--ion-color-primary);'
        : 'background-color: var(--ion-color-danger);';
    let position = (ph - 4) / 3 * 100;
    position = position < 0 ? 0 : position;
    position = position > 100 ? 100 : position;
    return 'left:' + position + '%;' + color;
  }

  getAlkalinity() {
    return WaterUtil.calculateAlkalinity(this.recipe());
  }

  getAlkalinityRange() {
    return WaterUtil.getOptimalAlkalinityRange(this.recipe());
  }

  getAlkalinityRangeBar() {
    const alkalinity = this.getAlkalinityRange();
    const start = (alkalinity.min + 5) / 20 * 100;
    const end = (alkalinity.max + 5) / 20 * 100;
    return 'width: ' + (end - start) + '%; left: ' + start + '%;';
  }

  getAlkalinityRangeMarker() {
    const value = this.getAlkalinity();
    const alkalinity = this.getAlkalinityRange();
    const color =
      (value >= alkalinity.min && value <= alkalinity.max)
        ? 'background-color: var(--ion-color-primary);'
        : 'background-color: var(--ion-color-danger);';
    let position = (value + 5) / 20 * 100;
    position = position < 0 ? 0 : position;
    position = position > 100 ? 100 : position;
    return 'left:' + position + '%;' + color;
  }
}
