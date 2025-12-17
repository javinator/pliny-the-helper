import {Component, inject} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService} from "services";
import {Water} from "models";
import {WaterCardComponent} from "./water-card/water-card.component";

@Component({
  selector: 'waters-page',
  templateUrl: 'waters.page.html',
  standalone: true,
  imports: [IonicModule, WaterCardComponent]
})
export class WatersPage {
  private storage = inject(StorageService);

  showSpinner = false;

  allWaters: Water[] = [];
  waters?: Water[];

  ionViewWillEnter() {
    this.showSpinner = true;
    this.storage.get('waters')?.then((response: Water[]) => {
      this.waters = response.sort((a, b) => a.name.localeCompare(b.name));
      this.allWaters = response.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.showSpinner = false;
      setTimeout(() => document.getElementById('waters')?.scrollIntoView(), 100);
    }, 250);
  }

  filter(event: any) {
    const query = event.target.value.toLowerCase();
    this.waters = this.allWaters.filter(d => d.name.toLowerCase().indexOf(query) > -1);
  }
}
