import {Component, input, ChangeDetectionStrategy} from "@angular/core";
import {Misc} from "models";
import {IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle} from "@ionic/angular";

@Component({
  selector: 'miscs-card',
  templateUrl: 'miscs-card.component.html',
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
export class MiscsCardComponent {
  misc = input.required<Misc>();
}
