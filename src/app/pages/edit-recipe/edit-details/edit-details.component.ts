import {Component, Input, OnInit} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Recipe} from "../../../models/recipe.model";
import {StorageService} from "../../../services/storage.service";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'edit-details-card',
  templateUrl: 'edit-details.component.html',
  styleUrls: ['../../../app.component.scss'],
  standalone: true,
  imports: [IonicModule, DecimalPipe],
})
export class EditDetailsComponent {
  constructor(private storage: StorageService) {
  }

  @Input()
  recipe!: Recipe;

  changeName(event: any) {
    this.recipe.name = event.target.value;
    this.storage.saveRecipe(this.recipe);
  }
}
