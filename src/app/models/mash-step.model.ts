export interface MashStep {
  name: string,
  version: number,
  type: 'Infusion' | 'Temperature' | 'Decoction',
  infuseAmount?: number,
  stepTemp: number,
  stepTime: number,
  rampTime?: number,
  endTemp?: number,
  description?: string,
  waterToGrainRatio?: number,
  decoctAmount?: number
}
