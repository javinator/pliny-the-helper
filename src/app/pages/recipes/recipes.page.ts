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

  importRecipes() {

  }

  exportRecipes() {
    this.xmlWriter.recipesToXml(this.recipes || []);
  }
}
