declare module 'polished' {
  type Ratio =
    | number
    | 'minorSecond'
    | 'majorSecond'
    | 'minorThird'
    | 'majorThird'
    | 'perfectFourth'
    | 'augFourth'
    | 'perfectFifth'
    | 'minorSixth'
    | 'goldenSection'
    | 'majorSixth'
    | 'minorSeventh'
    | 'majorSeventh'
    | 'octave'
    | 'majorTenth'
    | 'majorEleventh'
    | 'majorTwelfth'
    | 'doubleOctave'
  
  export function clearFix(parent?: string): string;
  export function ellipsis(width?: string): string;
  export function hiDPI(ratio?: number): string;
  export function hideText(): string;
  export function normalize(excludeOpinionated?: boolean): string;
  export function directionalProperty(property: string, values?: string[]): string;
  export function em(pxval: string | number, base?: string | number): string;
  export function modularScale(steps: number, base?: string | number, ratio?: Ratio): string;
  export function placeholder(styles: object, parent?: string): string;
  export function rem(pxval: string | number, base?: string | number): string;

}