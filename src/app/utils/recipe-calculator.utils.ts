import {Recipe} from "../models/recipe.model";
import {CalculatorUtil} from "./calculator.utils";

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
}

function getPPG(y: number) {
  return y * 46 / 100;
}
