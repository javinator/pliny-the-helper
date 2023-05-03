import {Injectable} from '@angular/core';
import {BeerStyle, Fermentable, Hop, MashProfile, MashStep, Misc, Recipe, Yeast} from "models";
import {Directory, Encoding, Filesystem} from '@capacitor/filesystem';
import {Platform} from "@ionic/angular";
import {saveAs} from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class XmlWriterService {
  constructor(public platform: Platform) {
  }

  recipesToXml(recipes: Recipe[]) {
    let content = '<?xml version="1.0" encoding="UTF-8"?>\n<RECIPES>\n';
    recipes.forEach((recipe) => {
      content += recipeToXmlText(recipe);
    })
    content += '</RECIPES>';
    const today = new Date();
    const date = today.getFullYear() + '-'
      + (today.getMonth() + 1).toString().padStart(2, '0') + '-'
      + today.getDate().toString().padStart(2, '0');
    const filename = "pliny-export-" + date + ".xml"
    if (this.platform.is('hybrid')) {
      Filesystem.writeFile({
        path: filename,
        data: content,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      })
    } else {
      saveAs(new Blob([content], {type: "text/xml"}), filename);
    }
  }
}

function recipeToXmlText(recipe: Recipe) {
  let content = '<RECIPE>\n';
  content += '<NAME>' + recipe.name + '</NAME>\n';
  content += '<VERSION>1</VERSION>\n';
  content += '<TYPE>' + recipe.type + '</TYPE>\n';
  content += styleToXmlText(recipe.style);
  content += '<BREWER>' + recipe.brewer + '</BREWER>\n';
  content += '<DATE>' + recipe.brewDate + '</DATE>\n';
  content += '<BATCH_SIZE>' + recipe.batchSize + '</BATCH_SIZE>\n';
  content += '<BOIL_SIZE>' + recipe.boilSize + '</BOIL_SIZE>\n';
  content += '<BOIL_TIME>' + recipe.boilTime + '</BOIL_TIME>\n';
  content += '<EFFICIENCY>' + recipe.efficiency + '</EFFICIENCY>\n';
  if (recipe.carbonation) {
    content += '<CARBONATION>' + recipe.carbonation + '</CARBONATION>\n';
  }
  if (recipe.forcedCarbonation) {
    content += '<FORCED_CARBONATION>' + String(recipe.forcedCarbonation).toUpperCase() + '</FORCED_CARBONATION>\n';
  }
  content += '<HOPS>\n';
  recipe.hops.forEach((hop) => content += hopToXmlText(hop));
  content += '</HOPS>\n';
  content += '<FERMENTABLES>\n';
  recipe.fermentables.forEach((ferm) => content += fermentableToXmlText(ferm));
  content += '</FERMENTABLES>\n';
  content += '<YEASTS>\n';
  recipe.yeasts.forEach((yeast) => content += yeastToXmlText(yeast));
  content += '</YEASTS>\n';
  content += '<MISCS>\n';
  recipe.miscs.forEach((misc) => content += miscToXmlText(misc));
  content += '</MISCS>\n';
  content += '<WATERS></WATERS>\n';
  content += mashToXmlText(recipe.mashProfile);
  if (recipe.notes) {
    content += '<NOTES>' + recipe.notes + '</NOTES>\n';
  }
  content += '<EST_OG>' + recipe.OG.toFixed(3) + '</EST_OG>\n';
  content += '<EST_FG>' + recipe.FG.toFixed(3) + '</EST_FG>\n';
  content += '<EST_COLOR>' + recipe.color.toFixed(1) + '</EST_COLOR>\n';
  content += '<IBU>' + recipe.IBU.toFixed(2) + '</IBU>\n';
  content += '<IBU_METHOD>Tinseth</IBU_METHOD>\n';
  content += '<EST_ABV>' + recipe.ABV.toFixed(2) + '</EST_ABV>\n';
  if (recipe.measuredOG) {
    content += '<OG>' + recipe.measuredOG + '</OG>\n';
  }
  if (recipe.measuredFG) {
    content += '<FG>' + recipe.measuredFG + '</FG>\n';
  }
  if (recipe.measuredVol) {
    content += '<ACTUAL_SIZE>' + recipe.measuredVol + '</ACTUAL_SIZE>\n';
  }
  content += '</RECIPE>\n';
  return content;
}

