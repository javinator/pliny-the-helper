import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe} from "../../models/recipe.model";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {Location, NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {Fermentable} from "../../models/fermentable.model";
import {Hop} from "../../models/hop.model";
import {Yeast} from "../../models/yeast.model";
import {Misc} from "../../models/misc.model";
import {EditIngredientsComponent} from "./edit-ingredients/edit-ingredients.component";
import {EditDetailsComponent} from "./edit-details/edit-details.component";

@Component({
  selector: 'edit-recipe-page',
  templateUrl: 'edit-recipe.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, EditIngredientsComponent, EditDetailsComponent, NgSwitch, NgSwitchCase, NgForOf, NgIf],
})
export class EditRecipePage {
  constructor(private router: Router, private storage: StorageService) {
    this.recipe = this.router.getCurrentNavigation()?.extras.state?.['recipe'];
  }

  activeTab = 'ingredients';

  recipe!: Recipe;

  tabChanged(event: any) {
    this.activeTab = event.detail.value
  }

  navigateBack() {
    this.router.navigate(['recipes']);
  }
}
