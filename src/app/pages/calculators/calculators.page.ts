import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AbvCardComponent} from "./abv-card/abv-card.component";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {HydrometerCardComponent} from "./hydrometer-card/hydrometer-card.component";
import {RefractometerCardComponent} from "./refractometer-card/refractometer-card.component";
import {ConversionCardComponent} from "./conversion-card/conversion-card.component";

@Component({
  selector: 'calculators-page',
  templateUrl: 'calculators.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, AbvCardComponent, NgIf, NgForOf, NgSwitchCase, NgSwitch, HydrometerCardComponent, RefractometerCardComponent, ConversionCardComponent]
})
export class CalculatorsPage {
  activeTab = 'abv';

  tabChanged(event: any) {
    this.activeTab = event.detail.value
  }
}
