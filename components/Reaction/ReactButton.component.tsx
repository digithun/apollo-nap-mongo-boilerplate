import * as React from 'react'
import styled from 'styled-components'

import { reactionMapping } from './reactions'

const Container = styled.div`
  display: block;
  height: 35px;
  width: 35px;

  img {
    position: relative;
    cursor: pointer;
    transition: 0.05s linear;
    &.no-reaction {
      opacity: 0.4;
    }
    top: 2px;
    left: 2px;
    height: 31px;
    width: 31px;
    &:hover {
      top: 0;
      left: 0;
      opacity: 1;
      height: 35px;
      width: 35px;
    }
  }
`

export default class ReactButton extends React.Component<{ userReaction?: { type: string }, onClick?: () => any, onMouseLeave?: any, onMouseEnter?: any, style?: any }> {
  render() {
    return (
      <Container style={this.props.style}>
        {this.props.children}
        {
          !this.props.userReaction
          ? <img onClick={this.props.onClick} onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave} className="no-reaction" src="/static/comment-images/reaction/like-button.png" />
          : <img onClick={this.props.onClick} onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave} src={reactionMapping[this.props.userReaction.type].image} />
        }
      </Container>
    )
  }
}
