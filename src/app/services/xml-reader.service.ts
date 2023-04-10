import {Injectable} from '@angular/core';
import {StorageService} from "./storage.service";
import {HttpClient} from "@angular/common/http";

import * as xml2js from 'xml2js';
import {BeerStyle} from "../pages/models/beer-style.model";

@Injectable({
  providedIn: 'root',
})
export class XmlReaderService {

  constructor(private http: HttpClient, private storage: StorageService) {
  }

  initStyles() {
    this.http
      .get("/assets/xml/styles.xml", {responseType: 'text'})
      .subscribe((xml) => {
        this.parseXMLtoStyles(xml)
          .then((data) => {
            this.storage.setStyles(data);
          });
      });
  }

  private parseXMLtoStyles(data: string): Promise<BeerStyle[]> {
    return new Promise(resolve => {
      var k: string | number,
        arr: BeerStyle[] = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function (err, result) {
        var obj = result.STYLES;
        for (k in obj.STYLE) {
          var item = obj.STYLE[k];
          arr.push({
            name: item.NAME[0],
            type: item.TYPE[0],
            category: item.CATEGORY[0],
            categoryNumber: item.CATEGORY_NUMBER[0],
            examples: item.EXAMPLES[0],
            ingredients: item.INGREDIENTS[0],
            maxAbv: item.ABV_MAX[0],
            maxColor: item.COLOR_MAX[0],
            maxFg: item.FG_MAX[0],
            maxIbu: item.IBU_MAX[0],
            maxOg: item.OG_MAX[0],
            minAbv: item.ABV_MIN[0],
            minColor: item.COLOR_MIN[0],
            minFg: item.FG_MIN[0],
            minIbu: item.IBU_MIN[0],
            minOg: item.OG_MIN[0],
            notes: item.NOTES[0],
            profile: item.PROFILE[0],
            styleGuide: item.STYLE_GUIDE[0],
            styleLetter: item.STYLE_LETTER[0],
            version: item.VERSION[0]
          });
        }
        resolve(arr);
      });
    });
  }
}
