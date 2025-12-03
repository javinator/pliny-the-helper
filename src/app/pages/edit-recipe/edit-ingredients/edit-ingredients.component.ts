import {Component, Input, OnInit, inject} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe, Fermentable, Hop, Yeast, Misc} from "models";
import {DecimalPipe} from "@angular/common";
import {StorageService} from "services";
import {RecipeUtil} from "utils";
import {CONFIG} from "../../../app.constants";
import {SelectSearchComponent} from "@shared";

@Component({
  selector: 'edit-ingredients-card',
  templateUrl: 'edit-ingredients.component.html',
  styleUrls: ['edit-ingredients.component.scss'],
  standalone: true,
  imports: [IonicModule, DecimalPipe, SelectSearchComponent],
})
export class EditIngredientsComponent implements OnInit {
  private storage = inject(StorageService);

  RecipeUtil = RecipeUtil;

  @Input()
  recipe!: Recipe;

  @Input()
  hideDescription?: boolean = false;

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

  getFermentables() {
    return this.fermentables.map((fermentable) => {
      return {
        name: fermentable.name,
        additionalInfo: ' (' + fermentable.color + ' °L)',
        description: fermentable.description + ' Up to ' + (fermentable.maxInBatch || 100) + '%.'
      }
    });
  }

  chooseFermentable(event: any) {
    this.newFermentable = JSON.parse(JSON.stringify(this.fermentables.find((item) => item.name === event)));
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

  getHops() {
    return this.hops.map((hop) => {
      return {
        name: hop.name,
        additionalInfo: ' (' + hop.alpha + ' %)',
        description: hop.description
      }
    });
  }

  chooseHop(event: any) {
    this.newHop = JSON.parse(JSON.stringify(this.hops.find((item) => item.name === event)));
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

  getYeasts() {
    return this.yeasts.map((yeast) => {
      return {
        name: yeast.name,
        additionalInfo: ' (' + yeast.attenuation + ' %)',
        description: yeast.description + '. Optimal temperature between ' + yeast.minTemp + ' °C and ' + yeast.maxTemp + ' °C. Alcohol tolerant up to ' + yeast.maxAbv + ' %.'
      }
    });
  }

  chooseYeast(event: any) {
    this.newYeast = JSON.parse(JSON.stringify(this.yeasts.find((item) => item.name === event)));
  }

  setYeastAttenuation(event: any) {
    this.newYeast!.attenuation = event.detail.value;
  }

  setYeastAmount(event: any) {
    this.newYeast!.amount = event.detail.value;
  }

  addYeast() {
    if (this.newYeast) {
      if (!this.newYeast.amount) {
        this.newYeast.amount = 1;
      }
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

  getMiscs() {
    return this.miscs.map((misc) => {
      return {
        name: misc.name,
        description: misc.description
      }
    });
  }

  chooseMisc(event: any) {
    this.newMisc = JSON.parse(JSON.stringify(this.miscs.find((item) => item.name === event)));
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
    if (hop.time && Number(hop.time) > recipe.boilTime && hop.use !== 'Dry Hop') {
      return 'red';
    } else {
      return '';
    }
  }

  checkOverAbv(yeast: Yeast, recipe: Recipe) {
    if (yeast.maxAbv && yeast.maxAbv < recipe.ABV) {
      return 'red';
    } else {
      return '';
    }
  }
}
