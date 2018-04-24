import * as React from 'react'
import styled from 'styled-components'

import reactions, { reactionMapping } from './reactions'

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

  .list {
    display: flex;
    position: relative;
  }
`

const Reaction = styled.div`
  background: white;
  position: absolute;
  flex: 0 0 0;
  min-width: 35px;
  height: 35px;
  transition: left 0.5s, opacity 0.3s, visibility 0.3s, filter 0.1s;
  ${props => !(props as any).expand && !(props as any).hide
  ? `
    filter: grayscale(100%);
  ` : ``}
  &:hover {
    opacity: 1 !important;
    filter: grayscale(0%);
  }
` as any

export default class ReactButton extends React.Component<{ userReaction?: { type: string }, onClick?: any, onMouseLeave?: any, onMouseEnter?: any, style?: any, expand: boolean }> {
  render() {
    return (
      <Container style={this.props.style} onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave}>
        {this.props.children}
        {
          !this.props.userReaction
          ? <div className={`list`}>
            {reactions.map((reaction, idx) => {
              const hide = !this.props.expand && idx !== 0
              return <Reaction
                key={reaction.type}
                expand={this.props.expand}
                hide={hide}
                style={{
                  left: hide ? 0 : idx * 35,
                  visibility: hide ? "hidden" : "visible",
                  opacity:  hide ? 0 : 1,
                  zIndex: reactions.length - idx,
                }}
              >
                <img onClick={() => this.props.onClick(reaction.type)} src={reaction.image} />
              </Reaction>
            })}
          </div>
          : <img onClick={() => this.props.onClick()} src={reactionMapping[this.props.userReaction.type].image} />
        }
      </Container>
    )
  }
}
