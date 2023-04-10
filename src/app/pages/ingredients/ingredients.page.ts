import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {FermentablesCardComponent} from "./fermentables-card/fermentables-card.component";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {HopsCardComponent} from "./hops-card/hops-card.component";
import {Fermentable} from "../../models/fermentable.model";
import {StorageService} from "../../services/storage.service";
import {Hop} from "../../models/hop.model";

@Component({
  selector: 'ingredients-page',
  templateUrl: 'ingredients.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, FermentablesCardComponent, NgIf, NgForOf, NgSwitchCase, NgSwitch, HopsCardComponent]
})
export class IngredientsPage {
  constructor(private storage: StorageService) {
  }

  activeTab = 'fermentables';
  fermentables!: Fermentable[];
  hops!: Hop[];

  ionViewWillEnter() {
    this.storage.get('fermentables')?.then((response) => {
      this.fermentables = response;
      this.fermentables.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.storage.get('hops')?.then((response) => {
      this.hops = response;
      this.hops.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  tabChanged(event: any) {
    this.activeTab = event.detail.value
  }
}
