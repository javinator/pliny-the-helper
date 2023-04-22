import {Component, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService} from "services";
import {BeerStyle, Settings, Recipe, MashProfile} from "models";
import {DatePipe, Location, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {v4 as uuidv4} from "uuid";
import {Router} from "@angular/router";
import {RecipeUtil} from "utils";
import {CONFIG} from "../../app.constants";

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
  mashProfiles?: MashProfile[];
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
      FG: 1,
      IBU: 0,
      OG: 1,
      color: 0
    }
    this.storage.get('settings')?.then((response) => {
      this.settings = response;
      this.model.batchSize = this.settings?.batchSize || CONFIG.defaultBatchSize;
      this.model.boilTime = this.settings?.boilTime || CONFIG.defaultBoilTime;
      this.model.efficiency = this.settings?.efficiency || CONFIG.defaultEfficiency;
      this.model.brewer = this.settings?.brewer || CONFIG.defaultName;
    });
    this.storage.get('styles')?.then((response) => {
      this.styles = response;
      this.styles?.sort((a, b) => a.name.localeCompare(b.name))
    });
    this.storage.get('mashProfiles')?.then((response) => {
      this.mashProfiles = response;
      this.model.mashProfile = this.mashProfiles?.[0];
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

  getProfilesOptions() {
    return this.mashProfiles?.map((profile) => profile.name);
  }

  changeProfile(event: any) {
    this.model.mashProfile = this.mashProfiles?.find((profile) => profile.name === event.detail.value);
  }

  submit() {
    this.model.calculateBoilSize = true;
    this.model.boilSize = RecipeUtil.calculateBoilSize(this.model);
    this.storage.addRecipe(this.model)?.then(() => this.router.navigate(['edit-recipe'], {state: {recipe: this.model.uid}}));
  }


}
