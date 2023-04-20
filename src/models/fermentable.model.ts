import {Ingredient} from "./ingredient.model";

export interface Fermentable extends Ingredient {
  type: 'Grain' | 'Extract' | 'Adjunct' | 'Sugar',
  yield: number,
  color: number,
  description: string,
  maxInBatch?: number,
  origin?: string,
  supplier?: string
}
