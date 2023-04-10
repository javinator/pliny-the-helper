import {Ingredient} from "./ingredient.model";

export interface Misc extends Ingredient {
  miscType: 'Spice' | 'Fining' | 'Water Agent' | 'Herb' | 'Flavor' | 'Other',
  use: 'Boil' | 'Dry Hop' | 'Mash' | 'First Wort' | 'Aroma',
  amountIsWeight: boolean,
  useFor: string,
  notes: string
}
