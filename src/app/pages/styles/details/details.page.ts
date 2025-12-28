import {Component, inject} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Router} from "@angular/router";
import {BeerStyle} from "models";

@Component({
  selector: 'style-details-page',
  templateUrl: 'details.page.html',
  standalone: true,
  imports: [IonicModule],
})
export class StyleDetailsPage {
  private readonly router = inject(Router);

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
}
