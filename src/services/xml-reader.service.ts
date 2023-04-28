import {Injectable} from '@angular/core';
import {StorageService} from "./storage.service";
import {HttpClient} from "@angular/common/http";

import {v4 as uuidv4} from "uuid";
import * as xml2js from 'xml2js';
import {BeerStyle, Fermentable, Hop, Yeast, Misc, MashProfile, Recipe} from "models";

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

  readRecipes(xml: string) {
    parseXMLtoRecipes(xml)
      .then((data) => {
        this.storage.addRecipes(data);
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
          description: item.NOTES?.[0],
          version: item.VERSION[0],
          maxInBatch: item.MAX_IN_BATCH?.[0],
          cost: item.COST?.[0]
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
          form: item.FORM?.[0],
          origin: item.ORIGIN?.[0],
          description: item.NOTES?.[0],
          version: item.VERSION[0],
          cost: item.COST?.[0]
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
          type: item.TYPE?.[0],
          form: item.FORM?.[0],
          lab: item.LABORATORY[0],
          productId: item.PRODUCT_ID[0],
          description: item.NOTES?.[0],
          minTemp: item.MIN_TEMPERATURE[0],
          maxTemp: item.MAX_TEMPERATURE[0],
          attenuation: item.ATTENUATION[0],
          maxAbv: item.MAX_ABV?.[0],
          cost: item.COST?.[0]
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
          description: item.NOTES?.[0],
          amountIsWeight: item.AMOUNT_IS_WEIGHT[0] === 'TRUE',
          cost: item.COST?.[0]
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

function parseXMLtoRecipes(data: string): Promise<Recipe[]> {
  return new Promise(resolve => {
    let k: string | number;
    const arr: Recipe[] = [],
      parser = new xml2js.Parser(
        {
          trim: true,
          explicitArray: true
        });
    parser.parseString(data, function (err, result) {
      const obj = result.RECIPES;
      for (k in obj.RECIPE) {
        const item = obj.RECIPE[k];
        arr.push({
          name: item.NAME[0],
          version: item.VERSION[0],
          ABV: item.EST_ABV?.[0],
          FG: item.EST_FG?.[0],
          OG: item.EST_OG?.[0],
          IBU: item.IBU?.[0],
          batchSize: item.BATCH_SIZE[0],
          boilSize: item.BOIL_SIZE[0],
          boilTime: item.BOIL_TIME[0],
          brewDate: item.DATE?.[0],
          brewer: item.BREWER[0],
          color: item.EST_COLOR?.[0],
          efficiency: item.EFFICIENCY[0],
          fermentables: item.FERMENTABLES[0]['FERMENTABLE']?.map((fermentable: any) => {
            return {
              name: fermentable.NAME[0],
              version: fermentable.VERSION[0],
              type: fermentable.TYPE[0],
              amount: fermentable.AMOUNT[0],
              yield: fermentable.YIELD[0],
              color: fermentable.COLOR[0],
              origin: fermentable.ORIGIN?.[0],
              supplier: fermentable.SUPPLIER?.[0],
              description: fermentable.NOTES?.[0],
              maxInBatch: fermentable.MAX_IN_BATCH?.[0],
              cost: item.COST?.[0]
            } as Fermentable;
          }) || [],
          hops: item.HOPS[0]['HOP']?.map((hop: any) => {
            return {
              name: hop.NAME[0],
              version: hop.VERSION[0],
              alpha: hop.ALPHA[0],
              amount: hop.AMOUNT[0],
              use: hop.USE[0],
              time: hop.USE[0] === 'Dry Hop' ? Number(hop.TIME[0]) / 24 / 60 : hop.TIME?.[0],
              type: hop.TYPE?.[0],
              form: hop.FORM?.[0],
              description: hop.NOTES?.[0],
              cost: item.COST?.[0]
            } as Hop;
          }) || [],
          mashProfile: {
            name: item.MASH[0].NAME[0],
            version: item.MASH[0].VERSION[0],
            grainTemp: item.MASH[0].GRAIN_TEMP[0],
            mashSteps: item.MASH[0].MASH_STEPS[0]['MASH_STEP']?.map((step: MashProfileXml) => {
              return {
                name: step.NAME[0],
                version: step.VERSION[0],
                type: step.TYPE[0],
                infuseAmount: step.INFUSE_AMOUNT?.[0],
                stepTime: step.STEP_TIME[0],
                stepTemp: step.STEP_TEMP[0],
                description: step.DESCRIPTION?.[0],
                rampTime: step.RAMP_TIME?.[0],
                endTemp: step.END_TEMP?.[0]
              }
            }),
            notes: item.MASH[0].NOTES?.[0]
          } as MashProfile,
          measuredFG: item.FG?.[0] ? Math.round(item.FG[0] * 1000) / 1000 : undefined,
          measuredOG: item.OG?.[0] ? Math.round(item.OG[0] * 1000) / 1000 : undefined,
          measuredVol: item.ACTUAL_SIZE?.[0],
          miscs: item.MISCS[0]['MISC']?.map((misc: any) => {
            return {
              name: misc.NAME[0],
              version: misc.VERSION[0],
              amount: misc.AMOUNT[0],
              use: misc.USE[0],
              time: misc.TIME?.[0],
              type: misc.TYPE[0],
              description: misc.NOTES?.[0],
              amountIsWeight: misc.AMOUNT_IS_WEIGHT?.[0],
              cost: item.COST?.[0]
            } as Misc;
          }) || [],
          notes: item.NOTES?.[0],
          style: {
            name: item.STYLE[0]?.NAME[0],
            type: item.STYLE[0]?.TYPE[0],
            category: item.STYLE[0]?.CATEGORY?.[0],
            categoryNumber: item.STYLE[0]?.CATEGORY_NUMBER?.[0],
            examples: item.STYLE[0]?.EXAMPLES?.[0],
            ingredients: item.STYLE[0]?.INGREDIENTS?.[0],
            maxAbv: item.STYLE[0]?.ABV_MAX[0],
            maxColor: item.STYLE[0]?.COLOR_MAX[0],
            maxFg: item.STYLE[0]?.FG_MAX[0],
            maxIbu: item.STYLE[0]?.IBU_MAX[0],
            maxOg: item.STYLE[0]?.OG_MAX[0],
            minAbv: item.STYLE[0]?.ABV_MIN[0],
            minColor: item.STYLE[0]?.COLOR_MIN[0],
            minFg: item.STYLE[0]?.FG_MIN[0],
            minIbu: item.STYLE[0]?.IBU_MIN[0],
            minOg: item.STYLE[0]?.OG_MIN[0],
            notes: item.STYLE[0]?.NOTES?.[0],
            profile: item.STYLE[0]?.PROFILE?.[0],
            styleGuide: item.STYLE[0]?.STYLE_GUIDE?.[0],
            styleLetter: item.STYLE[0]?.STYLE_LETTER?.[0],
            version: item.STYLE[0]?.VERSION[0]
          },
          type: item.TYPE[0],
          uid: uuidv4() as string,
          waters: [],
          yeasts: item.YEASTS[0]['YEAST']?.map((yeast: any) => {
            return {
              name: yeast.NAME[0],
              version: yeast.VERSION[0],
              type: yeast.TYPE[0],
              form: yeast.FORM?.[0],
              amount: yeast.AMOUNT?.[0],
              lab: yeast.LABORATORY?.[0],
              productId: yeast.PRODUCT_ID?.[0],
              minTemp: yeast.MIN_TEMPERATURE[0],
              maxTemp: yeast.MAX_TEMPERATURE[0],
              attenuation: yeast.ATTENUATION[0],
              maxAbv: yeast.MAX_ABV?.[0],
              description: yeast.NOTES?.[0],
              cost: item.COST?.[0]
            } as Yeast;
          }) || [],
        });
      }
      resolve(arr);
    });
  });
}
