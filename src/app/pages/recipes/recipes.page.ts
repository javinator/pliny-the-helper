import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe} from "models";
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {StorageService, XmlWriterService} from "services";
import {RecipeCardComponent} from "./recipe-card/recipe-card.component";

@Component({
  selector: 'recipes-page',
  templateUrl: 'recipes.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, RouterLink, RecipeCardComponent, NgForOf]
})
export class RecipesPage {
  recipes?: Recipe[];
  selectedRecipes: Recipe[] = [];
  allSelected = false;

  constructor(private storage: StorageService, private router: Router, private xmlWriter: XmlWriterService) {
  }

  ionViewWillEnter() {
    this.storage.get('recipes')?.then((response) => {
      this.recipes = response;
    });
  }

  showEdit(recipe: Recipe) {
    this.router.navigate(['edit-recipe'], {state: {recipe: recipe.uid}});
  }

  toggleAllCheckboxes(event: any) {
    this.allSelected = event.detail.checked;
    if (event.detail.checked) {
      this.selectedRecipes = [];
      this.selectedRecipes.push(...this.recipes || [])
    } else {
      this.selectedRecipes = [];
    }
  }

  toggleCheckbox(event: any, recipe: Recipe) {
    if (event.detail.checked) {
      this.selectedRecipes.push(recipe);
    } else {
      this.selectedRecipes.forEach((element, index) => {
        if (element == recipe) this.selectedRecipes.splice(index, 1);
      })
    }
  }

  importRecipes() {

  }

  exportRecipes(recipes?: Recipe[]) {
    this.xmlWriter.recipesToXml(recipes || []);
  }
}
