import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService} from "../../services/storage.service";
import {XmlReaderService} from "../../services/xml-reader.service";
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'settings-page',
  templateUrl: 'settings.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class SettingsPage {
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

  initStyles() {
    this.xmlReader.initStyles();
  }

  generate() {
    this.storage.addRecipe(
      {
        uid: uuidv4() as string,
        ABV: Math.round(Math.random() * 25 + 40) / 10,
        FG: 0,
        IBU: Math.round(Math.random() * 40 + 20),
        OG: 0,
        batchSize: 10,
        boilSize: 0,
        boilTime: 0,
        brewDate: new Date().toISOString().slice(0, 10),
        brewer: "",
        color: Math.round(Math.random() * 10 + 2),
        efficiency: 0,
        fermentables: [],
        hops: [],
        mashProfile: {
          name: '',
          version: 0,
          grainTemp: 20,
          mashSteps: [],
          tunTemp: 20,
          spargeTemp: 50,
          pH: 7,
          tunWeight: 1,
          tunSpecificHeat: 1,
          notes: '',
          equipAdjust: false,
          id: 1,
          mashType: 'Infusion',
          spargeType: 'Batch'
        },
        measuredFG: 0,
        measuredOG: 0,
        measuredVol: 0,
        miscs: [],
        waters: [],
        yeasts: [],
        name: 'Test',
        version: 1,
        type: 'All Grain',
        style: {
          name: 'Pale Ale',
          category: 'Ale',
          categoryNumber: 1,
          version: 1,
          styleLetter: 'A',
          styleGuide: 'B',
          type: 'Ale',
          notes: '',
          profile: 'a',
          ingredients: '',
          examples: '',
          minOg: 1.0,
          maxOg: 1.1,
          minFg: 1.0,
          maxFg: 1.1,
          minAbv: 4,
          maxAbv: 6,
          minIbu: 1,
          maxIbu: 50,
          minColor: 2,
          maxColor: 12
        }
      }
    );
  }
}
