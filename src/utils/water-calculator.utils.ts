import {Misc, Recipe, Water} from "models";

interface Range {
  min: number,
  max: number
}

export class WaterUtil {

  static calculateMashThickness(recipe: Recipe): number {
    if (recipe.waters.length === 1 && recipe.fermentables.length > 0) {
      const grainWeight = recipe.fermentables
        .filter(ferm => ferm.type === 'Grain')
        .map(ferm => ferm.amount ? +ferm.amount : 0)
        .reduce((prev, next) => prev + next);
      return (recipe.waters[0].amount || recipe.batchSize) / grainWeight;
    }
    return 0;
  }

  static calculateMashWater(recipe: Recipe): Water {
    if (recipe.waters.length === 1) {
      const waterProfile = recipe.waters[0];
      const waterAgents = recipe.miscs.filter(misc => misc.type === 'Water Agent');
      const acidMalt = recipe.fermentables.filter(malt => malt.name === 'Acidulated Malt');
      const acidMaltAmount = acidMalt.length > 0 ? acidMalt.map(malt => malt.amount).reduce((prev, next) => (prev || 0) + (next || 0)) : 0;
      let water = JSON.parse(JSON.stringify(waterProfile));
      water.calcium = calculateCalcium(waterProfile, waterAgents);
      water.magnesium = calculateMagnesium(waterProfile, waterAgents);
      water.sodium = calculateSodium(waterProfile, waterAgents);
      water.chloride = calculateChloride(waterProfile, waterAgents);
      water.sulfate = calculateSulfate(waterProfile, waterAgents);
      water.alkalinity = calculateResidualAlkalinity(water, waterAgents, acidMaltAmount || 0);
      water.ph = calculatePh(water, recipe);
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
      case ('Wheat Beer'):
      case ('Blonde Ale'):
        return {min: -5, max: 0};
      case ('Belgian Ale'):
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

function calculateResidualAlkalinity(water: Water, agents: Misc[], acidMalt: number) {
  const bakingSoda = agents.find(misc => misc.name === 'Baking Soda (NaHCO3)')?.amount || 0;
  const chalk = agents.find(misc => misc.name === 'Chalk (CaCO3)')?.amount || 0;
  const lactic = agents.find(misc => misc.name === 'Lactic Acid (80%)')?.amount || 0;
  const effAlk = (water.bicarbonate * 0.8197) + ((chalk * 492.1 * 1000 + bakingSoda * 594.3 * 1000 - lactic * 1066577.1 - acidMalt * 787.4) / water.amount!);
  const resAlk = effAlk - (water.calcium / 1.4) - (water.magnesium / 1.7);
  console.log('Effective Alkalinity: ' + effAlk.toFixed(2) + ' ppm (CaCo3), Residual Alkalinity: ' + resAlk.toFixed(2) + ' ppm (CaCo3).');
  return resAlk * 0.0562;
}

function calculatePh(water: Water, recipe: Recipe) {
  if (recipe.fermentables.length > 0) {
    const grainWeight = recipe.fermentables
      .filter(ferm => ['Grain', 'Adjunct'].includes(ferm.type))
      .map(ferm => ferm.amount ? +ferm.amount : 0)
      .reduce((prev, next) => prev + next);
    let weightedGrainPh = 0;
    recipe.fermentables.forEach(fermentable => {
      if (fermentable.type === 'Grain') {
        if (+fermentable.color < 4) {
          weightedGrainPh += 5.75 * (fermentable.amount ? +fermentable.amount : 0)
        } else if (+fermentable.color < 12) {
          weightedGrainPh += 5.55 * (fermentable.amount ? +fermentable.amount : 0)
        } else if (+fermentable.color < 24) {
          weightedGrainPh += 5.4 * (fermentable.amount ? +fermentable.amount : 0)
        } else if (+fermentable.color < 100) {
          weightedGrainPh += 4.85 * (fermentable.amount ? +fermentable.amount : 0)
        } else {
          weightedGrainPh += 4.55 * (fermentable.amount ? +fermentable.amount : 0)
        }
      }
      if (fermentable.type === 'Adjunct') {
        weightedGrainPh += 6 * (fermentable.amount ? +fermentable.amount : 0)
      }
    })
    return weightedGrainPh / grainWeight + (0.013 * ((water.amount || recipe.batchSize) / grainWeight) + 0.013) * water.alkalinity! / 3.785;
  }
  return water.ph
}

function calculateCalcium(water: Water, agents: Misc[]) {
  const waterAmount = water.amount!;
  const gypsum = agents.find(misc => misc.name === 'Gypsum (CaSO4)')?.amount || 0;
  const calciumChloride = agents.find(misc => misc.name === 'Calcium Chloride (CaCl2)')?.amount || 0;
  return +water.calcium + (232.78 * 1000 * (gypsum / waterAmount)) + (272.6 * 1000 * (calciumChloride / waterAmount));
}

function calculateMagnesium(water: Water, agents: Misc[]) {
  const waterAmount = water.amount!;
  const salt = agents.find(misc => misc.name === 'Epsom Salt (MgSO4)')?.amount || 0;
  return +water.magnesium + (98.59 * 1000 * (salt / waterAmount));
}

function calculateSodium(water: Water, agents: Misc[]) {
  const waterAmount = water.amount!;
  const salt = agents.find(misc => misc.name === 'Table Salt (NaCl)')?.amount || 0;
  const bakingSoda = agents.find(misc => misc.name === 'Baking Soda (NaHCO3)')?.amount || 0;
  return +water.sodium + (393.39 * 1000 * (salt / waterAmount)) + (273.66 * 1000 * (bakingSoda / waterAmount));
}

function calculateChloride(water: Water, agents: Misc[]) {
  const waterAmount = water.amount!;
  const salt = agents.find(misc => misc.name === 'Table Salt (NaCl)')?.amount || 0;
  const calciumChloride = agents.find(misc => misc.name === 'Calcium Chloride (CaCl2)')?.amount || 0;
  return +water.chloride + (606.66 * 1000 * (salt / waterAmount)) + (482.28 * 1000 * (calciumChloride / waterAmount));
}

function calculateSulfate(water: Water, agents: Misc[]) {
  const waterAmount = water.amount!;
  const gypsum = agents.find(misc => misc.name === 'Gypsum (CaSO4)')?.amount || 0;
  const salt = agents.find(misc => misc.name === 'Epsom Salt (MgSO4)')?.amount || 0;
  return +water.sulfate + (557.93 * 1000 * (gypsum / waterAmount)) + (389.73 * 1000 * (salt / waterAmount));
}
