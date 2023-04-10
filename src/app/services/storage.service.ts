import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import {Recipe} from "../models/recipe.model";
import {BeerStyle} from "../models/beer-style.model";
import {Settings} from "../models/settings.model";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init().then(() =>
      this.setSettings(
        {
          brewer: 'Brewmaster',
          batchSize: 10,
          boilTime: 60,
          efficiency: 65
        }
      )
    );
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

  public saveRecipe(recipe: Recipe) {
    this._storage?.get('recipes').then((recipes: Recipe[]) => {
      const idx = recipes.findIndex((rcp) => rcp.uid === recipe.uid);
      if (idx >= 0) {
        recipes[idx] = recipe;
        this._storage?.set('recipes', recipes);
      } else {
        console.log('Error! Recipe UID not found!')
      }
    });
  }

  public setStyles(styles: BeerStyle[]) {
    this._storage?.remove('styles');
    this._storage?.set('styles', styles);
  }

  public getStyles() {
    return this._storage?.get('styles');
  }

  public setSettings(settings: Settings) {
    return this._storage?.set('settings', settings);
  }

  public getSettings() {
    return this._storage?.get('settings');
  }

  public clearDb() {
    this._storage?.keys().then((keys) => {
      console.log('All this keys will be deleted:');
      console.log(keys);
    })
    this._storage?.clear();
  }
}
