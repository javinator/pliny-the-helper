import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {StorageService} from "services";
import {BeerStyle} from "models";
import {StyleCardComponent} from "./style-card/style-card.component";
import {Router} from "@angular/router";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar
} from "@ionic/angular";

@Component({
  selector: 'styles-page',
  templateUrl: 'styles.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [StyleCardComponent, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonSpinner, IonSearchbar]
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
