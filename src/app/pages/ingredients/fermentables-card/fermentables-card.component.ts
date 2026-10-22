import {Component, input, ChangeDetectionStrategy} from "@angular/core";
import {Fermentable} from "models";
import {IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from "@ionic/angular";

@Component({
  selector: 'fermentables-card',
  templateUrl: 'fermentables-card.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent
  ]
})
export class FermentablesCardComponent {
  fermentable = input.required<Fermentable>();
}
