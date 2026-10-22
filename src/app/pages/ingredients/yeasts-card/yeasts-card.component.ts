import {Component, input, ChangeDetectionStrategy} from "@angular/core";
import {Yeast} from "models";
import {DecimalPipe} from "@angular/common";
import {IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from "@ionic/angular";

@Component({
  selector: 'yeasts-card',
  templateUrl: 'yeasts-card.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [DecimalPipe, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent],
})
export class YeastsCardComponent {
  yeast = input.required<Yeast>();
}
