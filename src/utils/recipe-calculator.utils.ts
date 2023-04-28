import {Recipe, Settings} from "models";
import {CalculatorUtil} from "./calculator.utils";
import {Hop} from "models";
import {Fermentable} from "models";
import {CONFIG} from "../app/app.constants";

export class RecipeUtil {
  static calculateOg(recipe: Recipe): number {
    let gu = 0;
    recipe.fermentables.forEach((item) => {
      gu += getGu(item);
    })
    return 1 + (gu / CalculatorUtil.litersToGallons(recipe.batchSize) * recipe.efficiency) / 1000;
  }

  static getFermentablePercentage(item: Fermentable, recipe: Recipe) {
    let total = 0;
    recipe.fermentables.forEach((item) => total += Number(item.amount));
    return item.amount! / total * 100;
  }

  static getFermentableGPTPercentage(item: Fermentable, recipe: Recipe) {
    return (getGu(item) / CalculatorUtil.litersToGallons(recipe.batchSize) * recipe.efficiency)
  }

  static calculateFg(recipe: Recipe): number {
    let att = Math.max(...recipe.yeasts.map((yeast) => yeast.attenuation)) / 100;
    att = att > 0 ? att : 0;
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
      ibu += this.calculatePerHopIbu(hop, recipe);
    });
    return ibu;
  }

  static calculatePerHopIbu(hop: Hop, recipe: Recipe) {
    const au = hop.alpha * hopUtilization(recipe, hop) / 100;
    return useFactor(hop) * (au * CalculatorUtil.kilosToOunces(hop.amount!) * 7490) / CalculatorUtil.litersToGallons(recipe.boilSize);
  }

  static calculateBoilSize(recipe: Recipe, settings?: Settings) {
    const evaporation = (settings?.evaporation || CONFIG.evaporation) / 100;
    return Number(recipe.batchSize) + Number(recipe.batchSize) * evaporation * Number(recipe.boilTime) / 60;
  }

  static calculateRecipe(recipe: Recipe): Recipe {
    recipe.fermentables.sort((a, b) => b.amount! - a.amount!);
    recipe.hops.sort((a, b) => b.amount! - a.amount!);
    recipe.hops.sort((a, b) => b.time! - a.time!);
    recipe.hops.sort((a, b) => calculateHopUseValue(b.use) - calculateHopUseValue(a.use));
    recipe.OG = RecipeUtil.calculateOg(recipe);
    recipe.FG = RecipeUtil.calculateFg(recipe);
    recipe.ABV = CalculatorUtil.abv(recipe.OG, recipe.FG);
    recipe.color = RecipeUtil.calculateColor(recipe);
    recipe.IBU = RecipeUtil.calculateBitterness(recipe);
    recipe.calculatedEfficiency = calculateEfficiency(recipe);
    recipe.cost = calculateRecipePrice(recipe);
    return recipe;
  }

  static calculateStrikeTemp(recipe?: Recipe) {
    if (recipe) {
      const grainTemp = Number(recipe.mashProfile?.grainTemp || 20);
      const mashTemp = Number(recipe.mashProfile?.mashSteps.find((step) => step.type === 'Infusion')?.stepTemp || 65);
      let weight = 0;
      recipe.fermentables.forEach((f) => {
        weight += Number(f.amount) || 0
      })
      const size = Number(recipe.mashProfile?.mashSteps.find((step) => step.type === 'Infusion')?.infuseAmount || recipe.batchSize);
      return (0.41 / (size / weight)) * (mashTemp - grainTemp) + mashTemp;
    } else {
      return;
    }
  }

  static calculateDecoctionVolume(recipe: Recipe, step: number) {
    const mashVolume = Number(recipe.mashProfile?.mashSteps.find((step) => step.type === 'Infusion')?.infuseAmount || recipe.batchSize);
    const targetTemp = Number(recipe.mashProfile?.mashSteps[step].stepTemp || 20);
    const startTemp = Number(recipe.mashProfile?.mashSteps[step - 1].stepTemp || 20);
    return mashVolume * (targetTemp - startTemp) / (100 - startTemp);
  }
}

function getPPG(y: number) {
  return y * 46 / 100;
}

function getGu(item: Fermentable) {
  return CalculatorUtil.kilosToPounds(item.amount || 0) * getPPG(item.yield) / 100;
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
  const timeFactor = (1.0 - Math.exp(-0.04 * time)) / CONFIG.kettleUtilization
  return bignessFactor * timeFactor;
}

function useFactor(hop: Hop) {
  if (hop.use === 'First Wort') {
    return CONFIG.firstWortFactor;
  }
  if (hop.use === 'Aroma') {
    return CONFIG.aromaFactor;
  }
  if (hop.use === 'Dry Hop') {
    return CONFIG.dryHopFactor;
  }
  return 1;
}

function calculateHopUseValue(use: string) {
  switch (use) {
    case 'Mash':
      return 5;
    case 'First Wort':
      return 4;
    case 'Boil':
      return 3;
    case 'Aroma':
      return 2;
    case 'Dry Hop':
      return 1;
    default:
      return 0;
  }
}

function calculateRecipePrice(recipe: Recipe) {
  let total = 0;
  recipe.fermentables.forEach((item) => {
    if (item.cost && item.amount) {
      total += item.cost * item.amount;
    }
  });
  recipe.hops.forEach((item) => {
    if (item.cost && item.amount) {
      total += item.cost * item.amount * 1000;
    }
  });
  recipe.miscs.forEach((item) => {
    if (item.cost && item.amount) {
      total += item.cost * item.amount;
    }
  });
  recipe.yeasts.forEach((item) => {
    if (item.cost && item.amount) {
      total += item.cost * item.amount;
    }
  });
  return total;
}

function calculateEfficiency(recipe: Recipe) {
  const vol = Number(recipe.measuredVol || recipe.batchSize);
  const og = Number(recipe.measuredOG || 1);
  return recipe.efficiency * (vol / recipe.batchSize) * ((og - 1) / (recipe.OG - 1))
}
