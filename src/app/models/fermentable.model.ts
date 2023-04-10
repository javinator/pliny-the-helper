import {Ingredient} from "./ingredient.model";

export interface Fermentable extends Ingredient {
  type: 'Grain' | 'Extract' | 'Adjunct',
  yield: number,
  color: number,
  maxInBatch: number,
  description: string,
  origin?: string
}
