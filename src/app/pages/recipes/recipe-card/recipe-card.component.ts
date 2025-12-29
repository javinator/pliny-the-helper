import {Component, input} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'recipe-card',
  templateUrl: 'recipe-card.component.html',
  standalone: true,
  imports: [IonicModule, DecimalPipe],
})
export class RecipeCardComponent {
  name = input.required<string>()
  style = input.required<string>()
  abv = input.required<number>()
  ibu = input.required<number>()
  batchSize = input.required<number>()
  color = input(1)
}
