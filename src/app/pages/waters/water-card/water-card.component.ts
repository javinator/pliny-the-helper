import {Component, EventEmitter, input, Output, ChangeDetectionStrategy} from "@angular/core";
import {Water} from "models";
import {DecimalPipe} from "@angular/common";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow
} from "@ionic/angular";

@Component({
  selector: 'water-card',
  templateUrl: 'water-card.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DecimalPipe, IonCard, IonCardHeader, IonRow, IonCol, IonCardTitle, IonButton, IonIcon, IonCardContent, IonGrid],
})
export class WaterCardComponent {
  @Output() deleteWater = new EventEmitter<void>();
  water = input.required<Water>();

}
