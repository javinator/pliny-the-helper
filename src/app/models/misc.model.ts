import {Ingredient} from "./ingredient.model";

export interface Misc extends Ingredient {
  type: 'Spice' | 'Fining' | 'Water Agent' | 'Herb' | 'Flavor' | 'Other',
  use: 'Boil' | 'Mash' | 'Primary' | 'Secondary' | 'Bottling',
  description: string,
  amountIsWeight?: boolean,
  useFor?: string
}
