import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {FermentablesCardComponent} from "./fermentables-card/fermentables-card.component";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {HopsCardComponent} from "./hops-card/hops-card.component";
import {Fermentable} from "../../models/fermentable.model";
import {StorageService} from "../../services/storage.service";
import {Hop} from "../../models/hop.model";
import {YeastsCardComponent} from "./yeasts-card/yeasts-card.component";
import {Yeast} from "../../models/yeast.model";
import {Misc} from "../../models/misc.model";
import {MiscsCardComponent} from "./miscs-card/miscs-card.component";

@Component({
  selector: 'ingredients-page',
  templateUrl: 'ingredients.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, FermentablesCardComponent, NgIf, NgForOf, NgSwitchCase, NgSwitch, HopsCardComponent, YeastsCardComponent, MiscsCardComponent]
})
export class IngredientsPage {
  constructor(private storage: StorageService) {
  }

  activeTab = 'fermentables';
  fermentables!: Fermentable[];
  hops!: Hop[];
  yeasts!: Yeast[];
  miscs!: Misc[];

  ionViewWillEnter() {
    this.storage.get('fermentables')?.then((response) => {
      this.fermentables = response;
      this.fermentables.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.storage.get('hops')?.then((response) => {
      this.hops = response;
      this.hops.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.storage.get('yeasts')?.then((response) => {
      this.yeasts = response;
      this.yeasts.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.storage.get('miscs')?.then((response) => {
      this.miscs = response;
      this.miscs.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  tabChanged(event: any) {
    this.activeTab = event.detail.value
  }
}
