import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe} from "../../models/recipe.model";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {Location} from "@angular/common";

@Component({
  selector: 'edit-recipe-page',
  templateUrl: 'edit-recipe.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class EditRecipePage {
  constructor(private router: Router, private storage: StorageService) {
    this.recipe = this.router.getCurrentNavigation()?.extras.state?.['recipe'];
  }

  recipe!: Recipe;

  navigateBack() {
    this.router.navigate(['recipes']);
  }

  changeName(event: any) {
    this.recipe.name = event.target.value;
    this.storage.saveRecipe(this.recipe);
  }
}
