import {BeerStyle} from "./beer-style.model";
import {Hop} from "./hop.model";
import {Fermentable} from "./fermentable.model";
import {Yeast} from "./yeast.model";
import {Misc} from "./misc.model";
import {Water} from "./water.model";
import {MashProfile} from "./mash-profile.model";

export interface Recipe {
  id: string,
  name: string,
  version: number,
  type: 'All Grain' | 'Extract' | 'Partial Mash',
  style: BeerStyle,
  brewer: string,
  batchSize: number,
  boilSize: number,
  boilTime: number,
  efficiency: number,
  hops: Array<Hop>,
  fermentables: Array<Fermentable>,
  yeasts: Array<Yeast>,
  miscs: Array<Misc>,
  waters: Array<Water>,
  mashProfile: MashProfile,
  OG: number,
  FG: number,
  ABV: number,
  IBU: number,
  color: number,
  measuredOG: number,
  measuredFG: number,
  measuredVol: number,
  brewDate: Date
}
