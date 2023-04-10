import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AbvCardComponent} from "./abv-card/abv-card.component";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {HydrometerCardComponent} from "./hydrometer-card/hydrometer-card.component";
import {StorageService} from "../../services/storage.service";
import {RefractometerCardComponent} from "./refractometer-card/refractometer-card.component";
import {TemperatureCardComponent} from "./temperature-card/temperature-card.component";

@Component({
  selector: 'calculators-page',
  templateUrl: 'calculators.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, AbvCardComponent, NgIf, NgForOf, NgSwitchCase, NgSwitch, HydrometerCardComponent, RefractometerCardComponent, TemperatureCardComponent]
})
export class CalculatorsPage {
  constructor(private storage: StorageService) {
  }

  activeTab = 'abv';

  tabChanged(event: any) {
    this.activeTab = event.detail.value
  }
}
