import * as React from 'react'
import { compose, withProps } from 'recompose'

import styled from 'styled-components'

export const InputTextMultiline = styled.textarea`
  flex: 1;
  font-family: Segoe UI, Roboto, Helvetica Neue, sans-serif,Thonburi, Tahoma, -MN-Lanna;
  background: ${(props: { theme?: UITheme }) => props.theme.matteWhite};
  resize: none;
  border-radius: 3px;
  border: 1px solid ${(props: { theme?: UITheme }) => props.theme.grey};
  font-size: 1em;
  padding: 9px 13px;
  &:focus {
    outline: none;
  }
`

export const InputTextSingle = styled.input`
  box-sizing: border-box;
  font-family: Segoe UI, Roboto, Helvetica Neue, sans-serif,Thonburi, Tahoma, -MN-Lanna;
  background: ${(props: { theme?: UITheme }) => props.theme.matteWhite};
  resize: none;
  border-radius: 3px;
  border: 1px solid ${(props: { theme?: UITheme }) => props.theme.grey};
  font-size: 1em;
  padding: 9px 13px;
  &:focus {
    outline: none;
  }
`
