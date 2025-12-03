import {Component, inject} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe, BeerStyle, MashProfile, Settings} from "models";
import {Router} from "@angular/router";
import {StorageService} from "services";
import {DecimalPipe} from "@angular/common";
import {EditIngredientsComponent} from "./edit-ingredients/edit-ingredients.component";
import {EditDetailsComponent} from "./edit-details/edit-details.component";
import {FormsModule} from "@angular/forms";
import {RecipeUtil} from "utils";
import {SelectSearchComponent} from "@shared";
import {BrewingComponent} from "./brewing/brewing.component";

@Component({
  selector: 'edit-recipe-page',
  templateUrl: 'edit-recipe.page.html',
  standalone: true,
  imports: [
    IonicModule,
    EditIngredientsComponent,
    EditDetailsComponent,
    FormsModule,
    DecimalPipe,
    SelectSearchComponent,
    BrewingComponent
  ],
})
export class EditRecipePage {
  private router = inject(Router);
  private storage = inject(StorageService);


  activeTab = 'ingredients';
  isEditOpen = false;

  uid!: string;
  recipe?: Recipe;
  editRecipe?: Recipe;
  styles?: BeerStyle[];
  mashProfiles?: MashProfile[];
  settings?: Settings;

  constructor() {
    this.uid = this.router.currentNavigation()?.extras.state?.['recipe'];
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

  calculateBoilSize(): number {
    return RecipeUtil.calculateBoilSize(this.editRecipe!, this.settings);
  }

  saveEdit() {
    if (this.editRecipe) {
      if (this.editRecipe.calculateBoilSize) {
        this.editRecipe.boilSize = this.calculateBoilSize();
      }
      this.editRecipe.mashProfile?.mashSteps.forEach((step) => {
        if (step.type === 'Infusion') {
          step.infuseAmount = this.editRecipe?.batchSize;
        }
      });
      this.storage.saveRecipe(this.editRecipe)
      this.recipe = JSON.parse(JSON.stringify(RecipeUtil.calculateRecipe(this.editRecipe)));
    }
    this.isEditOpen = false;
  }
}
