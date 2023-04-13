import {Component, Input, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe} from "../../../models/recipe.model";
import {Fermentable} from "../../../models/fermentable.model";
import {Hop} from "../../../models/hop.model";
import {Yeast} from "../../../models/yeast.model";
import {Misc} from "../../../models/misc.model";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {StorageService} from "../../../services/storage.service";
import {RecipeUtil} from "../../../utils/recipe-calculator.utils";
import {CalculatorUtil} from "../../../utils/calculator.utils";

@Component({
  selector: 'edit-ingredients-card',
  templateUrl: 'edit-ingredients.component.html',
  styleUrls: ['../../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, NgForOf, DecimalPipe],
})
export class EditIngredientsComponent implements OnInit {
  constructor(private storage: StorageService) {
  }

  @Input()
  recipe!: Recipe;

  fermentables!: Fermentable[];
  hops!: Hop[];
  yeasts!: Yeast[];
  miscs!: Misc[];

  addFermentableOpen = false;
  addHopOpen = false;
  addYeastOpen = false;
  addMiscOpen = false;

  newFermentable?: Fermentable;
  newHop?: Hop;
  newYeast?: Yeast;
  newMisc?: Misc;

  isEdit = false;

  ngOnInit() {
    this.storage.get('fermentables')?.then((response) => {
      this.fermentables = response;
      this.fermentables.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.storage.get('hops')?.then((response) => {
      this.hops = response;
      this.hops.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.storage.get('yeasts')?.then((response) => {
      this.yeasts = response;
      this.yeasts.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.storage.get('miscs')?.then((response) => {
      this.miscs = response;
      this.miscs.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  openFermentable() {
    this.addFermentableOpen = true;
  }

  closeFermentable() {
    if (this.isEdit) {
      this.storage.saveRecipe(calculateRecipe(this.recipe));
      this.isEdit = false;
    }
    this.addFermentableOpen = false;
    this.newFermentable = undefined;
  }

  chooseFermentable(event: any) {
    this.newFermentable = JSON.parse(JSON.stringify(event.detail.value));
  }

  setFermentableAmount(event: any) {
    this.newFermentable!.amount = event.detail.value;
  }

  addFermentable() {
    if (this.newFermentable) {
      this.recipe.fermentables.push(this.newFermentable);
      this.storage.saveRecipe(calculateRecipe(this.recipe));
    } else {
      console.log('Error: Fermentable not initialized!')
    }
    this.closeFermentable();
  }

  editFermentable(item: Fermentable) {
    this.isEdit = true;
    this.newFermentable = item;
    this.addFermentableOpen = true;
  }

  removeFermentable(item: Fermentable) {
    this.recipe.fermentables.forEach((element, index) => {
      if (element == item) this.recipe.fermentables.splice(index, 1);
    })
    this.storage.saveRecipe(calculateRecipe(this.recipe));
  }

  findFermentable() {
    return this.fermentables.find((item) => item.name === this.newFermentable?.name);
  }

  openHop() {
    this.addHopOpen = true;
  }

  closeHop() {
    if (this.isEdit) {
      this.storage.saveRecipe(calculateRecipe(this.recipe));
      this.isEdit = false;
    }
    this.addHopOpen = false;
    this.newHop = undefined;
  }

  chooseHop(event: any) {
    this.newHop = JSON.parse(JSON.stringify(event.detail.value));
  }

  setHopAmount(event: any) {
    this.newHop!.amount = event.detail.value / 1000;
  }

  setHopAlpha(event: any) {
    this.newHop!.alpha = event.detail.value;
  }

  setHopTime(event: any) {
    this.newHop!.time = event.detail.value;
  }

  setHopUse(event: any) {
    this.newHop!.use = event.detail.value;
  }

  addHop() {
    if (this.newHop) {
      this.recipe.hops.push(this.newHop);
      this.storage.saveRecipe(calculateRecipe(this.recipe));
    } else {
      console.log('Error: Hop not initialized!')
    }
    this.closeHop();
  }

  editHop(item: Hop) {
    this.isEdit = true;
    this.newHop = item;
    this.addHopOpen = true;
  }

  removeHop(item: Hop) {
    this.recipe.hops.forEach((element, index) => {
      if (element == item) this.recipe.hops.splice(index, 1);
    })
    this.storage.saveRecipe(calculateRecipe(this.recipe));
  }

  findHop() {
    return this.hops.find((item) => item.name === this.newHop?.name);
  }

  getHopGrams() {
    return this.newHop?.amount ? this.newHop.amount * 1000 : undefined;
  }

  openYeast() {
    this.addYeastOpen = true;
  }

  closeYeast() {
    if (this.isEdit) {
      this.storage.saveRecipe(calculateRecipe(this.recipe));
      this.isEdit = false;
    }
    this.addYeastOpen = false;
    this.newYeast = undefined;
  }

  chooseYeast(event: any) {
    this.newYeast = JSON.parse(JSON.stringify(event.detail.value));
  }

  setYeastAttenuation(event: any) {
    this.newYeast!.attenuation = event.detail.value;
  }

  addYeast() {
    if (this.newYeast) {
      this.recipe.yeasts.push(this.newYeast);
      this.storage.saveRecipe(calculateRecipe(this.recipe));
    } else {
      console.log('Error: Yeast not initialized!')
    }
    this.closeYeast();
  }

  editYeast(item: Yeast) {
    this.isEdit = true;
    this.newYeast = item;
    this.addYeastOpen = true;
  }

  removeYeast(item: Yeast) {
    this.recipe.yeasts.forEach((element, index) => {
      if (element == item) this.recipe.yeasts.splice(index, 1);
    })
    this.storage.saveRecipe(calculateRecipe(this.recipe));
  }

  findYeast() {
    return this.yeasts.find((item) => item.name === this.newYeast?.name);
  }

  openMisc() {
    this.addMiscOpen = true;
  }

  closeMisc() {
    if (this.isEdit) {
      this.storage.saveRecipe(calculateRecipe(this.recipe));
      this.isEdit = false;
    }
    this.addYeastOpen = false;
    this.newYeast = undefined;
  }

  chooseMisc(event: any) {
    this.newMisc = JSON.parse(JSON.stringify(event.detail.value));
  }

  setMiscAmount(event: any) {
    this.newMisc!.amount = event.detail.value / 1000;
  }

  addMisc() {
    if (this.newMisc) {
      this.recipe.miscs.push(this.newMisc);
      this.storage.saveRecipe(calculateRecipe(this.recipe));
    } else {
      console.log('Error: Misc not initialized!')
    }
    this.closeMisc();
  }

  editMisc(item: Misc) {
    this.isEdit = true;
    this.newMisc = item;
    this.addMiscOpen = true;
  }

  removeMisc(item: Misc) {
    this.recipe.miscs.forEach((element, index) => {
      if (element == item) this.recipe.miscs.splice(index, 1);
    })
    this.storage.saveRecipe(calculateRecipe(this.recipe));
  }

  findMisc() {
    return this.miscs.find((item) => item.name === this.newMisc?.name);
  }

  getMiscAmount() {
    return this.newMisc?.amount ? this.newMisc.amount * 1000 : undefined;
  }
}

function calculateRecipe(recipe: Recipe): Recipe {
  recipe.fermentables.sort((a, b) => b.amount! - a.amount!);
  recipe.hops.sort((a, b) => b.amount! - a.amount!);
  recipe.hops.sort((a, b) => b.time! - a.time!);
  recipe.hops.sort((a, b) => calculateHopUseValue(b.use) - calculateHopUseValue(a.use));
  recipe.OG = RecipeUtil.calculateOg(recipe);
  recipe.FG = RecipeUtil.calculateFg(recipe);
  recipe.ABV = CalculatorUtil.abv(recipe.OG, recipe.FG);
  recipe.color = RecipeUtil.calculateColor(recipe);
  recipe.IBU = RecipeUtil.calculateBitterness(recipe);
  return recipe;
}

function calculateHopUseValue(use: string) {
  switch (use) {
    case 'Mash':
      return 5;
    case 'First Wort':
      return 4;
    case 'Boil':
      return 3;
    case 'Aroma':
      return 2;
    case 'Dry Hop':
      return 1;
    default:
      return 0;
  }
}
