import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService, XmlReaderService} from "services";
import {Recipe, Settings} from "models";
import {FormsModule} from "@angular/forms";
import {CONFIG} from "../../app.constants";
import {NgIf} from "@angular/common";


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
  isAdmin = true;
  version = '0.1.0';

  constructor(private storage: StorageService, private xmlReader: XmlReaderService) {
  }

  public deleteButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.storage.deleteRecipes();
      }
    }
  ];

  public clearButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.storage.clearDb();
      }
    }
  ];

  ionViewWillEnter() {
    this.storage.get('settings')?.then((response: Settings) => {
      this.settings.brewer = response.brewer || CONFIG.defaultName;
      this.settings.batchSize = response.batchSize || CONFIG.defaultBatchSize;
      this.settings.boilTime = response.boilTime || CONFIG.defaultBoilTime;
      this.settings.efficiency = response.efficiency || CONFIG.defaultEfficiency;
      this.settings.displayCost = response.displayCost || false;
    });
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
}
