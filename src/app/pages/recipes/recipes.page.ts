import {Component, inject} from '@angular/core';
import {AlertController, IonicModule, IonRouterOutlet, Platform} from '@ionic/angular';
import {Recipe, Settings} from "models";
import {Router, RouterLink} from "@angular/router";
import {StorageService, XmlReaderService, XmlWriterService, CloudStorageService} from "services";
import {RecipeCardComponent} from "./recipe-card/recipe-card.component";
import {FilePicker} from "@capawesome/capacitor-file-picker";
import {App} from "@capacitor/app";
import {catchError, of} from "rxjs";

@Component({
  selector: 'recipes-page',
  templateUrl: 'recipes.page.html',
  standalone: true,
  imports: [IonicModule, RouterLink, RecipeCardComponent]
})
export class RecipesPage {
  private storage = inject(StorageService);
  private router = inject(Router);
  private xmlWriter = inject(XmlWriterService);
  private platform = inject(Platform);
  private xmlReader = inject(XmlReaderService);
  alertController = inject(AlertController);
  private routerOutlet = inject(IonRouterOutlet, {optional: true});
  private cloudService = inject(CloudStorageService);

  recipes?: Recipe[];
  settings?: Settings;
  selectedRecipes: Recipe[] = [];
  allSelected = false;
  isExportOpen = false;
  isToastOpen = false;
  isCloudOpen = false;
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
    this.storage.get('settings')?.then((response) => {
      this.settings = response;
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
      this.xmlWriter.recipesToXml(recipes || [], settings?.minimizeExport || false);
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

  hasCloudSettings() {
    return !!(this.settings?.cloudEmail && this.settings.cloudPassword);
  }

  openCloud() {
    this.isCloudOpen = true;
  }

  closeCloud() {
    this.isCloudOpen = false;
  }

  importRecipesFromCloud() {
    this.showSpinner = true;
    this.closeCloud();
    this.cloudService.getRecipes(this.settings?.cloudEmail || '', this.settings?.cloudPassword || '')
      .pipe(catchError(err => {
        console.log(err);
        setTimeout(() => {
          this.showSpinner = false;
        }, 100);
        return of();
      })).subscribe(res => {
      this.recipes = res;
      this.storage.deleteRecipes()?.then(() =>
        this.storage.addRecipes(res)?.then(() => {
          setTimeout(() => {
            this.showSpinner = false;
          }, 100);
        })
      )
    })

  }

  exportRecipesToCloud() {
    this.showSpinner = true;
    this.closeCloud();
    this.cloudService.saveRecipes(this.settings?.cloudEmail || '', this.settings?.cloudPassword || '', this.recipes || [])
      .pipe(catchError(err => {
        console.log(err);
        setTimeout(() => {
          this.showSpinner = false;
        }, 100);
        return of();
      })).subscribe(res => {
      console.log(res)
      setTimeout(() => {
        this.showSpinner = false;
      }, 100);
    })
  }
}

function b64_to_utf8(str: string) {
  return decodeURIComponent(escape(window.atob(str)));
}
