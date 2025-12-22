import {Component, inject} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {BeerStyle, MashProfile, Recipe, Settings, Water} from "models";
import {ActivatedRoute, Router} from "@angular/router";
import {StorageService} from "services";
import {DecimalPipe} from "@angular/common";
import {EditIngredientsComponent} from "./edit-ingredients/edit-ingredients.component";
import {EditDetailsComponent} from "./edit-details/edit-details.component";
import {FormsModule} from "@angular/forms";
import {RecipeUtil} from "utils";
import {SelectSearchComponent} from "@shared";
import {BrewingComponent} from "./brewing/brewing.component";
import {RecipeWaterComponent} from "./recipe-water/recipe-water.component";

@Component({
  selector: 'edit-recipe-page',
  templateUrl: 'edit-recipe.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    EditIngredientsComponent,
    EditDetailsComponent,
    FormsModule,
    DecimalPipe,
    SelectSearchComponent,
    BrewingComponent,
    RecipeWaterComponent
  ],
})
export class EditRecipePage {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private storage = inject(StorageService);


  activeTab = 'ingredients';
  isEditOpen = false;
  showWaterProfile = false;

  uid!: string;
  recipe?: Recipe;
  editRecipe?: Recipe;
  styles?: BeerStyle[];
  mashProfiles?: MashProfile[];
  waters?: Water[];
  settings?: Settings;

  constructor() {
    this.uid = this.route.snapshot.paramMap.get('uid')!;
  }

  public deleteButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.deleteRecipe();
      }
    }
  ];

  ionViewWillEnter() {
    this.storage.getRecipe(this.uid).then((recipe) => this.recipe = recipe);
    this.storage.get('styles')?.then((response) => {
      this.styles = response;
      this.styles?.sort((a, b) => a.name.localeCompare(b.name))
    });
    this.storage.get('mashProfiles')?.then((response) => {
      this.mashProfiles = response;
    });
    this.storage.get('waters')?.then((response) => {
      this.waters = response;
    });
    this.storage.get('settings')?.then((response) => {
      this.settings = response;
    });
  }

  tabChanged(event: any) {
    this.activeTab = event.detail.value
  }

  navigateBack() {
    this.router.navigate(['recipes']);
  }

  deleteRecipe() {
    this.storage.deleteRecipe(this.uid)?.then(() => this.navigateBack());
  }

  openEdit() {
    this.editRecipe = JSON.parse(JSON.stringify(this.recipe));
    if (this.editRecipe?.waters?.length === 1) {
      this.showWaterProfile = true;
      this.changeWaterProfile(this.editRecipe.waters[0].name)
    } else {
      this.changeWaterProfile(this.settings?.defaultWaterProfile || 'Distilled Water');
    }
    this.isEditOpen = true;
  }

  closeEdit() {
    this.isEditOpen = false;
  }

  getStylesOptions() {
    return this.styles?.map((style) => {
      return {
        name: style.name
      }
    }) || [];
  }

  changeStyle(event: string) {
    this.editRecipe!.style = this.styles?.find((style) => style.name === event);
  }

  getProfilesOptions() {
    return this.mashProfiles?.map((profile) => {
      return {
        name: profile.name
      }
    }) || [];
  }

  changeProfile(event: any) {
    this.editRecipe!.mashProfile = this.mashProfiles?.find((profile) => profile.name === event);
  }

  getWaterOptions() {
    return this.waters?.map(water => {
      return {name: water.name}
    }).sort((a, b) => a.name.localeCompare(b.name)) || [];
  }

  changeWaterProfile(event: string) {
    if (this.waters) {
      const selected = this.waters.find((water) => water.name === event);
      if (selected) {
        this.editRecipe!.waters = [selected];
      } else {
        console.error('Water profile not found!')
      }
    }
  }

  calculateBoilSize(): number {
    return RecipeUtil.calculateBoilSize(this.editRecipe!, this.settings);
  }

  saveEdit() {
    if (this.editRecipe) {
      if (!this.showWaterProfile) {
        this.editRecipe.waters = [];
      }
      if (this.editRecipe.calculateBoilSize) {
        this.editRecipe.boilSize = this.calculateBoilSize();
      }
      this.editRecipe.mashProfile?.mashSteps.forEach((step) => {
        if (step.type === 'Infusion') {
          step.infuseAmount = this.editRecipe?.batchSize;
        }
      });
      if (this.editRecipe.waters.length === 1) {
        this.editRecipe.waters[0].amount = this.editRecipe.batchSize;
      }
      this.storage.saveRecipe(this.editRecipe)
      this.recipe = JSON.parse(JSON.stringify(RecipeUtil.calculateRecipe(this.editRecipe)));
    }
    this.isEditOpen = false;
  }

  saveRecipe(recipe: Recipe) {
    this.storage.saveRecipe(recipe);
  }
}
