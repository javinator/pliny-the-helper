import {Component, input, ChangeDetectionStrategy} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {Hop} from "models";

@Component({
  selector: 'hops-card',
  templateUrl: 'hops-card.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [IonicModule],
})
export class HopsCardComponent {
  hop = input.required<Hop>()
}
