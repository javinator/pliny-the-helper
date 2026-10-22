import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {Router} from "@angular/router";
import {Location} from '@angular/common'
import {BeerStyle} from "models";
import {
  IonButton,
  IonButtons,
  IonCard, IonCardContent,
  IonCardHeader, IonCardTitle, IonCol,
  IonContent, IonGrid,
  IonHeader,
  IonIcon, IonRow,
  IonTitle,
  IonToolbar
} from "@ionic/angular";

@Component({
  selector: 'style-details-page',
  templateUrl: 'style-details.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonCardContent
  ]
})
export class StyleDetailsPage {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  constructor() {
    this.style = this.router.currentNavigation()?.extras.state?.['style'];
  }

  style!: BeerStyle;

  aroma() {
    return this.style.profile.slice(6, this.style.profile.indexOf('Appearance:'));
  }

  appearance() {
    return this.style.profile.slice(this.style.profile.indexOf('Appearance:') + 11, this.style.profile.indexOf('Flavor:'));
  }

  flavor() {
    return this.style.profile.slice(this.style.profile.indexOf('Flavor:') + 7, this.style.profile.indexOf('Mouthfeel:'));
  }

  mouthfeel() {
    return this.style.profile.slice(this.style.profile.indexOf('Mouthfeel:') + 10);
  }

  navigateBack() {
    this.location.back();
  }
}
