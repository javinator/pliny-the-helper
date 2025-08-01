import {Component, Input, inject} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe, Hop} from "models";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {StorageService} from "services";
import {RecipeUtil} from "utils";

@Component({
  selector: 'brewing-card',
  templateUrl: 'brewing.component.html',
  styleUrls: ['../../../app.component.scss', 'brewing.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, NgForOf, DecimalPipe],
})
export class BrewingComponent {

  @Input()
  recipe?: Recipe;

  strikeTemp() {
    return RecipeUtil.calculateStrikeTemp(this.recipe);
  }

  decoctionVolume(index: number) {
    return RecipeUtil.calculateDecoctionVolume(this.recipe!, index);
  }

  firstWortHops(): Hop[] {
    return this.recipe?.hops.filter((hop) => hop.use === 'First Wort') || [];
  }

  boilHops(): Hop[] {
    return this.recipe?.hops.filter((hop) => hop.use === 'Boil') || [];
  }

  aromaHops(): Hop[] {
    return this.recipe?.hops.filter((hop) => hop.use === 'Aroma') || [];
  }

  dryHops(): Hop[] {
    return this.recipe?.hops.filter((hop) => hop.use === 'Dry Hop') || [];
  }

  carbSugar() {
    if (this.recipe && !this.recipe.forcedCarbonation) {
      return RecipeUtil.calculatePrimingSugar(this.recipe);
    } else {
      return 0;
    }
  }
}
