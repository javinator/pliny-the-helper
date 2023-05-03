export interface BeerStyle {
  name: string,
  category: string,
  categoryNumber: number,
  version: number,
  styleLetter: string,
  styleGuide: string,
  type: 'Ale' | 'Lager' | 'Mead' | 'Wheat' | 'Mixed' | 'Cider',
  notes: string,
  profile: string,
  ingredients: string,
  examples: string,
  minOg: number,
  maxOg: number,
  minFg: number,
  maxFg: number,
  minIbu: number,
  maxIbu: number,
  minColor: number,
  maxColor: number,
  minAbv: number,
  maxAbv: number,
  minCarb?: number,
  maxCarb?: number
}
