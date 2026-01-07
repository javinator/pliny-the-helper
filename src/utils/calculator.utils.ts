export class CalculatorUtil {
  static abv(og: number, fg: number) {
    return (76 * (og - fg) / (1.777 - og)) * (fg / 0.8)
  }

  static attenuation(og: number, fg: number) {
    return (og - fg) / (og - 1)
  }


  static sgToBrix(sg: number) {
    return (((182.4601 * sg - 775.6821) * sg + 1262.7794) * sg - 669.5622)
  }

  static brixToSg(brix: number) {
    return (brix / (258.6 - ((brix / 258.2) * 227.1))) + 1
  }

  static srmToLovibond(srm: number) {
    return srm / 1.35;
  }

  static lovibondToSrm(lovibond: number) {
    return lovibond * 1.35;
  }

  static srmToEbc(srm: number) {
    return 1.97 * srm;
  }

  static ebcToSrm(ebc: number) {
    return ebc / 1.97;
  }

  static lovibondToEbc(lovibond: number) {
    return lovibond * 1.35 * 1.97;
  }

  static ebcToLovibond(ebc: number) {
    return ebc / 1.97 / 1.35;
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

  static poundsToKilos(pounds: number) {
    return pounds / 2.204;
  }

  static kilosToOunces(kilo: number) {
    return kilo * 35.2739619;
  }

  static ouncesToGrams(ounces: number) {
    return ounces / 0.0352739619;
  }

  static litersToGallons(liter: number) {
    return liter * 0.264172052
  }

  static gallonsToLiters(gallons: number) {
    return gallons / 0.264172052
  }
}
