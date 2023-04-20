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
import {CONFIG} from "../../../constants";

@Component({
  selector: 'edit-ingredients-card',
  templateUrl: 'edit-ingredients.component.html',
  styleUrls: ['../../../app.component.scss', 'edit-ingredients.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, NgForOf, DecimalPipe],
})
export class EditIngredientsComponent implements OnInit {
  RecipeUtil = RecipeUtil;

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
      this.storage.saveRecipe(this.recipe);
    }
    this.addFermentableOpen = false;
    setTimeout(() => {
      this.isEdit = false;
      this.newFermentable = undefined;
    }, 250)
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
      this.storage.saveRecipe(this.recipe);
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
    this.storage.saveRecipe(this.recipe);
  }

  findFermentable() {
    return this.fermentables.find((item) => item.name === this.newFermentable?.name);
  }

  openHop() {
    this.addHopOpen = true;
  }

  closeHop() {
    if (this.isEdit) {
      this.storage.saveRecipe(this.recipe);
    }
    this.addHopOpen = false;
    setTimeout(() => {
      this.isEdit = false;
      this.newHop = undefined;
    }, 250)
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
    if (this.newHop!.use === 'Aroma') {
      this.newHop!.time = CONFIG.aromaTime;
    }
  }

  addHop() {
    if (this.newHop) {
      this.recipe.hops.push(this.newHop);
      this.storage.saveRecipe(this.recipe);
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
    this.storage.saveRecipe(this.recipe);
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
      this.storage.saveRecipe(this.recipe);
    }
    this.addYeastOpen = false;
    setTimeout(() => {
      this.isEdit = false;
      this.newYeast = undefined;
    }, 250)
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
      this.storage.saveRecipe(this.recipe);
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
    this.storage.saveRecipe(this.recipe);
  }

  findYeast() {
    return this.yeasts.find((item) => item.name === this.newYeast?.name);
  }

  openMisc() {
    this.addMiscOpen = true;
  }

  closeMisc() {
    if (this.isEdit) {
      this.storage.saveRecipe(this.recipe);
    }
    this.addMiscOpen = false;
    setTimeout(() => {
      this.isEdit = false;
      this.newMisc = undefined;
    }, 250)
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
      this.storage.saveRecipe(this.recipe);
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
    this.storage.saveRecipe(this.recipe);
  }

  findMisc() {
    return this.miscs.find((item) => item.name === this.newMisc?.name);
  }

  getMiscAmount() {
    return this.newMisc?.amount ? this.newMisc.amount * 1000 : undefined;
  }

  checkOveruse(fermentable: Fermentable, recipe: Recipe) {
    if (fermentable.maxInBatch && fermentable.maxInBatch < RecipeUtil.getFermentablePercentage(fermentable, recipe)) {
      return 'red';
    } else {
      return '';
    }
  }

  checkOvertime(hop: Hop, recipe: Recipe) {
    if (hop.time && hop.time > recipe.boilTime) {
      return 'red';
    } else {
      return '';
    }
  }
}
