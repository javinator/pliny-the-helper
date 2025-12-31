import {Component, inject} from '@angular/core';
import {IonicModule, Platform} from '@ionic/angular';
import {Recipe, Settings} from "models";
import {Router, RouterLink} from "@angular/router";
import {CloudStorageService, StorageService, XmlReaderService, XmlWriterService} from "services";
import {RecipeCardComponent} from "./recipe-card/recipe-card.component";
import {FilePicker} from "@capawesome/capacitor-file-picker";
import {catchError, of} from "rxjs";

@Component({
  selector: 'recipes-page',
  templateUrl: 'recipes.page.html',
  styleUrl: 'recipes.page.scss',
  standalone: true,
  imports: [IonicModule, RouterLink, RecipeCardComponent]
})
export class RecipesPage {
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);
  private readonly xmlWriter = inject(XmlWriterService);
  private readonly platform = inject(Platform);
  private readonly xmlReader = inject(XmlReaderService);
  private readonly cloudService = inject(CloudStorageService);


  recipes?: Recipe[];
  f_recipes?: Recipe[];
  settings?: Settings;
  selectedRecipes: Recipe[] = [];
  allSelected = false;
  isExportOpen = false;
  isToastOpen = false;
  isCloudOpen = false;
  showSpinner = false;
  recipeToEdit?: string;

  ionViewWillEnter() {
    this.showSpinner = true;
    this.storage.get('recipes')?.then((response) => {
      this.recipes = response;
      this.recipes?.sort((a, b) => a.name.localeCompare(b.name));
      this.f_recipes = this.recipes;
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
          document.getElementById(this.recipeToEdit)?.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      }, 100);
    }, 250);
  }

  filter(event: any) {
    const query = event.target.value.toLowerCase();
    this.f_recipes = this.recipes?.filter(d => d.name.toLowerCase().includes(query));
  }

  showEdit(recipe: Recipe) {
    this.recipeToEdit = recipe.uid;
    this.router.navigate(['edit-recipe', recipe.uid]);
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
        this.storage.get('recipes')?.then((response: Recipe[] | undefined) => {
          this.recipes = response?.sort((a, b) => a.name.localeCompare(b.name));
          this.f_recipes = this.recipes
          this.showSpinner = false;
        });
      }, 1000);
    }).catch(_ => {
    });
  }

  closeToast() {
    this.isToastOpen = false;
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
        console.warn(err);
        setTimeout(() => {
          this.showSpinner = false;
        }, 100);
        return of();
      })).subscribe(res => {
      this.recipes = [...res].sort((a, b) => a.name.localeCompare(b.name));
      this.f_recipes = this.recipes;
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
        console.warn(err);
        setTimeout(() => {
          this.showSpinner = false;
        }, 100);
        return of();
      })).subscribe(() => {
      setTimeout(() => {
        this.showSpinner = false;
      }, 100);
    })
  }
}

function b64_to_utf8(str: string): string {
  const bytes = Uint8Array.from(atob(str), c => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}
