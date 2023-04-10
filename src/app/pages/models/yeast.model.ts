import {Ingredient} from "./ingredient.model";

export interface Yeast extends Ingredient {
  type: 'Ale' | 'Lager' | 'Wheat' | 'Wine' | 'Champagne',
  form: 'Liquid' | 'Dry',
  minTemp: number,
  maxTemp: number,
  attenuation: number,
  notes: string,
  bestFor: string,
  productId: string,
  lab: string
}
