import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService} from "services";
import {BeerStyle} from "models";
import {StyleCardComponent} from "./style-card/style-card.component";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'styles-page',
  templateUrl: 'styles.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, StyleCardComponent, NgIf, NgForOf]
})
export class StylesPage {

  showSpinner = false;

  constructor(private storage: StorageService, private router: Router) {
  }

  allStyles: BeerStyle[] = [];
  styles?: BeerStyle[];

  ionViewWillEnter() {
    this.showSpinner = true;
    this.storage.get('styles')?.then((response) => {
      this.styles = response;
      this.allStyles = response;
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.showSpinner = false;
      setTimeout(() => document.getElementById('styles')?.scrollIntoView(), 100);
    }, 500);
  }

  showDetails(style: BeerStyle) {
    this.router.navigate(['style-details'], {state: {style}});
  }

  filter(event: any) {
    const query = event.target.value.toLowerCase();
    this.styles = this.allStyles.filter(d => d.name.toLowerCase().indexOf(query) > -1);
  }
}
