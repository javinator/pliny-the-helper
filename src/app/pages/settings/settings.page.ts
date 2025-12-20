import {Component, EventEmitter, inject, Output} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService, XmlReaderService, CloudStorageService} from "services";
import {Fermentable, Hop, Misc, Recipe, Settings, Water, Yeast} from "models";
import {FormsModule} from "@angular/forms";
import {CONFIG} from "../../app.constants";
import {RecipeUtil} from "utils";
import packageJson from 'packageJson';
import {catchError, of} from "rxjs";


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
  private cloudService = inject(CloudStorageService);
  @Output() updateNavigation = new EventEmitter<void>();

  settings: Settings = {};
  isToastOpen = false;
  isErrorToastOpen = false;
  showSpinner = false;
  showDeveloperOptions = false;
  showCloudSpinner = false;
  hasCloudError = false;
  version = packageJson.version;
  waterProfileOptions: string[] = [];

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
      this.settings.minimizeExport = response?.minimizeExport || true;
      this.settings.developerOptions = response?.developerOptions || false;
      this.showDeveloperOptions = response?.developerOptions || false;
      this.settings.hideDescription = response?.hideDescription || false;
      this.settings.cloudEmail = response?.cloudEmail;
      this.settings.cloudPassword = response?.cloudPassword;
      this.settings.useWaterChemistry = response?.useWaterChemistry || false;
      this.settings.defaultWaterProfile = response?.defaultWaterProfile || 'Distilled Water';
    });
    this.storage.get('waters')?.then((response: Water[]) => {
      this.waterProfileOptions = response.map(water => water.name).sort()
    })
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
      this.showDeveloperOptions = false;
      this.settings.cloudEmail = undefined;
      this.settings.cloudPassword = undefined;
      this.settings.useWaterChemistry = false;
      this.settings.defaultWaterProfile = 'Distilled Water';
    }, 100);
    this.updateNavigation.emit();
    this.init();
  }

  init() {
    this.showSpinner = true;
    this.xmlReader.initStyles();
    this.xmlReader.initFermentables();
    this.xmlReader.initHops();
    this.xmlReader.initYeasts();
    this.xmlReader.initMiscs();
    this.xmlReader.initMashProfiles()
    this.xmlReader.initWaters();
    setTimeout(() => {
      this.storage.get('waters')?.then((response: Water[]) => {
        this.waterProfileOptions = response.map(water => water.name).sort()
      })
    }, 1000);
    setTimeout(() => {
      this.showSpinner = false;
    }, 500);
  }

  saveSettings() {
    this.storage.setSettings(this.settings)?.then(() => {
      this.isToastOpen = true;
      this.updateNavigation.emit();
    });
    this.showDeveloperOptions = this.settings?.developerOptions || false;
  }

  closeToast() {
    this.isToastOpen = false;
  }

  closeErrorToast() {
    this.isErrorToastOpen = false;
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
                if (hop.alpha) {
                  nH.alpha = hop.alpha;
                }
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

  saveCloudSettings() {
    this.showCloudSpinner = true;
    if (!this.settings.cloudEmail && !this.settings.cloudPassword) {
      setTimeout(() => {
        this.saveSettings();
        this.hasCloudError = false;
        this.showCloudSpinner = false;
      }, 100);
      return;
    }
    this.cloudService.getRecipes(this.settings.cloudEmail || '', this.settings.cloudPassword || '').pipe(
      catchError(err => {
          console.warn(err);
          this.settings.cloudPassword = undefined;
          this.isErrorToastOpen = true;
          this.hasCloudError = true;
          this.showCloudSpinner = false;
          return of();
        }
      )
    ).subscribe(() => {
      setTimeout(() => {
        this.saveSettings();
        this.hasCloudError = false;
        this.showCloudSpinner = false;
      }, 100);
    })
  }
}
