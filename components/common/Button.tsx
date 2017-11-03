
import * as React from 'react'
import { compose, withProps } from 'recompose'
import styled from 'styled-components'

const PrimaryButtonRoot = styled.button`
  font-size: 1em;
  min-width: 100px;
  padding: 7px 12px;
  border-radius: 5px;
  border: none;
  background-color: ${(props: UIStyledComponentPropTypes) => props.theme.pumpkin};
  color: white;
  cursor: pointer;
  font-family: "-DB-HeaventRounded", Helvetica Neue, sans-serif;
  font-weight: 700;
  &:hover{
    opacity: 0.8;
  }
  &:disabled {
    cursor: default;
    background-color: ${(props: UIStyledComponentPropTypes) => props.theme.darkGrey};
    &:hover {
      opacity: 1;
    }
  }
  &:focus {
    outline: none;
  }
`

interface UIComponentButtonPropTypes extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
  className?: any;
  text?: any;
  style?: any
}

export const PrimaryButton = ({ disabled, text, children, onClick, className, style }: UIComponentButtonPropTypes) => {
  return (
    <PrimaryButtonRoot disabled={disabled}  onClick={onClick} className={className} style={style} >
      {children}
      {text}
    </PrimaryButtonRoot>
  )
}
