import {Component, input, ChangeDetectionStrategy} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {Misc} from "models";

@Component({
  selector: 'miscs-card',
  templateUrl: 'miscs-card.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [IonicModule],
})
export class MiscsCardComponent {
  misc = input.required<Misc>();
}
