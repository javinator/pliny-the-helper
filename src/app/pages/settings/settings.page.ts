import {Component, inject} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService, XmlReaderService} from "services";
import {Fermentable, Hop, Misc, Recipe, Settings, Yeast} from "models";
import {FormsModule} from "@angular/forms";
import {CONFIG} from "../../app.constants";
import {RecipeUtil} from "utils";


@Component({
  selector: 'settings-page',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class SettingsPage {
  private storage = inject(StorageService);
  private xmlReader = inject(XmlReaderService);

  settings: Settings = {};
  isToastOpen = false;
  showSpinner = false;
  showDeveloperOptions = false;
  version = '1.7.5';

  ionViewWillEnter() {
    this.showSpinner = true;
    this.storage.get('settings')?.then((response: Settings) => {
      this.settings.brewer = response?.brewer || CONFIG.defaultName;
      this.settings.batchSize = response?.batchSize || CONFIG.defaultBatchSize;
      this.settings.boilTime = response?.boilTime || CONFIG.defaultBoilTime;
      this.settings.efficiency = response?.efficiency || CONFIG.defaultEfficiency;
      this.settings.evaporation = response?.evaporation || CONFIG.evaporation;
      this.settings.wortCorrectionFactor = response?.wortCorrectionFactor || CONFIG.defaultWFC;
      this.settings.displayCost = response?.displayCost || false;
      this.settings.minimizeExport = response?.minimizeExport || false;
      this.settings.developerOptions = response?.developerOptions || false;
      this.showDeveloperOptions = response?.developerOptions || false;
      this.settings.hideDescription = response?.hideDescription || false;
    });
  }

  ionViewDidEnter() {
    setTimeout(() => this.showSpinner = false, 500);
  }

  clearDb() {
    this.showSpinner = true;
    this.storage.clearDb();
    setTimeout(() => {
      this.settings.brewer = CONFIG.defaultName;
      this.settings.batchSize = CONFIG.defaultBatchSize;
      this.settings.boilTime = CONFIG.defaultBoilTime;
      this.settings.efficiency = CONFIG.defaultEfficiency;
      this.settings.evaporation = CONFIG.evaporation;
      this.settings.displayCost = false;
      this.settings.minimizeExport = true;
      this.settings.developerOptions = false;
      this.settings.hideDescription = false;
    }, 100);
    this.init();
  }

  init() {
    this.showSpinner = true;
    this.xmlReader.initStyles();
    this.xmlReader.initFermentables();
    this.xmlReader.initHops();
    this.xmlReader.initYeasts();
    this.xmlReader.initMiscs();
    setTimeout(() => {
      this.showSpinner = false;
    }, 250);
  }

  saveSettings() {
    this.storage.setSettings(this.settings)?.then(() => this.isToastOpen = true);
    this.showDeveloperOptions = this.settings?.developerOptions || false;
  }

  closeToast() {
    this.isToastOpen = false;
  }

  deleteDuplicates() {
    this.storage.get('recipes')?.then((response: Recipe[]) => {
      if (response) {
        this.showSpinner = true;
        let uniqueRecipes: Recipe[] = [];
        response.forEach((item) => {
          if (!uniqueRecipes.map((recipe) => recipe.name).includes(item.name)) {
            uniqueRecipes.push(item);
          } else {
            console.log('Recipe \'' + item.name + '\' removed');
          }
        });
        this.storage.set('recipes', uniqueRecipes)?.then(() => {
          setTimeout(() => this.showSpinner = false, 250);
        });
      } else {
        console.log('No recipes to check for duplicates!')
      }
    })
  }

  recalculateCosts() {
    this.storage.get('recipes')?.then((response: Recipe[]) => {
      if (response) {
        response.forEach((recipe) => {
          recipe.carbonation = recipe.carbonation || RecipeUtil.calculateCarbonation(recipe.style);
        })
        this.showSpinner = true;
        this.storage.get('fermentables')?.then((fermentables: Fermentable[]) => {
          setTimeout(() => {
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
          }, 100);
        })
        this.storage.get('hops')?.then((hops: Hop[]) => {
          setTimeout(() => {
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
          }, 100);
        })
        this.storage.get('yeasts')?.then((yeasts: Yeast[]) => {
          setTimeout(() => {
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
          }, 100);
        })
        this.storage.get('miscs')?.then((miscs: Misc[]) => {
          setTimeout(() => {
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
          }, 100);
        })
        setTimeout(() => {
          this.storage.deleteRecipes()?.then(() => {
            this.storage.addRecipes(response)?.then(() => {
              this.showSpinner = false;
            });
          })
        }, 1000);
      } else {
        console.log('No recipes to recalculate!')
      }
    });
  }
}
