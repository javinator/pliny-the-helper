import {inject, Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import {BeerStyle, Fermentable, Hop, MashProfile, Misc, Recipe, Settings, Water, Yeast} from "models";
import {deepClone, RecipeUtil} from "utils";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storage = inject(Storage);

  private _storage: Storage | null = null;

  constructor() {
    //NOSONAR
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
    rcps.forEach((recipe) => {
      this.storage.get('fermentables')?.then((fermentables: Fermentable[]) => {
        setTimeout(() => {
          let newFermentables: Fermentable[] = [];
          recipe.fermentables.forEach((fermentable) => {
            let nF = deepClone(fermentables.find((item) => item.name === fermentable.name) || fermentable);
            nF.amount = fermentable.amount;
            newFermentables.push(nF);
          })
          recipe.fermentables = newFermentables;
        }, 100);
      })
      this.storage.get('hops')?.then((hops: Hop[]) => {
        setTimeout(() => {
          let newHops: Hop[] = [];
          recipe.hops.forEach((hop) => {
            let nH = deepClone(hops.find((item) => item.name === hop.name) || hop);
            nH.amount = hop.amount;
            nH.time = hop.time;
            nH.use = hop.use;
            if (hop.alpha) {
              nH.alpha = hop.alpha;
            }
            newHops.push(nH);
          })
          recipe.hops = newHops;
        }, 100);
      })
      this.storage.get('yeasts')?.then((yeasts: Yeast[]) => {
        setTimeout(() => {
          let newYeasts: Yeast[] = [];
          recipe.yeasts.forEach((yeast) => {
            let nY = deepClone(yeasts.find((item) => item.name === yeast.name) || yeast);
            nY.amount = yeast.amount;
            nY.attenuation = yeast.attenuation;
            newYeasts.push(nY)
          })
          recipe.yeasts = newYeasts;
        }, 100);
      })
      newRecipes.push(RecipeUtil.calculateRecipe(recipe));
    })
    return this._storage?.get('recipes').then((recipes: Recipe[] | null) => {
      setTimeout(() => {
        if (recipes) {
          recipes.push(...newRecipes);
        } else {
          recipes = newRecipes;
        }
      }, 100);
      setTimeout(() => {
        return this._storage?.set('recipes', recipes);
      }, 100);
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
      console.debug(recipes[idx]);
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
        console.error('Error! Recipe UID not found!')
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

  public setWaters(waters: Water[]) {
    setTimeout(() => {
      this._storage?.get('waters').then((storageWaters: Water[]) => {
        if (storageWaters) {
          waters.push(...storageWaters.filter(sw => sw.isCustom));
        }
      })
    }, 100);
    setTimeout(() => {
      this._storage?.remove('waters');
      this._storage?.set('waters', waters);
    }, 500);
  }

  public saveWater(water: Water) {
    this._storage?.get('waters').then((waters: Water[]) => {
      const idx = waters.findIndex((wtr) => wtr.uid === water.uid);
      if (idx >= 0) {
        waters[idx] = water;
      } else {
        waters.push(water);
      }
      this._storage?.set('waters', waters);
    });
  }

  public deleteWater(uid: string) {
    return this._storage?.get('waters').then((waters: Water[]) => {
      if (waters) {
        waters.forEach((element, index) => {
          if (element.uid === uid) waters.splice(index, 1);
        })
        return this._storage?.set('waters', waters);
      } else {
        return undefined;
      }
    })
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
