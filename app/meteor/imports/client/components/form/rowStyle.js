import { darkGrayActive } from "../../layout/styles"

export const flex = {
  display: 'flex'
}

export const grow = {
  flexGrow: 1
}

export const shrink = {
  flexShrink: 1
}

export const rowStyle = {
  display: 'flex',
  marginTop: 0,
  zIndex: 19,
  paddingRight: 16
}

export const iconStyle = {
  textAlign: 'center',
  paddingLeft: 6,
  paddingRight: 6,
  minWidth: 50,
  marginTop: 25
}

export const buttonStyle = {
  ...iconStyle,
  marginTop: 16,
  color: darkGrayActive
}
