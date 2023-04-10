import {Injectable} from '@angular/core';
import {StorageService} from "./storage.service";
import {HttpClient} from "@angular/common/http";

import * as xml2js from 'xml2js';
import {BeerStyle} from "../models/beer-style.model";
import {Fermentable} from "../models/fermentable.model";
import {Hop} from "../models/hop.model";

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

  initFermentables() {
    this.http
      .get("/assets/xml/fermentables.xml", {responseType: 'text'})
      .subscribe((xml) => {
        this.parseXMLtoFermentables(xml)
          .then((data) => {
            this.storage.setFermentables(data);
          });
      });
  }

  private parseXMLtoFermentables(data: string): Promise<Fermentable[]> {
    return new Promise(resolve => {
      var k: string | number,
        arr: Fermentable[] = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function (err, result) {
        var obj = result.FERMENTABLES;
        for (k in obj.FERMENTABLE) {
          var item = obj.FERMENTABLE[k];
          arr.push({
            name: item.NAME[0],
            type: item.TYPE[0],
            yield: item.YIELD[0],
            color: item.COLOR[0],
            origin: item.ORIGIN?.[0],
            description: item.NOTES[0],
            version: item.VERSION[0],
            maxInBatch: 100
          });
        }
        resolve(arr);
      });
    });
  }

  initHops() {
    this.http
      .get("/assets/xml/hops.xml", {responseType: 'text'})
      .subscribe((xml) => {
        this.parseXMLtoHops(xml)
          .then((data) => {
            this.storage.setHops(data);
          });
      });
  }

  private parseXMLtoHops(data: string): Promise<Hop[]> {
    return new Promise(resolve => {
      var k: string | number,
        arr: Hop[] = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function (err, result) {
        var obj = result.HOPS;
        for (k in obj.HOP) {
          var item = obj.HOP[k];
          arr.push({
            name: item.NAME[0],
            type: item.TYPE[0],
            alpha: item.ALPHA[0],
            use: item.USE[0],
            form: item.FORM[0],
            origin: item.ORIGIN?.[0],
            description: item.NOTES[0],
            version: item.VERSION[0]
          });
        }
        resolve(arr);
      });
    });
  }
}
