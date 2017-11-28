import * as React from 'react'

import styled, { css } from 'styled-components'

interface UIPopoverContainerPropTypes extends React.HTMLAttributes<HTMLElement> {
  direction?: 'up' | 'down'
  theme?: UITheme
  visible: boolean
  onClose?: () => void;
}

const VisibleStyles = css`
  display: block;
  pointer-events: all;
  opacity: 1;
  pointer-events: all;
`

const Container = styled.div`
  position: absolute;
  background: white;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: 0.222s ease-out all;
  pointer-events: none;
  z-index: 100;
  ${(props) => props.visible ? VisibleStyles : ''}
  ${(props: UIPopoverContainerPropTypes) => {
    if (props.direction === 'down') {
      return `
        bottom: -5px;
        transform: translateY(100%);
      `
    } else {
      return `
        top: 0;
        transform: translateY(-100%);
      `
    }
  }}
`
const Outside = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index:99;
`

export const UIPopoverContainer = (props: UIPopoverContainerPropTypes) => (
  <div>
    {props.visible ? <Outside key={'outside'} onMouseDown={props.onClose} /> : null}
    <Container key={'content'} {...props} > {props.children} </Container>
  </div>
)
