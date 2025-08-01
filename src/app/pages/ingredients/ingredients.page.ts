import { Component, OnInit, inject } from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {FermentablesCardComponent} from "./fermentables-card/fermentables-card.component";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {HopsCardComponent} from "./hops-card/hops-card.component";
import {Fermentable, Hop, Yeast, Misc} from "models";
import {StorageService} from "services";
import {YeastsCardComponent} from "./yeasts-card/yeasts-card.component";
import {MiscsCardComponent} from "./miscs-card/miscs-card.component";

@Component({
  selector: 'ingredients-page',
  templateUrl: 'ingredients.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, FermentablesCardComponent, NgIf, NgForOf, NgSwitchCase, NgSwitch, HopsCardComponent, YeastsCardComponent, MiscsCardComponent]
})
export class IngredientsPage implements OnInit {
  private storage = inject(StorageService);


  showSpinner = false;

  activeTab = 'fermentables';
  fermentables!: Fermentable[];
  hops!: Hop[];
  yeasts!: Yeast[];
  miscs!: Misc[];
  f_fermentables!: Fermentable[];
  f_hops!: Hop[];
  f_yeasts!: Yeast[];
  f_miscs!: Misc[];

  ionViewWillEnter() {
    this.showSpinner = true;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.showSpinner = false;
      setTimeout(() => document.getElementById('ingredients')?.scrollIntoView(), 100);
    }, 500);
  }

  ngOnInit() {
    this.showSpinner = true;
    this.storage.get('fermentables')?.then((response) => {
      this.fermentables = response;
      this.fermentables.sort((a, b) => a.name.localeCompare(b.name));
      this.f_fermentables = this.fermentables;
    });
    this.storage.get('hops')?.then((response) => {
      this.hops = response;
      this.hops.sort((a, b) => a.name.localeCompare(b.name));
      this.f_hops = this.hops;
    });
    this.storage.get('yeasts')?.then((response) => {
      this.yeasts = response;
      this.yeasts.sort((a, b) => a.name.localeCompare(b.name));
      this.f_yeasts = this.yeasts;
    });
    this.storage.get('miscs')?.then((response) => {
      this.miscs = response;
      this.miscs.sort((a, b) => a.name.localeCompare(b.name));
      this.f_miscs = this.miscs;
    });
  }

  tabChanged(event: any) {
    this.activeTab = event.detail.value
  }

  filter(event: any) {
    const query = event.target.value.toLowerCase();
    this.f_fermentables = this.fermentables.filter(d => d.name.toLowerCase().indexOf(query) > -1);
    this.f_hops = this.hops.filter(d => d.name.toLowerCase().indexOf(query) > -1);
    this.f_yeasts = this.yeasts.filter(d => d.name.toLowerCase().indexOf(query) > -1);
    this.f_miscs = this.miscs.filter(d => d.name.toLowerCase().indexOf(query) > -1);
  }
}
