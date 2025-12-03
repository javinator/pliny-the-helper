import {Component, Input} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'recipe-card',
  templateUrl: 'recipe-card.component.html',
  standalone: true,
  imports: [IonicModule, DecimalPipe],
})
export class RecipeCardComponent {
  @Input()
  name!: string;

  @Input()
  style!: string;

  @Input()
  color: number = 2;

  @Input()
  abv!: number;

  @Input()
  ibu!: number;

  @Input()
  batchSize!: number;
}
