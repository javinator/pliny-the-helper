import {Ingredient} from "./ingredient.model";

export interface Hop extends Ingredient {
  alpha: number,
  use: 'Boil' | 'Dry Hop' | 'Mash' | 'First Wort' | 'Aroma',
  type: 'Bittering' | 'Aroma' | 'Both',
  form: 'Pellet' | 'Plug' | 'Whole',
  origin: string,
  description: string,
  substitutes?: Array<string>
}
