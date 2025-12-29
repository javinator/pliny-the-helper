import {Component, input} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {Fermentable} from "models";

@Component({
  selector: 'fermentables-card',
  templateUrl: 'fermentables-card.component.html',
  standalone: true,
  imports: [IonicModule],
})
export class FermentablesCardComponent {
  fermentable = input.required<Fermentable>();
}
