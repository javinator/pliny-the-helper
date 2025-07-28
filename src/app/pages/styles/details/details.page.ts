import { Component, inject } from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Router} from "@angular/router";
import {BeerStyle} from "models";
import {NgIf} from "@angular/common";

@Component({
  selector: 'style-details-page',
  templateUrl: 'details.page.html',
  styleUrls: ['../../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf],
})
export class StyleDetailsPage {
  private router = inject(Router);

  constructor() {
    this.style = this.router.getCurrentNavigation()?.extras.state?.['style'];
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