function styleToXmlText(style?: BeerStyle) {
  let content = '<STYLE>\n';
  if (style) {
    content += '<NAME>' + style.name + '</NAME>\n';
    content += '<VERSION>1</VERSION>\n';
    content += '<CATEGORY>' + style.category + '</CATEGORY>\n';
    content += '<CATEGORY_NUMBER>' + style.categoryNumber + '</CATEGORY_NUMBER>\n';
    content += '<STYLE_LETTER>' + style.styleLetter + '</STYLE_LETTER>\n';
    content += '<STYLE_GUIDE>' + style.styleGuide + '</STYLE_GUIDE>\n';
    content += '<TYPE>' + style.type + '</TYPE>\n';
    content += '<OG_MIN>' + style.minOg + '</OG_MIN>\n';
    content += '<OG_MAX>' + style.maxOg + '</OG_MAX>\n';
    content += '<FG_MIN>' + style.minFg + '</FG_MIN>\n';
    content += '<FG_MAX>' + style.maxFg + '</FG_MAX>\n';
    content += '<ABV_MIN>' + style.minAbv + '</ABV_MIN>\n';
    content += '<ABV_MAX>' + style.maxAbv + '</ABV_MAX>\n';
    content += '<IBU_MIN>' + style.minIbu + '</IBU_MIN>\n';
    content += '<IBU_MAX>' + style.maxIbu + '</IBU_MAX>\n';
    content += '<COLOR_MIN>' + style.minColor + '</COLOR_MIN>\n';
    content += '<COLOR_MAX>' + style.maxColor + '</COLOR_MAX>\n';
    if (style.notes) {
      content += '<NOTES>' + style.notes + '</NOTES>\n';
    }
    if (style.profile) {
      content += '<PROFILE>' + style.profile + '</PROFILE>\n';
    }
    if (style.ingredients) {
      content += '<INGREDIENTS>' + style.ingredients + '</INGREDIENTS>\n';
    }
    if (style.minCarb) {
      content += '<CARB_MIN>' + style.minCarb + '</CARB_MIN>\n';
    }
    if (style.maxCarb) {
      content += '<CARB_MAX>' + style.maxCarb + '</CARB_MAX>\n';
    }
  } else {
    content += '<NAME>Other</NAME>\n';
  }
  content += '</STYLE>\n';
  return content;
}

function hopToXmlText(hop: Hop) {
  let content = '<HOP>\n';
  content += '<NAME>' + hop.name + '</NAME>\n';
  content += '<VERSION>1</VERSION>\n';
  content += '<ALPHA>' + hop.alpha + '</ALPHA>\n';
  content += '<AMOUNT>' + hop.amount + '</AMOUNT>\n';
  content += '<USE>' + hop.use + '</USE>\n';
  content += '<TIME>' + (hop.use === 'Dry Hop' ? (hop.time || 0) * 24 * 60 : hop.time) + '</TIME>\n';
  if (hop.description) {
    content += '<NOTES>' + hop.description + '</NOTES>\n';
  }
  if (hop.type) {
    content += '<TYPE>' + hop.type + '</TYPE>\n';
  }
  if (hop.form) {
    content += '<FORM>' + hop.form + '</FORM>\n';
  }
  if (hop.origin) {
    content += '<ORIGIN>' + hop.origin + '</ORIGIN>\n';
  }
  if (hop.substitutes) {
    content += '<SUBSTITUTES>' + hop.substitutes.join(',') + '</SUBSTITUTES>\n';
  }
  if (hop.cost) {
    content += '<COST>' + hop.cost + '</COST>\n';
  }
  content += '</HOP>\n';
  return content;
}

function fermentableToXmlText(fermentable: Fermentable) {
  let content = '<FERMENTABLE>\n';
  content += '<NAME>' + fermentable.name + '</NAME>\n';
  content += '<VERSION>1</VERSION>\n';
  content += '<TYPE>' + fermentable.type + '</TYPE>\n';
  content += '<AMOUNT>' + fermentable.amount + '</AMOUNT>\n';
  content += '<YIELD>' + fermentable.yield + '</YIELD>\n';
  content += '<COLOR>' + fermentable.color + '</COLOR>\n';
  if (fermentable.origin) {
    content += '<ORIGIN>' + fermentable.origin + '</ORIGIN>\n';
  }
  if (fermentable.supplier) {
    content += '<SUPPLIER>' + fermentable.supplier + '</SUPPLIER>\n';
  }
  if (fermentable.description) {
    content += '<NOTES>' + fermentable.description + '</NOTES>\n';
  }
  if (fermentable.maxInBatch) {
    content += '<MAX_IN_BATCH>' + fermentable.maxInBatch + '</MAX_IN_BATCH>\n';
  }
  content += '</FERMENTABLE>\n';
  if (fermentable.cost) {
    content += '<COST>' + fermentable.cost + '</COST>\n';
  }
  return content;
}

