import {Component, input} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {Misc} from "models";

@Component({
  selector: 'miscs-card',
  templateUrl: 'miscs-card.component.html',
  standalone: true,
  imports: [IonicModule],
})
export class MiscsCardComponent {
  misc = input.required<Misc>();
}
