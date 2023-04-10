import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService} from "../../services/storage.service";
import {BeerStyle} from "../../models/beer-style.model";
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
  constructor(private storage: StorageService, private router: Router) {
  }

  styles?: BeerStyle[];

  ionViewWillEnter() {
    this.storage.getStyles()?.then((response) => {
      this.styles = response;
    });
  }

  showDetails(style: BeerStyle) {
    this.router.navigate(['style-details'], {state: {style}});
  }
}
