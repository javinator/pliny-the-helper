import {Injectable} from '@angular/core';
import {StorageService} from "./storage.service";
import {HttpClient} from "@angular/common/http";

import {saveAs} from 'file-saver';
import {Recipe} from "../models/recipe.model";
import {BeerStyle} from "../models/beer-style.model";
import {Hop} from "../models/hop.model";
import {Fermentable} from "../models/fermentable.model";
import {Yeast} from "../models/yeast.model";
import {Misc} from "../models/misc.model";
import {MashProfile} from "../models/mash-profile.model";

@Injectable({
  providedIn: 'root',
})
export class XmlWriterService {
  recipesToXml(recipes: Recipe[]) {
    let content = '<?xml version="1.0" encoding="UTF-8"?>\n<RECIPES>\n';
    recipes.forEach((recipe) => {
      content += recipeToXmlText(recipe);
    })
    content += '</RECIPES>';
    let xml = new Blob([content], {type: "text/xml"});
    saveAs(xml, "export.xml");
  }
}

function recipeToXmlText(recipe: Recipe) {
  let content = '<RECIPE>\n';
  content += '<NAME>' + recipe.name + '</NAME>\n';
  content += '<VERSION>1</VERSION>\n';
  content += '<TYPE>' + recipe.type + '</TYPE>\n';
  content += styleToXmlText(recipe.style);
  content += '<BREWER>' + recipe.brewer + '</BREWER>\n';
  content += '<BATCH_SIZE>' + recipe.batchSize + '</BATCH_SIZE>\n';
  content += '<BOIL_SIZE>' + recipe.boilSize + '</BOIL_SIZE>\n';
  content += '<BOIL_TIME>' + recipe.boilTime + '</BOIL_TIME>\n';
  content += '<EFFICIENCY>' + recipe.efficiency + '</EFFICIENCY>\n';
  content += '<HOPS>';
  recipe.hops.forEach((hop) => content += hopToXmlText(hop));
  content += '</HOPS>';
  content += '<FERMENTABLES>';
  recipe.fermentables.forEach((ferm) => content += fermentableToXmlText(ferm));
  content += '</FERMENTABLES>';
  content += '<YEASTS>';
  recipe.yeasts.forEach((yeast) => content += yeastToXmlText(yeast));
  content += '</YEASTS>';
  content += '<MISCS>';
  recipe.miscs.forEach((misc) => content += miscToXmlText(misc));
  content += '</MISCS>';
  content += '<WATERS></WATERS>'
  content += mashToXmlText(recipe.mashProfile);
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
    content += '<IBU_MIN>' + style.minIbu + '</IBU_MIN>\n';
    content += '<IBU_MAX>' + style.maxIbu + '</IBU_MAX>\n';
    content += '<COLOR_MIN>' + style.minColor + '</COLOR_MIN>\n';
    content += '<COLOR_MAX>' + style.maxColor + '</COLOR_MAX>\n';
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
  content += '<TIME>' + hop.time + '</TIME>\n';
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
  return content;
}

function yeastToXmlText(yeast: Yeast) {
  let content = '<YEAST>\n';
  content += '<NAME>' + yeast.name + '</NAME>\n';
  content += '<VERSION>1</VERSION>\n';
  content += '<TYPE>' + yeast.type + '</TYPE>\n';
  content += '<FORM>' + yeast.form + '</FORM>\n';
  content += '<AMOUNT>' + yeast.amount + '</AMOUNT>\n';
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
  if (yeast.description) {
    content += '<NOTES>' + yeast.description + '</NOTES>\n';
  }
  content += '</YEAST>\n';
  return content;
}

function miscToXmlText(misc: Misc) {
  let content = '<YEAST>\n';
  content += '<NAME>' + misc.name + '</NAME>\n';
  content += '<VERSION>1</VERSION>\n';
  content += '<TYPE>' + misc.type + '</TYPE>\n';
  content += '<USE>' + misc.use + '</USE>\n';
  content += '<TIME>' + misc.time + '</TIME>\n';
  content += '<AMOUNT>' + misc.amount + '</AMOUNT>\n';
  if (misc.amountIsWeight) {
    content += '<AMOUNT_IS_WEIGHT>' + misc.amountIsWeight + '</AMOUNT_IS_WEIGHT>\n';
  }
  if (misc.description) {
    content += '<NOTES>' + misc.description + '</NOTES>\n';
  }
  content += '</YEAST>\n';
  return content;
}

function mashToXmlText(mash?: MashProfile) {
  let content = '<MASH>\n';
  if (mash) {
    content += '<NAME>' + mash.name + '</NAME>\n';
    content += '<VERSION>1</VERSION>\n';
  }
  content += '</MASH>\n';
  return content;
}
