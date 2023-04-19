import {Component} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {CalculatorUtil} from "../../../utils/calculator.utils";
import {DecimalPipe, NgIf} from "@angular/common";

@Component({
  selector: 'conversion-card',
  templateUrl: 'conversion-card.component.html',
  standalone: true,
  styleUrls: ['../../edit-recipe/edit-details/edit-details.component.scss'],
  imports: [IonicModule, NgIf, DecimalPipe],
})
export class ConversionCardComponent {

  brix?: number;
  sg?: number;

  srm?: number;
  ebc?: number;
  lovibond?: number;

  fahrenheit?: number;
  celsius?: number;

  pounds?: number;
  kilos?: number;

  ounces?: number;
  grams?: number;

  gallons?: number;
  liters?: number;

  calculateBrix(event: any) {
    this.brix = CalculatorUtil.sgToBrix(event.detail.value);
  }

  calculateSg(event: any) {
    this.sg = CalculatorUtil.brixToSg(event.detail.value);
  }

  calculateFromSRM(event: any) {
    this.lovibond = CalculatorUtil.srmToLovibond(event.detail.value);
    this.ebc = CalculatorUtil.srmToEbc(event.detail.value);
  }

  calculateFromEBC(event: any) {
    this.lovibond = CalculatorUtil.ebcToLovibond(event.detail.value);
    this.srm = CalculatorUtil.ebcToSrm(event.detail.value);
  }

  calculateFromLovibond(event: any) {
    this.ebc = CalculatorUtil.lovibondToEbc(event.detail.value);
    this.srm = CalculatorUtil.lovibondToSrm(event.detail.value);
  }

  calculateFahrenheit(event: any) {
    this.fahrenheit = CalculatorUtil.celsiusToFahrenheit(event.detail.value);
  }

  calculateCelsius(event: any) {
    this.celsius = CalculatorUtil.fahrenheitToCelsius(event.detail.value);
  }

  calculatePounds(event: any) {
    this.pounds = CalculatorUtil.kilosToPounds(event.detail.value);
  }

  calculateKilos(event: any) {
    this.kilos = CalculatorUtil.poundsToKilos(event.detail.value);
  }

  calculateOunces(event: any) {
    this.ounces = CalculatorUtil.kilosToOunces(event.detail.value / 1000);
  }

  calculateGrams(event: any) {
    this.grams = CalculatorUtil.ouncesToGrams(event.detail.value);
  }

  calculateGallons(event: any) {
    this.gallons = CalculatorUtil.litersToGallons(event.detail.value);
  }

  calculateLiters(event: any) {
    this.liters = CalculatorUtil.gallonsToLiters(event.detail.value);
  }

}
