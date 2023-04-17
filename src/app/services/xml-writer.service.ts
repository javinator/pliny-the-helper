import {Injectable} from '@angular/core';
import {StorageService} from "./storage.service";
import {HttpClient} from "@angular/common/http";

import {saveAs} from 'file-saver';
import {Recipe} from "../models/recipe.model";
import {BeerStyle} from "../models/beer-style.model";

@Injectable({
  providedIn: 'root',
})
export class XmlWriterService {

  constructor(private http: HttpClient) {
  }

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
