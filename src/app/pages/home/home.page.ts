import {Component} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {Storage} from "@ionic/storage-angular";
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class HomePage {
  constructor(private storage: StorageService) {
  }
}
