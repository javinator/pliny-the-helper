import {Component, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe} from "../../models/recipe.model";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {DecimalPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {EditIngredientsComponent} from "./edit-ingredients/edit-ingredients.component";
import {EditDetailsComponent} from "./edit-details/edit-details.component";
import {FormsModule} from "@angular/forms";
import {BeerStyle} from "../../models/beer-style.model";
import {RecipeUtil} from "../../utils/recipe-calculator.utils";

@Component({
  selector: 'edit-recipe-page',
  templateUrl: 'edit-recipe.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, EditIngredientsComponent, EditDetailsComponent, NgSwitch, NgSwitchCase, NgForOf, NgIf, FormsModule, DecimalPipe],
})
export class EditRecipePage implements OnInit {

  activeTab = 'ingredients';
  isEditOpen = false;

  uid!: string;
  recipe?: Recipe;
  editRecipe?: Recipe;
  styles!: BeerStyle[];

  constructor(private router: Router, private storage: StorageService) {
    this.uid = this.router.getCurrentNavigation()?.extras.state?.['recipe'];
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

  ngOnInit() {
    this.storage.getRecipe(this.uid).then((recipe) => this.recipe = recipe);
    this.storage.get('styles')?.then((response) => {
      this.styles = response;
      this.styles?.sort((a, b) => a.name.localeCompare(b.name))
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
    return this.styles?.map((style) => style.name);
  }

  changeStyle(event: any) {
    this.editRecipe!.style = this.styles?.find((style) => style.name === event.detail.value);
  }

  calculateBoilSize(): number {
    return RecipeUtil.calculateBoilSize(this.editRecipe!);
  }

  saveEdit() {
    if (this.editRecipe) {
      if (this.editRecipe.calculateBoilSize) {
        this.editRecipe.boilSize = this.calculateBoilSize();
      }
      this.storage.saveRecipe(this.editRecipe)
      this.recipe = JSON.parse(JSON.stringify(this.editRecipe));
    }
    this.isEditOpen = false;
  }
}
