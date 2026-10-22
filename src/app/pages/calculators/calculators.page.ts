import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {AbvCardComponent} from "./abv-card/abv-card.component";
import {HydrometerCardComponent} from "./hydrometer-card/hydrometer-card.component";
import {RefractometerCardComponent} from "./refractometer-card/refractometer-card.component";
import {ConversionCardComponent} from "./conversion-card/conversion-card.component";
import {Settings} from "models";
import {StorageService} from "services";
import {
  IonButtons,
  IonContent,
  IonHeader, IonIcon, IonLabel,
  IonMenuButton,
  IonSegment, IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToolbar
} from "@ionic/angular";

@Component({
  selector: 'calculators-page',
  templateUrl: 'calculators.page.html',
  styleUrls: ['calculators.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AbvCardComponent, HydrometerCardComponent, RefractometerCardComponent, ConversionCardComponent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner, IonSegment, IonSegmentButton, IonIcon, IonLabel]
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
