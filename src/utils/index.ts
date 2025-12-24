export * from './calculator.utils'
export * from './recipe-calculator.utils'
export * from './water-calculator.utils'

export function deepClone(object: any) {
  return JSON.parse(JSON.stringify(object));
}
