import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService, XmlReaderService} from "services";
import {Fermentable, Hop, Misc, Recipe, Settings, Yeast} from "models";
import {FormsModule} from "@angular/forms";
import {CONFIG} from "../../app.constants";
import {NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'settings-page',
  templateUrl: 'settings.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, NgIf]
})
export class SettingsPage {
  settings: Settings = {};
  isToastOpen = false;
  isAdmin = false;
  showSpinner = false;
  version = '0.1.0';

  constructor(private storage: StorageService, private xmlReader: XmlReaderService, private route: ActivatedRoute) {
  }

  ionViewWillEnter() {
    this.showSpinner = true;
    this.storage.get('settings')?.then((response: Settings) => {
      this.settings.brewer = response.brewer || CONFIG.defaultName;
      this.settings.batchSize = response.batchSize || CONFIG.defaultBatchSize;
      this.settings.boilTime = response.boilTime || CONFIG.defaultBoilTime;
      this.settings.efficiency = response.efficiency || CONFIG.defaultEfficiency;
      this.settings.displayCost = response.displayCost || false;
    });
  }

  ionViewDidEnter() {
    this.route.queryParams.subscribe(params => {
      this.isAdmin = params['admin'];
    })
    setTimeout(() => this.showSpinner = false, 500);
  }

  clearDb() {
    this.storage.clearDb();
  }

  init() {
    this.xmlReader.initStyles();
    this.xmlReader.initFermentables();
    this.xmlReader.initHops();
    this.xmlReader.initYeasts();
    this.xmlReader.initMiscs();
  }

  saveSettings() {
    this.storage.setSettings(this.settings)?.then(() => this.isToastOpen = true);
  }

  closeToast() {
    this.isToastOpen = false;
  }

  deleteDuplicates() {
    this.storage.get('recipes')?.then((response: Recipe[]) => {
      let uniqueRecipes: Recipe[] = [];
      response.forEach((item) => {
        if (!uniqueRecipes.map((recipe) => recipe.name).includes(item.name)) {
          uniqueRecipes.push(item);
        } else {
          console.log('Recipe \'' + item.name + '\' removed');
        }
      });
      this.storage.set('recipes', uniqueRecipes);
    })
  }

  recalculateCosts() {
    this.storage.get('recipes')?.then((response: Recipe[]) => {
      this.showSpinner = true;
      this.storage.get('fermentables')?.then((fermentables: Fermentable[]) => {
        let newRecipes: Recipe[] = [];
        response.forEach((recipe) => {
          let newFermentables: Fermentable[] = [];
          recipe.fermentables.forEach((fermentable) => {
            let nF = JSON.parse(JSON.stringify(fermentables.find((item) => item.name === fermentable.name) || fermentable));
            nF.amount = fermentable.amount;
            newFermentables.push(nF);
          })
          recipe.fermentables = newFermentables;
          newRecipes.push(recipe);
        })
        response = newRecipes;
      })
      this.storage.get('hops')?.then((hops: Hop[]) => {
        let newRecipes: Recipe[] = [];
        response.forEach((recipe) => {
          let newHops: Hop[] = [];
          recipe.hops.forEach((hop) => {
            let nH = JSON.parse(JSON.stringify(hops.find((item) => item.name === hop.name) || hop));
            nH.amount = hop.amount;
            nH.time = hop.time;
            nH.use = hop.use;
            newHops.push(nH);
          })
          recipe.hops = newHops;
          newRecipes.push(recipe);
        })
        response = newRecipes;
      })
      this.storage.get('yeasts')?.then((yeasts: Yeast[]) => {
        let newRecipes: Recipe[] = [];
        response.forEach((recipe) => {
          let newYeasts: Yeast[] = [];
          recipe.yeasts.forEach((yeast) => {
            let nY = JSON.parse(JSON.stringify(yeasts.find((item) => item.name === yeast.name) || yeast));
            nY.amount = yeast.amount;
            nY.attenuation = yeast.attenuation;
            newYeasts.push(nY)
          })
          recipe.yeasts = newYeasts;
          newRecipes.push(recipe);
        })
        response = newRecipes;
      })
      this.storage.get('miscs')?.then((miscs: Misc[]) => {
        let newRecipes: Recipe[] = [];
        response.forEach((recipe) => {
          let newMiscs: Misc[] = [];
          recipe.miscs.forEach((misc) => {
            let nM = JSON.parse(JSON.stringify(miscs.find((item) => item.name === misc.name) || misc));
            nM.amount = misc.amount;
            newMiscs.push(nM)
          })
          recipe.miscs = newMiscs;
          newRecipes.push(recipe);
        })
        response = newRecipes;
      })
      setTimeout(() => {
        this.storage.deleteRecipes()?.then(() => {
          this.storage.addRecipes(response)?.then(() => {
            this.showSpinner = false;
          });
        })
      }, 1000);
    });
  }
}
