import {Component, inject} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AbvCardComponent} from "./abv-card/abv-card.component";
import {HydrometerCardComponent} from "./hydrometer-card/hydrometer-card.component";
import {RefractometerCardComponent} from "./refractometer-card/refractometer-card.component";
import {ConversionCardComponent} from "./conversion-card/conversion-card.component";
import {Settings} from "models";
import {StorageService} from "services";

@Component({
  selector: 'calculators-page',
  templateUrl: 'calculators.page.html',
  styleUrls: ['calculators.component.scss'],
  standalone: true,
  imports: [IonicModule, AbvCardComponent, HydrometerCardComponent, RefractometerCardComponent, ConversionCardComponent]
})
export class CalculatorsPage {
  private readonly storage = inject(StorageService);


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
