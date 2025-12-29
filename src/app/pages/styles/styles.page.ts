import {Component, inject} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService} from "services";
import {BeerStyle} from "models";
import {StyleCardComponent} from "./style-card/style-card.component";
import {Router} from "@angular/router";

@Component({
  selector: 'styles-page',
  templateUrl: 'styles.page.html',
  standalone: true,
  imports: [IonicModule, StyleCardComponent]
})
export class StylesPage {
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);


  showSpinner = false;

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
    }, 500);
  }

  showDetails(style: BeerStyle) {
    this.router.navigate(['styles', 'details'], {state: {style}});
  }

  filter(event: any) {
    const query = event.target.value.toLowerCase();
    this.styles = this.allStyles.filter(d => d.name.toLowerCase().includes(query));
  }
}
