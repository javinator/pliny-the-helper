import {Injectable} from '@angular/core';
import {StorageService} from "./storage.service";
import {HttpClient} from "@angular/common/http";

import * as xml2js from 'xml2js';
import {BeerStyle} from "../models/beer-style.model";
import {Fermentable} from "../models/fermentable.model";
import {Hop} from "../models/hop.model";
import {Yeast} from "../models/yeast.model";
import {Misc} from "../models/misc.model";
import {MashProfile} from "../models/mash-profile.model";

interface MashProfileXml {
  NAME: string[];
  VERSION: number[];
  TYPE: string[];
  INFUSE_AMOUNT: number[];
  STEP_TIME: number[];
  STEP_TEMP: number[];
  DESCRIPTION: string[];
  RAMP_TIME: number[];
  END_TEMP: number[];
}

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
        parseXMLtoStyles(xml)
          .then((data) => {
            this.storage.setStyles(data);
          });
      });
  }

  initFermentables() {
    this.http
      .get("/assets/xml/fermentables.xml", {responseType: 'text'})
      .subscribe((xml) => {
        parseXMLtoFermentables(xml)
          .then((data) => {
            this.storage.setFermentables(data);
          });
      });
  }

  initHops() {
    this.http
      .get("/assets/xml/hops.xml", {responseType: 'text'})
      .subscribe((xml) => {
        parseXMLtoHops(xml)
          .then((data) => {
            this.storage.setHops(data);
          });
      });
  }

  initYeasts() {
    this.http
      .get("/assets/xml/yeasts.xml", {responseType: 'text'})
      .subscribe((xml) => {
        parseXMLtoYeasts(xml)
          .then((data) => {
            this.storage.setYeasts(data);
          });
      });
  }

  initMiscs() {
    this.http
      .get("/assets/xml/miscs.xml", {responseType: 'text'})
      .subscribe((xml) => {
        parseXMLtoMiscs(xml)
          .then((data) => {
            this.storage.setMiscs(data);
          });
      });
  }

  initMashProfiles() {
    this.http
      .get("/assets/xml/mashprofiles.xml", {responseType: 'text'})
      .subscribe((xml) => {
        parseXMLtoMashProfiles(xml)
          .then((data) => {
            this.storage.setMashProfiles(data);
          });
      });
  }
}

function parseXMLtoStyles(data: string): Promise<BeerStyle[]> {
  return new Promise(resolve => {
    let k: string | number;
    const arr: BeerStyle[] = [],
      parser = new xml2js.Parser(
        {
          trim: true,
          explicitArray: true
        });
    parser.parseString(data, function (err, result) {
      const obj = result.STYLES;
      for (k in obj.STYLE) {
        const item = obj.STYLE[k];
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

function parseXMLtoFermentables(data: string): Promise<Fermentable[]> {
  return new Promise(resolve => {
    let k: string | number;
    const arr: Fermentable[] = [],
      parser = new xml2js.Parser(
        {
          trim: true,
          explicitArray: true
        });
    parser.parseString(data, function (err, result) {
      const obj = result.FERMENTABLES;
      for (k in obj.FERMENTABLE) {
        const item = obj.FERMENTABLE[k];
        arr.push({
          name: item.NAME[0],
          type: item.TYPE[0],
          yield: item.YIELD[0],
          color: item.COLOR[0],
          origin: item.ORIGIN?.[0],
          supplier: item.SUPPLIER?.[0],
          description: item.NOTES[0],
          version: item.VERSION[0],
          maxInBatch: item.MAX_IN_BATCH?.[0]
        });
      }
      resolve(arr);
    });
  });
}

function parseXMLtoHops(data: string): Promise<Hop[]> {
  return new Promise(resolve => {
    let k: string | number;
    const arr: Hop[] = [],
      parser = new xml2js.Parser(
        {
          trim: true,
          explicitArray: true
        });
    parser.parseString(data, function (err, result) {
      const obj = result.HOPS;
      for (k in obj.HOP) {
        const item = obj.HOP[k];
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

function parseXMLtoYeasts(data: string): Promise<Yeast[]> {
  return new Promise(resolve => {
    let k: string | number;
    const arr: Yeast[] = [],
      parser = new xml2js.Parser(
        {
          trim: true,
          explicitArray: true
        });
    parser.parseString(data, function (err, result) {
      const obj = result.YEASTS;
      for (k in obj.YEAST) {
        const item = obj.YEAST[k];
        arr.push({
          name: item.NAME[0],
          version: item.VERSION[0],
          type: item.TYPE[0],
          form: item.FORM[0],
          lab: item.LABORATORY[0],
          productId: item.PRODUCT_ID[0],
          description: item.NOTES[0],
          minTemp: item.MIN_TEMPERATURE[0],
          maxTemp: item.MAX_TEMPERATURE[0],
          attenuation: item.ATTENUATION[0]
        });
      }
      resolve(arr);
    });
  });
}

function parseXMLtoMiscs(data: string): Promise<Misc[]> {
  return new Promise(resolve => {
    let k: string | number;
    const arr: Misc[] = [],
      parser = new xml2js.Parser(
        {
          trim: true,
          explicitArray: true
        });
    parser.parseString(data, function (err, result) {
      const obj = result.MISCS;
      for (k in obj.MISC) {
        const item = obj.MISC[k];
        arr.push({
          name: item.NAME[0],
          version: item.VERSION[0],
          type: item.TYPE[0],
          use: item.USE[0],
          description: item.NOTES[0],
          amountIsWeight: item.AMOUNT_IS_WEIGHT[0] === 'TRUE'
        });
      }
      resolve(arr);
    });
  });
}

function parseXMLtoMashProfiles(data: string): Promise<MashProfile[]> {
  return new Promise(resolve => {
    let k: string | number;
    const arr: MashProfile[] = [],
      parser = new xml2js.Parser(
        {
          trim: true,
          explicitArray: true
        });
    parser.parseString(data, function (err, result) {
      const obj = result.MASHS;
      for (k in obj.MASH) {
        const item = obj.MASH[k];
        arr.push({
          name: item.NAME[0],
          version: item.VERSION[0],
          grainTemp: item.GRAIN_TEMP[0],
          mashSteps: item.MASH_STEPS[0]['MASH_STEP'].map((step: MashProfileXml) => {
            return {
              name: step.NAME[0],
              version: step.VERSION[0],
              type: step.TYPE[0],
              infuseAmount: step.INFUSE_AMOUNT?.[0],
              stepTime: step.STEP_TIME[0],
              stepTemp: step.STEP_TEMP[0],
              notes: step.DESCRIPTION?.[0],
              rampTime: step.RAMP_TIME?.[0],
              endTemp: step.END_TEMP?.[0]
            }
          }),
          notes: item.NOTES[0]
        });
      }
      resolve(arr);
    });
  });
}
