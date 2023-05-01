import {Component, Input, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe, Fermentable, Hop, Yeast, Misc} from "models";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {StorageService} from "services";
import {RecipeUtil} from "utils";
import {CONFIG} from "../../../app.constants";
import {SelectSearchComponent} from "@shared";

@Component({
  selector: 'brewing-card',
  templateUrl: 'brewing.component.html',
  styleUrls: ['../../../app.component.scss', 'brewing.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, NgForOf, DecimalPipe, SelectSearchComponent],
})
export class BrewingComponent {
  RecipeUtil = RecipeUtil;

  constructor(private storage: StorageService) {
  }

  @Input()
  recipe?: Recipe;

  strikeTemp() {
    return RecipeUtil.calculateStrikeTemp(this.recipe);
  }

  decoctionVolume(index: number) {
    return RecipeUtil.calculateDecoctionVolume(this.recipe!, index);
  }

  logMash() {
    console.log(this.recipe?.mashProfile);
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
    //TODO: calculate carbSugar based on desired carbonation
    return Math.round((this.recipe?.batchSize || 0) * 5.5);
  }
}
