export interface MashStep {
  name: string,
  version: number,
  type: 'Infusion' | 'Temperature' | 'Decoction' | 'Lautering',
  infuseAmount?: number,
  stepTemp: number,
  stepTime: number,
  rampTime?: number,
  endTemp?: number,
  description?: string,
  waterToGrainRatio?: number,
  decoctAmount?: number
}
