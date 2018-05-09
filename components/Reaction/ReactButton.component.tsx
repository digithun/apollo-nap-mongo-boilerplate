import * as React from 'react'
import styled from 'styled-components'

import reactions, { reactionMapping } from './reactions'
import { moveInDom } from './utils'
const isMobile = require('ismobilejs')

const Container = styled.div`
  display: blo1ck;
  position: relative;
  top: -2px;
  height: 31px;
  width: 31px;
  user-select: none;

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
    }
  }
  .expand .img {
    filter: grayscale(0%);
  }
` as any

export default class ReactButton extends React.Component<{ innerRef?: any, direction?: string, userReaction?: { type: string }, onClick?: any, style?: any, expand: boolean }> {
  reactions = {}
  state = {
    active: null
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.expand && nextProps.expand) {
      document.addEventListener('touchstart', this.onTouchStart)
      document.addEventListener('mousedown', this.onMouseDown)
    } else if (this.props.expand && !nextProps.expand) {
      document.removeEventListener('touchstart', this.onTouchStart)
      document.removeEventListener('mousedown', this.onMouseDown)
    }
  }
  componentWillUnmount() {
    document.removeEventListener('touchstart', this.onTouchStart)
    document.removeEventListener('mousedown', this.onMouseDown)
  }
  onTouchMove = (e) => {
    let update = { active: null }
    for(const k in this.reactions) {
      if (moveInDom(e, this.reactions[k])) {
          update = { active: k }
          break
      }
    }
    this.setState(update)
  }
  onMouseDown = e => {
    let inBound = false
    for(const k in this.reactions) {
      if (moveInDom(e, this.reactions[k])) {
          inBound = true
          break
      }
    }
  }
  onTouchStart = (_e) => {
    let inBound = false
    const e = _e.touches[0]
    for(const k in this.reactions) {
      if (moveInDom(e, this.reactions[k])) {
          inBound = true
          break
      }
    }
  }
  render() {
    return (
      <Container innerRef={this.props.innerRef} style={this.props.style}>
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
                  left: !this.props.expand ? 0 : idx * 35 * (this.props.direction === "left" ? -1 : 1),
                  visibility: hide ? "hidden" : "visible",
                  opacity:  hide ? 0 : 1,
                  zIndex: reactions.length - idx,
                }}
              >
                <div
                  className={`img ${reaction.type === this.state.active ? 'active ' : ''} ${this.props.expand ? 'expand ' : ''}`}
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
                  // onTouchMove={!isMobile.any ? null : (e) => {
                  //   this.setState({ active: reaction.type })
                  //   this.onTouchMove(e.nativeEvent.touches[0])
                  // }}
                  onClick={isMobile.any ? null : () => {
                    // this.setState({ active: null })
                    this.props.onClick(reaction.type)
                  }}
                />
              </Reaction>
            })}
          </div>
        }
      </Container>
    )
  }
}
