import {Component, inject} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService} from "services";
import {Water} from "models";
import {WaterCardComponent} from "./water-card/water-card.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'waters-page',
  templateUrl: 'waters.page.html',
  standalone: true,
  imports: [IonicModule, WaterCardComponent, FormsModule, ReactiveFormsModule]
})
export class WatersPage {
  private readonly storage = inject(StorageService);

  showSpinner = false;
  isModalOpen = false;

  allWaters: Water[] = [];
  waters?: Water[];

  ionViewWillEnter() {
    this.showSpinner = true;
    this.init();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.showSpinner = false;
    }, 250);
  }

  init() {
    this.storage.get('waters')?.then((response: Water[]) => {
      this.waters = [...response].sort((a, b) => a.name.localeCompare(b.name));
      this.allWaters = this.waters;
    });
  }

  filter(event: any) {
    const query = event.target.value.toLowerCase();
    this.waters = this.allWaters.filter(d => d.name.toLowerCase().indexOf(query) > -1);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveWater(values: Water) {
    values.isCustom = true;
    this.showSpinner = true;
    this.storage.saveWater(values);
    this.closeModal();
    setTimeout(() => this.init(), 100);
    setTimeout(() => this.showSpinner = false, 500);
  }

  deleteWater(uid: string) {
    this.showSpinner = true;
    this.storage.deleteWater(uid);
    setTimeout(() => this.init(), 100);
    setTimeout(() => this.showSpinner = false, 500);
  }
}
