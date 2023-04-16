import {Component, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe} from "../../models/recipe.model";
import {Router} from "@angular/router";
import {StorageService} from "../../services/storage.service";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";
import {EditIngredientsComponent} from "./edit-ingredients/edit-ingredients.component";
import {EditDetailsComponent} from "./edit-details/edit-details.component";

@Component({
  selector: 'edit-recipe-page',
  templateUrl: 'edit-recipe.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, EditIngredientsComponent, EditDetailsComponent, NgSwitch, NgSwitchCase, NgForOf, NgIf],
})
export class EditRecipePage implements OnInit {

  activeTab = 'ingredients';

  uid!: string;
  recipe?: Recipe;

  constructor(private router: Router, private storage: StorageService) {
    this.uid = this.router.getCurrentNavigation()?.extras.state?.['recipe'];
  }

  public deleteButtons = [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.deleteRecipe();
      }
    }
  ];

  ngOnInit() {
    this.storage.getRecipe(this.uid).then((recipe) => this.recipe = recipe);
  }

  tabChanged(event: any) {
    this.activeTab = event.detail.value
  }

  navigateBack() {
    this.router.navigate(['recipes']);
  }

  deleteRecipe() {
    this.storage.deleteRecipe(this.uid)?.then(() => this.navigateBack());
  }
}
