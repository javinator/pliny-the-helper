import {Recipe, Water} from "models";
import {CalculatorUtil} from "./calculator.utils";

interface Range {
  min: number,
  max: number
}

export class WaterUtil {

  static calculateMashWater(recipe: Recipe): Water {
    if (recipe.waters.length === 1) {
      const waterProfile = recipe.waters[0];
      const waterAgents = recipe.miscs.filter(misc => misc.type === 'Water Agent');
      const acidMalt = recipe.fermentables.filter(malt => malt.name === 'Acidulated Malt');
      let water = JSON.parse(JSON.stringify(waterProfile));
      water.ph = 5.55;
      water.alkalinity = 1;
      return water;
    }
    return {
      uid: '',
      name: "Mash",
      alkalinity: 0,
      bicarbonate: 0,
      calcium: 0,
      chloride: 0,
      magnesium: 0,
      ph: 7,
      sodium: 0,
      sulfate: 0,
      version: 0,
    }

  }

  static getOptimalAlkalinityRange(recipe: Recipe): Range {
    switch (recipe.style?.category) {
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

  static getOptimalCalciumRange(recipe: Recipe): Range {
    if (recipe.style?.minOg && recipe.style.minOg > 1.06) {
      return {min: 60, max: 180};
    } else {
      return {min: 40, max: 100}
    }
  }

  static getOptimalMagnesiumRange(recipe: Recipe): Range {
    if (recipe.style?.minColor && recipe.style.minColor > 20) {
      return {min: 15, max: 35};
    } else {
      return {min: 5, max: 30}
    }
  }

  static getOptimalSodiumRange(recipe: Recipe): Range {
    switch (recipe.style?.name) {
      case ('Lager / Pils'):
      case ('Spezialbier / Kellerbier'):
      case ('Blonde Ale / Kölsch'):
        return {min: 0, max: 75};
      case ('Gose'):
        return {min: 150, max: 250};
      default:
        return {min: 5, max: 150};
    }
  }

  static getOptimalChlorideRange(recipe: Recipe): Range {
    if (recipe.style?.name === 'Gose') {
      return {min: 150, max: 350}
    }
    switch (recipe.style?.category) {
      case ('Amber Ale'):
      case ('Amber Lager'):
      case ('Barleywine'):
      case ('Strong Lager'):
      case ('Dark Ale'):
        return {min: 50, max: 200};
      default:
        return {min: 0, max: 150};
    }
  }

  static getOptimalSulfateRange(recipe: Recipe): Range {
    switch (recipe.style?.category) {
      case ('India Pale Ale'):
        return {min: 100, max: 350};
      case ('Pale Ale'):
      case ('Hoppy Lager'):
        return {min: 50, max: 200};
      default:
        return {min: 25, max: 100};
    }
  }

  static getOptimalRatioRange(recipe: Recipe): Range {
    switch (recipe.style?.category) {
      case ('India Pale Ale'):
        return {min: 1, max: 8};
      case ('Pale Ale'):
      case ('Hoppy Lager'):
        return {min: 1, max: 5};
      case ('Amber Ale'):
      case ('Amber Lager'):
      case ('Barleywine'):
      case ('Strong Lager'):
      case ('Dark Ale'):
        return {min: 0.4, max: 1};
      default:
        return {min: 0.5, max: 2};
    }
  }
}
