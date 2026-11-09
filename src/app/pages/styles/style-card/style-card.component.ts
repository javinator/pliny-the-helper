import {Component, input, ChangeDetectionStrategy} from "@angular/core";
import {BeerStyle} from "models";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonImg,
  IonRow
} from "@ionic/angular";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'style-card',
  templateUrl: 'style-card.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    IonCard,
    IonCardHeader,
    IonRow,
    IonCol,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    NgOptimizedImage
  ]
})
export class StyleCardComponent {
  style = input.required<BeerStyle>();

  color() {
    return Math.floor((Number(this.style().maxColor) + Number(this.style().minColor)) / 2);
  }
}
