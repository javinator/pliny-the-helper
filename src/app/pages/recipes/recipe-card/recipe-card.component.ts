import {Component, input, ChangeDetectionStrategy} from "@angular/core";
import {DecimalPipe} from "@angular/common";
import {IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonImg, IonRow} from "@ionic/angular";

@Component({
  selector: 'recipe-card',
  templateUrl: 'recipe-card.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DecimalPipe, IonCard, IonCardHeader, IonRow, IonCol, IonImg, IonCardTitle, IonCardSubtitle],
})
export class RecipeCardComponent {
  name = input.required<string>()
  style = input.required<string>()
  abv = input.required<number>()
  ibu = input.required<number>()
  batchSize = input.required<number>()
  color = input(1)
}