function yeastToXmlText(yeast: Yeast) {
  let content = '<YEAST>\n';
  content += '<NAME>' + yeast.name + '</NAME>\n';
  content += '<VERSION>1</VERSION>\n';
  content += '<TYPE>' + yeast.type + '</TYPE>\n';
  content += '<FORM>' + yeast.form + '</FORM>\n';
  content += '<AMOUNT>' + (yeast.amount || 1) + '</AMOUNT>\n';
  if (yeast.lab) {
    content += '<LABORATORY>' + yeast.lab + '</LABORATORY>\n';
  }
  if (yeast.productId) {
    content += '<PRODUCT_ID>' + yeast.productId + '</PRODUCT_ID>\n';
  }
  if (yeast.minTemp) {
    content += '<MIN_TEMPERATURE>' + yeast.minTemp + '</MIN_TEMPERATURE>\n';
  }
  if (yeast.maxTemp) {
    content += '<MAX_TEMPERATURE>' + yeast.maxTemp + '</MAX_TEMPERATURE>\n';
  }
  if (yeast.flocculation) {
    content += '<FLOCCULATION>' + yeast.flocculation + '</FLOCCULATION>\n';
  }
  if (yeast.attenuation) {
    content += '<ATTENUATION>' + yeast.attenuation + '</ATTENUATION>\n';
  }
  if (yeast.maxAbv) {
    content += '<MAX_ABV>' + yeast.maxAbv + '</MAX_ABV>\n';
  }
  if (yeast.description) {
    content += '<NOTES>' + yeast.description + '</NOTES>\n';
  }
  if (yeast.cost) {
    content += '<COST>' + yeast.cost + '</COST>\n';
  }
  content += '</YEAST>\n';
  return content;
}

function miscToXmlText(misc: Misc) {
  let content = '<MISC>\n';
  content += '<NAME>' + misc.name + '</NAME>\n';
  content += '<VERSION>1</VERSION>\n';
  content += '<TYPE>' + misc.type + '</TYPE>\n';
  content += '<USE>' + misc.use + '</USE>\n';
  content += '<TIME>' + misc.time + '</TIME>\n';
  content += '<AMOUNT>' + misc.amount + '</AMOUNT>\n';
  if (misc.amountIsWeight) {
    content += '<AMOUNT_IS_WEIGHT>' + String(misc.amountIsWeight).toUpperCase() + '</AMOUNT_IS_WEIGHT>\n';
  }
  if (misc.description) {
    content += '<NOTES>' + misc.description + '</NOTES>\n';
  }
  if (misc.cost) {
    content += '<COST>' + misc.cost + '</COST>\n';
  }
  content += '</MISC>\n';
  return content;
}

function mashToXmlText(mash?: MashProfile) {
  let content = '<MASH>\n';
  if (mash) {
    content += '<NAME>' + mash.name + '</NAME>\n';
    content += '<VERSION>1</VERSION>\n';
    content += '<GRAIN_TEMP>' + mash.grainTemp + '</GRAIN_TEMP>\n';
    content += '<MASH_STEPS>\n';
    mash.mashSteps.forEach((step) => content += mashStepToXmlText(step));
    content += '</MASH_STEPS>\n';
    if (mash.notes) {
      content += '<NOTES>' + mash.notes + '</NOTES>\n';
    }
  }
  content += '</MASH>\n';
  return content;
}

function mashStepToXmlText(step: MashStep) {
  let content = '<MASH_STEP>\n';
  content += '<NAME>' + step.name + '</NAME>\n';
  content += '<VERSION>1</VERSION>\n';
  content += '<TYPE>' + step.type + '</TYPE>\n';
  if (step.infuseAmount) {
    content += '<INFUSE_AMOUNT>' + step.infuseAmount + '</INFUSE_AMOUNT>\n';
  }
  content += '<STEP_TEMP>' + step.stepTemp + '</STEP_TEMP>\n';
  content += '<STEP_TIME>' + step.stepTime + '</STEP_TIME>\n';
  if (step.rampTime) {
    content += '<RAMP_TIME>' + step.rampTime + '</RAMP_TIME>\n';
  }
  if (step.endTemp) {
    content += '<END_TEMP>' + step.endTemp + '</END_TEMP>\n';
  }
  content += '</MASH_STEP>\n';
  return content;
}
