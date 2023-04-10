import {Ingredient} from "./ingredient.model";

export interface Fermentable extends Ingredient {
  type: 'Grain' | 'Extract' | 'Adjunct',
  yield: number,
  color: number,
  addAfterBoil: boolean,
  maxInBatch: number,
  description: string
}
