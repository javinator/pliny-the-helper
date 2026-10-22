import {Component, input, ChangeDetectionStrategy} from "@angular/core";
import {Hop} from "models";
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle} from "@ionic/angular";

@Component({
  selector: 'hops-card',
  templateUrl: 'hops-card.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class HopsCardComponent {
  hop = input.required<Hop>()
}
