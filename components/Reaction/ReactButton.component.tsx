import * as React from 'react'
import styled from 'styled-components'

import reactions, { reactionMapping } from './reactions'
const isMobile = require('ismobilejs')

const Container = styled.div`
  display: block;
  height: 35px;
  width: 35px;

  .list {
    display: flex;
    position: relative;
  }
`

const Reaction = styled.div`
  cursor: pointer;
  touch-action: manipulation;
  background: white;
  position: absolute;
  flex: 0 0 0;
  min-width: 35px;
  height: 35px;
  transition: left 0.5s, opacity 0.3s, visibility 0.3s, filter 0.1s;
  .img {
    ${props => !(props as any).expand && !(props as any).hide
    ? `
      filter: grayscale(100%);
    ` : ``}
    width: 35px;
    height: 35px;
    background-size: 31px 31px;
    background-repeat: no-repeat;
    background-position: center center;
    &.active {
      opacity: 1 !important;
      background-size: 35px 35px;
      filter: grayscale(0%);
    }
  }
` as any

export default class ReactButton extends React.Component<{ userReaction?: { type: string }, onClick?: any, onLeave?: any, onEnter?: any, style?: any, expand: boolean }> {
  reactions = {}
  state = {
    active: null
  }
  onTouchMove = (e) => {
    let update = { active: null }
    for(const k in this.reactions) {
      const divRect = this.reactions[k].getBoundingClientRect()
      if (e.clientX >= divRect.left && e.clientX <= divRect.right &&
        e.clientY >= divRect.top && e.clientY <= divRect.bottom) {
          update = { active: k }
          break
      }
    }
    this.setState(update)
  }
  render() {
    return (
      <Container style={this.props.style} onMouseEnter={this.props.onEnter} onMouseLeave={this.props.onLeave} onTouchStart={this.props.onEnter} onTouchEnd={this.props.onLeave}>
        {this.props.children}
        {
          <div className={`list`}>
            {reactions.map((reaction, idx) => {
              const userReactionType = this.props.userReaction ? this.props.userReaction.type : null
              const hide = !this.props.expand && userReactionType !== null ? userReactionType !== reaction.type : !this.props.expand && idx !== 0
              return <Reaction
                innerRef={(node) => {
                  this.reactions[reaction.type] = node
                }}
                key={reaction.type}
                expand={this.props.expand}
                hide={hide}
                style={{
                  left: !this.props.expand ? 0 : idx * 35,
                  visibility: hide ? "hidden" : "visible",
                  opacity:  hide ? 0 : 1,
                  zIndex: reactions.length - idx,
                }}
              >
                <div
                  className={reaction.type === this.state.active ? `img active` : `img`}
                  style={Object.assign({ backgroundImage: `url(${reaction.image})` }, !hide && userReactionType !== null ? { filter: "grayscale(0%)" } : {})}
                  onMouseEnter={isMobile.any ? null : (e) => this.setState({ active: reaction.type })}
                  onMouseLeave={isMobile.any ? null : (e) => this.setState({ active: null })}
                  onTouchStart={!isMobile.any ? null : () => this.setState({ active: reaction.type })}
                  onTouchEnd={!isMobile.any ? null : () => {
                    if (this.state.active) {
                      this.props.onClick(this.state.active)
                    }
                    this.setState({ active: null })
                  }}
                  onTouchMove={!isMobile.any ? null : (e) => {
                    this.setState({ active: reaction.type })
                    this.onTouchMove(e.nativeEvent.touches[0])
                  }}
                  onClick={() => {
                    this.setState({ active: null })
                    this.props.onClick(reaction.type)
                  }}
                />
              </Reaction>
            })}
          </div>
          // <Reaction>
          //   <div
          //     className={this.state.active ? `img active` : `img`}
          //     onClick={() => {
          //       this.setState({ active: null })
          //       this.props.onClick()
          //     }}
          //     onMouseEnter={isMobile.any ? null : (e) => this.setState({ active: true })}
          //     onMouseLeave={isMobile.any ? null : (e) => this.setState({ active: null })}
          //     onTouchStart={!isMobile.any ? null : () => this.setState({ active: true })}
          //     onTouchEnd={!isMobile.any ? null : () => {
          //       if (this.state.active) {
          //         this.props.onClick()
          //       }
          //       this.setState({ active: null })
          //     }}
          //     onTouchMove={!isMobile.any ? null : (e) => {
          //       this.setState({ active: true })
          //       this.onTouchMove(e.nativeEvent.touches[0])
          //     }}
          //     style={{ filter: "unset", backgroundImage: `url(${reactionMapping[this.props.userReaction.type].image})` }}
          //   />
          // </Reaction>
        }
      </Container>
    )
  }
}
