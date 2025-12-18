import {BeerStyle, Recipe} from "models";
import {CalculatorUtil} from "./calculator.utils";

interface Range {
  min: number,
  max: number
}

export class WaterUtil {
  static calculateMashPh(recipe: Recipe): number {
    return 5.55;
  }

  static calculateAlkalinity(recipe: Recipe): number {
    return 1;
  }

  static getOptimalAlkalinityRange(recipe: Recipe): Range {
    if (!recipe.style) {
      return {min: -3, max: 5}
    } else {
      switch (recipe.style.category) {
        case ('Pale Lager'):
          return {min: -5, max: 0};
        case ('Wheat Beer'):
        case ('Blonde Ale'):
          return {min: -3, max: 0};
        case ('Belgian Ale'):
        case ('Hoppy Lager'):
        case ('India Pale Ale'):
        case ('Pale Ale'):
          return {min: 0, max: 5};
        case ('Amber Ale'):
        case ('Amber Lager'):
        case ('Barleywine'):
        case ('Strong Lager'):
          return {min: 3, max: 6};
        case ('Dark Ale'):
          return {min: 5, max: 10};
        default:
          return {min: -3, max: 5};
      }
    }

  }
}
