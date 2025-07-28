import {Component, inject} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AbvCardComponent} from "./abv-card/abv-card.component";
import {NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {HydrometerCardComponent} from "./hydrometer-card/hydrometer-card.component";
import {RefractometerCardComponent} from "./refractometer-card/refractometer-card.component";
import {ConversionCardComponent} from "./conversion-card/conversion-card.component";
import {Settings} from "models";
import {StorageService} from "services";

@Component({
  selector: 'calculators-page',
  templateUrl: 'calculators.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, AbvCardComponent, NgIf, NgSwitchCase, NgSwitch, HydrometerCardComponent, RefractometerCardComponent, ConversionCardComponent]
})
export class CalculatorsPage {
  private storage = inject(StorageService);


  activeTab = 'abv';
  showSpinner = false;
  settings?: Settings;

  ionViewWillEnter() {
    this.showSpinner = true;
    this.storage.get('settings')?.then((response) => {
      this.settings = response;
    })
  }

  ionViewDidEnter() {
    setTimeout(() => this.showSpinner = false, 250);
  }

  tabChanged(event: any) {
    this.activeTab = event.detail.value
  }
}
