declare global {
  interface UIStyledComponentPropTypes {
    theme?: UITheme
  }
  interface UITheme {
    pumpkin: string,
    dimOrange: string,
    orange: string,
    white: string,
    blueFacebook: string,
    matteBlack: string,
    matteWhite: string,
    darkGrey: string,
    grey: string,
    carrot: string,
    black: string,
    nephritis: string,
    sunflower: string,
  }
}
export default {
  pumpkin: '#f15a22',
  dimOrange: '#b5441a',
  orange: '#f68d66',
  white: '#fff',
  blueFacebook: '#3b5998',
  matteBlack: '#333',
  matteWhite: '#f7f7f7',
  darkGrey: '#bcbcbc',
  grey: '#ddd',
  carrot: '#f18822',
  black: '#000',
  nephritis: '#27ae60',
  sunflower: '#F18822'
} as UITheme
