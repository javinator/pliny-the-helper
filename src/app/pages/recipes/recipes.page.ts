import {Component} from '@angular/core';
import {IonicModule, Platform} from '@ionic/angular';
import {Recipe} from "models";
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {StorageService, XmlReaderService, XmlWriterService} from "services";
import {RecipeCardComponent} from "./recipe-card/recipe-card.component";
import {FilePicker} from "@capawesome/capacitor-file-picker";

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
  isExportOpen = false;
  isToastOpen = false;
  showSpinner = false;

  constructor(
    private storage: StorageService,
    private router: Router,
    private xmlWriter: XmlWriterService,
    private platform: Platform,
    private xmlReader: XmlReaderService) {
  }

  ionViewWillEnter() {
    this.showSpinner = true;
    this.storage.get('recipes')?.then((response) => {
      this.recipes = response;
      this.recipes?.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  ionViewDidEnter() {
    setTimeout(() => this.showSpinner = false, 500);
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

  openExport() {
    this.isExportOpen = true;
  }

  closeExport() {
    this.isExportOpen = false;
  }

  exportRecipes(recipes?: Recipe[]) {
    this.xmlWriter.recipesToXml(recipes || []);
    if (this.platform.is('hybrid')) {
      this.isToastOpen = true;
    }
    this.isExportOpen = false;
  }

  importRecipes() {
    FilePicker.pickFiles({
      types: ['text/xml'],
      multiple: false,
      readData: true
    }).then((result) => {
      this.xmlReader.readRecipes(b64_to_utf8(result.files[0].data as string));
      this.showSpinner = true;
      setTimeout(() => {
        this.storage.get('recipes')?.then((response) => {
          this.recipes = response;
          this.showSpinner = false;
        });
      }, 500);
    });
  }

  closeToast() {
    this.isToastOpen = false;
  }
}

function b64_to_utf8(str: string) {
  return decodeURIComponent(escape(window.atob(str)));
}
