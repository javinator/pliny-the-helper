export class CalculatorUtil {
  static abv(og: number, fg: number) {
    return (76.08 * (og - fg) / (1.775 - og)) * (fg / 0.794)
  }

  static sgToBrix(sg: number) {
    return (((182.4601 * sg - 775.6821) * sg + 1262.7794) * sg - 669.5622)
  }

  static brixToSg(brix: number) {
    return (brix / (258.6 - ((brix / 258.2) * 227.1))) + 1
  }

  static celsiusToFahrenheit(temp: number) {
    return temp * 1.8 + 32;
  }

  static fahrenheitToCelsius(temp: number) {
    return (temp - 32) / 1.8;
  }

  static kilosToPounds(kilo: number) {
    return kilo * 2.204;
  }

  static kilosToOunces(kilo: number) {
    return kilo * 35.2739619;
  }

  static litersToGallons(liter: number) {
    return liter * 0.264172052
  }
}
