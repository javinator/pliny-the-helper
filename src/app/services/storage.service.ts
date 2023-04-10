import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import {Recipe} from "../pages/models/recipe.model";
import {BeerStyle} from "../pages/models/beer-style.model";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public getRecipes() {
    return this._storage?.get('recipes')
  }

  public addRecipe(recipe: Recipe) {
    this._storage?.get('recipes').then((recipes: Recipe[] | null) => {
      if (recipes) {
        recipes.push(recipe);
      } else {
        recipes = [recipe];
      }
      this._storage?.set('recipes', recipes);
    })
  }

  public deleteRecipes() {
    this._storage?.remove('recipes');
  }

  public setStyles(styles: BeerStyle[]) {
    this._storage?.remove('styles');
    this._storage?.set('styles', styles);
  }

  public getStyles() {
    return this._storage?.get('styles');
  }

  public clearDb() {
    this._storage?.keys().then((keys) => {
      console.log('All this keys will be deleted:');
      console.log(keys);
    })
    this._storage?.clear();
  }
}
