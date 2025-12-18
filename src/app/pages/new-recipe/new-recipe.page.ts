import {Component, inject, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService} from "services";
import {BeerStyle, MashProfile, Recipe, Settings, Water} from "models";
import {Location} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {v4 as uuidv4} from "uuid";
import {Router} from "@angular/router";
import {RecipeUtil} from "utils";
import {CONFIG} from "../../app.constants";
import {SelectSearchComponent} from "@shared";

@Component({
  selector: 'new-recipe-page',
  templateUrl: 'new-recipe.page.html',
  standalone: true,
  imports: [IonicModule, FormsModule, SelectSearchComponent]
})
export class NewRecipePage implements OnInit {
  private storage = inject(StorageService);
  private location = inject(Location);
  private router = inject(Router);


  styles?: BeerStyle[];
  mashProfiles?: MashProfile[];
  settings?: Settings;
  waters?: Water[];
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
    this.storage.get('waters')?.then((response) => {
      this.waters = response;
      this.waters?.sort((a, b) => a.name.localeCompare(b.name))
      const defaultWater = this.waters?.find(water => water.name === this.settings?.defaultWaterProfile);
      this.model.waters = defaultWater ? [defaultWater] : [];
    });
  }

  navigateBack() {
    this.location.back();
  }

  getStylesOptions() {
    return this.styles?.map(style => {
      return {name: style.name}
    }) || [];
  }

  changeStyle(event: string) {
    this.model.style = this.styles?.find(style => style.name === event);
  }

  getProfilesOptions() {
    return this.mashProfiles?.map(profile => {
      return {
        name: profile.name
      }
    }) || [];
  }

  changeProfile(event: string) {
    this.model.mashProfile = this.mashProfiles?.find((profile) => profile.name === event);
  }

  getWaterOptions() {
    return this.waters?.map(water => {
      return {name: water.name}
    }) || [];
  }

  changeWater(event: string) {
    if (this.waters) {
      const selected = this.waters.find((water) => water.name === event);
      if (selected) {
        this.model.waters = [selected];
      } else {
        console.error('Water profile not found!')
      }
    }
  }

  submit() {
    this.model.calculateBoilSize = true;
    this.model.boilSize = RecipeUtil.calculateBoilSize(this.model, this.settings);
    if (!this.model.style) {
      this.model.style = this.styles?.[0];
    }
    this.model.carbonation = RecipeUtil.calculateCarbonation(this.model.style);
    this.model.mashProfile?.mashSteps.forEach((step) => {
      if (step.type === 'Infusion') {
        step.infuseAmount = this.model.batchSize;
      }
    });
    if (this.model.waters.length === 1) {
      this.model.waters[0].amount = this.model.batchSize;
    }

    this.storage.addRecipe(this.model)?.then(() => {
      this.router.navigate(['edit-recipe', this.model.uid])
    });
  }
}
