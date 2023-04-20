import {Component, Input} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe} from "models";
import {DatePipe, DecimalPipe} from "@angular/common";

@Component({
  selector: 'edit-details-card',
  templateUrl: 'edit-details.component.html',
  styleUrls: ['../../../app.component.scss', 'edit-details.component.scss'],
  standalone: true,
  imports: [IonicModule, DecimalPipe, DatePipe],
})
export class EditDetailsComponent {

  @Input()
  recipe!: Recipe;

  getOgRangeBar() {
    if (this.recipe.style?.minOg && this.recipe.style?.maxOg) {
      const start = (this.recipe.style.minOg - 1.02) / 0.125 * 100;
      const end = (this.recipe.style.maxOg - 1.02) / 0.125 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return undefined
  }

  getOgRangeMarker() {
    if (this.recipe.style?.minOg && this.recipe.style?.maxOg) {
      const color =
        (this.recipe.OG >= this.recipe.style.minOg && this.recipe.OG <= this.recipe.style.maxOg)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = (this.recipe.OG - 1.02) / 0.125 * 100;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return undefined
  }

  getFgRangeBar() {
    if (this.recipe.style?.minFg && this.recipe.style?.maxFg) {
      const start = (this.recipe.style.minFg - 0.998) / 0.05 * 100;
      const end = (this.recipe.style.maxFg - 0.998) / 0.05 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return undefined
  }

  getFgRangeMarker() {
    if (this.recipe.style?.minFg && this.recipe.style?.maxFg) {
      const color =
        (this.recipe.FG >= this.recipe.style.minFg && this.recipe.FG <= this.recipe.style.maxFg)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = (this.recipe.FG - 0.998) / 0.05 * 100;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return undefined
  }

  getAbvRangeBar() {
    if (this.recipe.style?.minAbv && this.recipe.style?.maxAbv) {
      const start = this.recipe.style.minAbv / 15 * 100;
      const end = this.recipe.style.maxAbv / 15 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return undefined
  }

  getAbvRangeMarker() {
    if (this.recipe.style?.minAbv && this.recipe.style?.maxAbv) {
      const color =
        (this.recipe.ABV >= this.recipe.style.minAbv && this.recipe.ABV <= this.recipe.style.maxAbv)
          ? 'background-color: var(--ion-color-primary);'
          : 'background-color: var(--ion-color-danger);';
      let position = this.recipe.ABV / 15 * 100;
      position = position > 100 ? 100 : position;
      return 'left:' + position + '%;' + color;
    }
    return undefined
  }

  getIbuRangeBar() {
    if (this.recipe.style?.minIbu && this.recipe.style?.maxIbu) {
      const start = this.recipe.style.minIbu / 120 * 100;
      const end = this.recipe.style.maxIbu / 120 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return undefined
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
    return undefined
  }

  getSrmRangeBar() {
    if (this.recipe.style?.minColor && this.recipe.style?.maxColor) {
      const start = this.recipe.style.minColor / 41 * 100;
      const end = this.recipe.style.maxColor / 41 * 100;
      return 'width: ' + (end - start) + '%; left: ' + start + '%;';
    }
    return undefined
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
    return undefined
  }
}
