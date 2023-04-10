import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe} from "../models/recipe.model";
import {Router} from "@angular/router";

@Component({
  selector: 'edit-recipe-page',
  templateUrl: 'edit-recipe.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class EditRecipePage {
  constructor(private router: Router) {
    this.recipe = this.router.getCurrentNavigation()?.extras.state?.['recipe'];
  }

  recipe!: Recipe;
}
