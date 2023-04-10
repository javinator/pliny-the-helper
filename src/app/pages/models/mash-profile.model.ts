import {MashStep} from "./mash-step.model";

export interface MashProfile {
  name: string,
  version: number,
  grainTemp: number,
  mashSteps: Array<MashStep>,
  tunTemp: number,
  spargeTemp: number,
  pH: number,
  tunWeight: number,
  tunSpecificHeat: number,
  notes: string,
  equipAdjust: boolean,
  id: number,
  ownerId: number,
  mashType: 'Infusion' | 'Temperature' | 'Decoction' | 'BIAB',
  spargeType: 'Batch' | 'Fly' | 'BIAB'
}
