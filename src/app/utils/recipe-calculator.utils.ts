import {Recipe} from "../models/recipe.model";
import {CalculatorUtil} from "./calculator.utils";
import {Hop} from "../models/hop.model";

export class RecipeUtil {
  static calculateOg(recipe: Recipe): number {
    let gu = 0;
    recipe.fermentables.forEach((item) => {
      if (item.amount) {
        gu += CalculatorUtil.kilosToPounds(item.amount) * getPPG(item.yield) / 100;
      }
    })
    return 1 + (gu / CalculatorUtil.litersToGallons(recipe.batchSize) * recipe.efficiency) / 1000;
  }

  static calculateFg(recipe: Recipe): number {
    const att = Math.max(...recipe.yeasts.map((yeast) => yeast.attenuation)) / 100;
    const og = this.calculateOg(recipe);
    return og - (og - 1) * att;
  }

  static calculateColor(recipe: Recipe): number {
    let mcu = 0;
    recipe.fermentables.forEach((item) => {
      if (item.amount) {
        mcu += CalculatorUtil.kilosToPounds(item.amount) * item.color / CalculatorUtil.litersToGallons(recipe.batchSize);
      }
    })
    return Math.round(1.4922 * Math.pow(mcu, 0.6859));
  }

  static calculateBitterness(recipe: Recipe): number {
    let ibu = 0;
    recipe.hops.forEach((hop) => {
      const au = hop.alpha * hopUtilization(recipe, hop) / 100;
      ibu += useFactor(hop) * (au * CalculatorUtil.kilosToOunces(hop.amount!) * 7490) / CalculatorUtil.litersToGallons(recipe.boilSize);
    });
    return ibu;
  }
}

function getPPG(y: number) {
  return y * 46 / 100;
}

function calculateBoilGravity(recipe: Recipe): number {
  let gu = 0;
  recipe.fermentables.forEach((item) => {
    if (item.amount) {
      gu += CalculatorUtil.kilosToPounds(item.amount) * getPPG(item.yield) / 100;
    }
  })
  return 1 + (gu / CalculatorUtil.litersToGallons(recipe.boilSize) * recipe.efficiency) / 1000;
}

function hopUtilization(recipe: Recipe, hop: Hop): number {
  const time = hop.time ?? recipe.boilTime;
  const bignessFactor = 1.65 * Math.pow(0.000125, (calculateBoilGravity(recipe) - 1));
  const timeFactor = (1.0 - Math.exp(-0.04 * time)) / 4.15
  return bignessFactor * timeFactor;
}

function useFactor(hop: Hop) {
  if (hop.use === 'First Wort') {
    return 1.1;
  }
  if (hop.use === 'Aroma') {
    return 0.2;
  }
  if (hop.use === 'Dry Hop') {
    return 0.1;
  }
  return 1;
}
