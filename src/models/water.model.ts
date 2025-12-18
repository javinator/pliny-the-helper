import {Ingredient} from "./ingredient.model";

export interface Water extends Ingredient {
  uid: string;
  calcium: number;
  bicarbonate: number;
  sulfate: number;
  chloride: number;
  sodium: number;
  magnesium: number;
  ph?: number;
  alkalinity?: number;
  description?: string;
  isCustom?: boolean;
}
