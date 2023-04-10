import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService} from "../../services/storage.service";
import {XmlReaderService} from "../../services/xml-reader.service";

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
}
