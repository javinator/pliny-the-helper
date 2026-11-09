import {inject, Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';

import {BeerStyle, Fermentable, Hop, MashProfile, Misc, Recipe, Settings, Water, Yeast} from 'models';

import {findFermentables, findHops, findMiscs, findYeasts, RecipeUtil} from 'utils';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storage = inject(Storage);

  private _storage: Storage | null = null;
  private initPromise?: Promise<Storage>;

  async init(): Promise<void> {
    await this.getStorage();
  }

  public async get(key: string): Promise<any> {
    const storage = await this.getStorage();
    return storage.get(key);
  }

  public async set(key: string, item: any): Promise<void> {
    const storage = await this.getStorage();
    await storage.set(key, item);
  }

  public async addRecipe(recipe: Recipe): Promise<void> {
    const storage = await this.getStorage();
    const recipes: Recipe[] = (await storage.get('recipes')) ?? [];
    const calculatedRecipe = RecipeUtil.calculateRecipe(recipe);
    recipes.push(calculatedRecipe);
    await storage.set('recipes', recipes);
  }

  public async addRecipes(rcps: Recipe[]): Promise<void> {
    const storage = await this.getStorage();

    const [
      recipes,
      fermentables,
      hops,
      yeasts,
      miscs
    ] = await Promise.all([
      storage.get('recipes'),
      storage.get('fermentables'),
      storage.get('hops'),
      storage.get('yeasts'),
      storage.get('miscs')
    ]);

    const newRecipes: Recipe[] = rcps.map(recipe => {

      findFermentables(recipe, fermentables ?? []);
      findHops(recipe, hops ?? []);
      findYeasts(recipe, yeasts ?? []);
      findMiscs(recipe, miscs ?? []);

      return RecipeUtil.calculateRecipe(recipe);
    });

    const updatedRecipes: Recipe[] = [
      ...(recipes ?? []),
      ...newRecipes
    ];

    await storage.set('recipes', updatedRecipes);
  }

  public async deleteRecipe(uid: string): Promise<void> {
    const storage = await this.getStorage();
    const recipes: Recipe[] = (await storage.get('recipes')) ?? [];
    const updatedRecipes = recipes.filter(recipe => recipe.uid !== uid);
    await storage.set('recipes', updatedRecipes);
  }

  public async deleteRecipes(): Promise<void> {
    const storage = await this.getStorage();
    await storage.remove('recipes');
  }

  public async getRecipe(uid?: string): Promise<Recipe | undefined> {
    const storage = await this.getStorage();
    const recipes: Recipe[] = (await storage.get('recipes')) ?? [];
    const recipe = recipes.find(rcp => rcp.uid === uid);
    console.debug(recipe);
    return recipe;
  }

  public async saveRecipe(recipe: Recipe): Promise<void> {
    const storage = await this.getStorage();
    const recipes: Recipe[] = (await storage.get('recipes')) ?? [];
    const idx = recipes.findIndex(rcp => rcp.uid === recipe.uid);
    if (idx < 0) {
      console.error('Error! Recipe UID not found!');
      return;
    }

    recipes[idx] = RecipeUtil.calculateRecipe(recipe);

    await Promise.all([
      storage.set('recipes', recipes),
      storage.set('recipeTimestamp', new Date())
    ]);
  }

  public async setStyles(styles: BeerStyle[]): Promise<void> {
    await this.set('styles', styles);
  }

  public async setFermentables(fermentables: Fermentable[]): Promise<void> {
    await this.set('fermentables', fermentables);
  }

  public async setHops(hops: Hop[]): Promise<void> {
    await this.set('hops', hops);
  }

  public async setYeasts(yeasts: Yeast[]): Promise<void> {
    await this.set('yeasts', yeasts);
  }

  public async setMiscs(miscs: Misc[]): Promise<void> {
    await this.set('miscs', miscs);
  }

  public async setMashProfiles(mashProfiles: MashProfile[]): Promise<void> {
    await this.set('mashProfiles', mashProfiles);
  }

  public async setWaters(waters: Water[]): Promise<void> {
    const storage = await this.getStorage();

    const storageWaters: Water[] = (await storage.get('waters')) ?? [];

    // Preserve custom waters that already exist in storage.
    const customWaters = storageWaters.filter(water => water.isCustom);

    const updatedWaters = [
      ...waters,
      ...customWaters.filter(
        custom => !waters.some(water => water.uid === custom.uid)
      )
    ];

    await storage.set('waters', updatedWaters);
  }

  public async saveWater(water: Water): Promise<void> {
    const storage = await this.getStorage();
    const waters: Water[] = (await storage.get('waters')) ?? [];
    const idx = waters.findIndex(wtr => wtr.uid === water.uid);

    if (idx >= 0) {
      waters[idx] = water;
    } else {
      waters.push(water);
    }

    await storage.set('waters', waters);
  }

  public async deleteWater(uid: string): Promise<void> {
    const storage = await this.getStorage();
    const waters: Water[] = (await storage.get('waters')) ?? [];
    const updatedWaters = waters.filter(water => water.uid !== uid);

    await storage.set('waters', updatedWaters);
  }

  public async setSettings(settings: Settings): Promise<void> {
    await this.set('settings', settings);
  }

  public async clearDb(): Promise<void> {
    const storage = await this.getStorage();

    const keys = await storage.keys();

    console.log('All these keys will be deleted:');
    console.log(keys);

    await storage.clear();
  }

  private async getStorage(): Promise<Storage> {
    if (this._storage) {
      return this._storage;
    }

    if (!this.initPromise) {
      this.initPromise = this.storage.create()
        .then(storage => {
          this._storage = storage;
          return storage;
        })
        .catch(error => {
          this.initPromise = undefined;
          throw error;
        });
    }

    return this.initPromise;
  }
}
