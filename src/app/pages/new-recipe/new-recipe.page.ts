import {Component, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService} from "../../services/storage.service";
import {BeerStyle} from "../../models/beer-style.model";
import {DatePipe, Location, NgForOf} from "@angular/common";
import {Settings} from "../../models/settings.model";
import {FormsModule} from "@angular/forms";
import {Recipe} from "../../models/recipe.model";
import {v4 as uuidv4} from "uuid";
import {Router} from "@angular/router";

@Component({
  selector: 'new-recipe-page',
  templateUrl: 'new-recipe.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, NgForOf, DatePipe, FormsModule]
})
export class NewRecipePage implements OnInit {
  constructor(private storage: StorageService, private location: Location, private router: Router) {
  }

  styles?: BeerStyle[];
  settings?: Settings;
  model!: Recipe;

  ngOnInit() {
    this.model = {
      uid: uuidv4() as string,
      name: '',
      batchSize: 0,
      boilTime: 0,
      boilSize: 0,
      efficiency: 0,
      brewDate: new Date().toISOString().slice(0, 10),
      fermentables: [],
      hops: [],
      miscs: [],
      waters: [],
      yeasts: [],
      version: 1,
      type: 'All Grain',
      ABV: 0,
      FG: 0,
      IBU: 0,
      OG: 0,
      color: 0
    }
    this.storage.get('settings')?.then((response) => {
      this.settings = response;
      this.model.batchSize = this.settings!.batchSize;
      this.model.boilTime = this.settings!.boilTime;
      this.model.efficiency = this.settings!.efficiency;
      this.model.brewer = this.settings!.brewer;
    });
    this.storage.get('styles')?.then((response) => {
      this.styles = response;
      this.styles?.sort((a, b) => a.name.localeCompare(b.name))
    });
  }

  navigateBack() {
    this.location.back();
  }

  getStylesOptions() {
    return this.styles?.map((style) => style.name);
  }

  changeStyle(event: any) {
    this.model.style = this.styles?.find((style) => style.name === event.detail.value);
  }

  submit() {
    this.model.boilSize = this.model.batchSize * 1.1;
    this.storage.addRecipe(this.model)?.then(() => this.router.navigate(['edit-recipe'], {state: {recipe: this.model.uid}}));
  }
}
