import {Ingredient} from "./ingredient.model";

export interface Misc extends Ingredient {
  type: 'Spice' | 'Fining' | 'Water Agent' | 'Herb' | 'Flavor' | 'Other',
  use: 'Boil' | 'Dry Hop' | 'Mash' | 'First Wort' | 'Aroma',
  description: string,
  amountIsWeight?: boolean,
  useFor?: string
}
