import * as React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import theme from './theme'

import 'react'
// Augmentation of React
import 'react';

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: string;
    global?: string;
  }
}
export default class Layout extends React.Component<{}, {}> {
  public render() {
    return (
      <div>
        <ThemeProvider theme={theme} >
          {this.props.children}
        </ThemeProvider>
        <style jsx={'yes'} global={'yes'} >{`
          html {
            font-size: 15px;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, sans-serif, -MN-Lanna;
          }
        `}</style>
      </div>
    )
  }
}
