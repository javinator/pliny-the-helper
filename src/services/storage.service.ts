import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import {Recipe, BeerStyle, Fermentable, Hop, Yeast, Misc, MashProfile, Settings} from "models";
import {RecipeUtil} from "utils";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init().then();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public get(key: string) {
    return this._storage?.get(key);
  }

  public set(key: string, item: any) {
    return this._storage?.set(key, item);
  }

  public addRecipe(recipe: Recipe) {
    recipe = RecipeUtil.calculateRecipe(recipe);
    return this._storage?.get('recipes').then((recipes: Recipe[] | null) => {
      if (recipes) {
        recipes.push(recipe);
      } else {
        recipes = [recipe];
      }
      return this._storage?.set('recipes', recipes);
    })
  }

  public addRecipes(rcps: Recipe[]) {
    let newRecipes: Recipe[] = [];
    rcps.forEach((recipe) => newRecipes.push(RecipeUtil.calculateRecipe(recipe)))
    return this._storage?.get('recipes').then((recipes: Recipe[] | null) => {
      if (recipes) {
        recipes.push(...newRecipes);
      } else {
        recipes = newRecipes;
      }
      return this._storage?.set('recipes', recipes);
    })
  }

  public deleteRecipe(uid: string) {
    return this._storage?.get('recipes').then((recipes: Recipe[]) => {
      if (recipes) {
        recipes.forEach((element, index) => {
          if (element.uid === uid) recipes.splice(index, 1);
        })
        return this._storage?.set('recipes', recipes);
      } else {
        return undefined;
      }
    })
  }

  public deleteRecipes() {
    return this._storage?.remove('recipes');
  }

  public getRecipe(uid?: string) {
    return this._storage!.get('recipes').then((recipes: Recipe[]) => {
      const idx = recipes.findIndex((rcp) => rcp.uid === uid);
      console.log(recipes[idx]);
      return recipes[idx];
    });
  }

  public saveRecipe(recipe: Recipe) {
    this._storage?.get('recipes').then((recipes: Recipe[]) => {
      const idx = recipes.findIndex((rcp) => rcp.uid === recipe.uid);
      if (idx >= 0) {
        recipes[idx] = RecipeUtil.calculateRecipe(recipe);
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

  public setFermentables(fermentables: Fermentable[]) {
    this._storage?.remove('fermentables');
    this._storage?.set('fermentables', fermentables);
  }

  public setHops(hops: Hop[]) {
    this._storage?.remove('hops');
    this._storage?.set('hops', hops);
  }

  public setYeasts(yeasts: Yeast[]) {
    this._storage?.remove('yeasts');
    this._storage?.set('yeasts', yeasts);
  }

  public setMiscs(miscs: Misc[]) {
    this._storage?.remove('miscs');
    this._storage?.set('miscs', miscs);
  }

  public setMashProfiles(mashProfiles: MashProfile[]) {
    this._storage?.remove('mashProfiles');
    this._storage?.set('mashProfiles', mashProfiles);
  }

  public setSettings(settings: Settings) {
    return this._storage?.set('settings', settings);
  }

  public clearDb() {
    this._storage?.keys().then((keys) => {
      console.log('All this keys will be deleted:');
      console.log(keys);
    })
    this._storage?.clear();
  }
}
