import {Component, Input} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {Fermentable} from "models";
import {NgIf} from "@angular/common";

@Component({
  selector: 'fermentables-card',
  templateUrl: 'fermentables-card.component.html',
  standalone: true,
  imports: [IonicModule, NgIf],
})
export class FermentablesCardComponent {
  @Input()
  fermentable!: Fermentable;

}
