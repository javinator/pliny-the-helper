import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'new-recipe-page',
  templateUrl: 'new-recipe.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class NewRecipePage {
  constructor(private storage: StorageService) {
  }


}
