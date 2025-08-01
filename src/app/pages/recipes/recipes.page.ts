import { Component, inject } from '@angular/core';
import {AlertController, IonicModule, IonRouterOutlet, Platform} from '@ionic/angular';
import {Recipe} from "models";
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {StorageService, XmlReaderService, XmlWriterService} from "services";
import {RecipeCardComponent} from "./recipe-card/recipe-card.component";
import {FilePicker} from "@capawesome/capacitor-file-picker";
import {App} from "@capacitor/app";

@Component({
  selector: 'recipes-page',
  templateUrl: 'recipes.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, RouterLink, RecipeCardComponent, NgForOf]
})
export class RecipesPage {
  private storage = inject(StorageService);
  private router = inject(Router);
  private xmlWriter = inject(XmlWriterService);
  private platform = inject(Platform);
  private xmlReader = inject(XmlReaderService);
  alertController = inject(AlertController);
  private routerOutlet = inject(IonRouterOutlet, { optional: true });

  recipes?: Recipe[];
  selectedRecipes: Recipe[] = [];
  allSelected = false;
  isExportOpen = false;
  isToastOpen = false;
  showSpinner = false;
  exitOpen = false;
  recipeToEdit?: string;

  constructor() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet?.canGoBack() && !this.exitOpen) {
        this.showExitConfirm()
      }
    });
  }

  ionViewWillEnter() {
    this.showSpinner = true;
    this.storage.get('recipes')?.then((response) => {
      this.recipes = response;
      this.recipes?.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.showSpinner = false;
      setTimeout(() => {
        if (this.recipeToEdit != undefined) {
          document.getElementById(this.recipeToEdit)?.scrollIntoView();
        }
      }, 100);
    }, 250);
  }

  showEdit(recipe: Recipe) {
    this.recipeToEdit = recipe.uid;
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
    this.storage.get('settings')?.then(settings => {
      this.xmlWriter.recipesToXml(recipes || [], settings.minimizeExport);
      if (this.platform.is('hybrid')) {
        this.isToastOpen = true;
      }
      this.isExportOpen = false;
    })
  }

  importRecipes() {
    FilePicker.pickFiles({
      types: ['text/xml'],
      limit: 1,
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

  showExitConfirm() {
    this.exitOpen = true;
    this.alertController.create({
      header: 'Quit Pliny',
      message: 'Do you really want to close the app?',
      backdropDismiss: false,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.exitOpen = false;
          console.log('Application exit cancelled!');
        }
      }, {
        text: 'Exit',
        handler: () => {
          App.exitApp();
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }
}

function b64_to_utf8(str: string) {
  return decodeURIComponent(escape(window.atob(str)));
}
