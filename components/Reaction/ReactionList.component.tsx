import * as React from "react"
import styled from 'styled-components'
import reactions from './reactions'
import { moveInDom } from './utils'
import withDict from '../../lib/with-dict'
const isMobile = require('ismobilejs')

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  position: relative;
  background: white;
  ${props => (props as any).show ? `
    visibility: visible;
    opacity: 1;
    top: 0;
  ` : `
    visibility: hidden;
    opacity: 0;
    top: 10px;
  `};
  transition: visibility 0.15s, opacity 0.15s, top 0.15s linear;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  padding: 0 5px;
  height: 70px;
  .reaction {
    cursor: pointer;
    text-align: center;
    width: 50px;
    @media only screen and (max-width: 600px) {
      width: 43px;
    }
    .img {
      transition: background 0.05s;
      vertical-align: middle;
      margin: auto;
      display: block;
      background-size: 35px 35px;
      background-repeat: no-repeat;
      background-position: center center;
      width: 45px;
      height: 45px;
    }
    &.active .img {
      background-size: 40px 40px;
    }
    .outline {
      font-weight: bold;
      font-size: 0.9rem;
    }
    &.active .outline {
      font-size: 1.05rem;
      transition: font-size 0.05s;
    }
  }
` as any

@(withDict as any)
export default class ActionList extends React.Component<{
  innerRef?: any
  show: boolean
  onClick?: (reaction: string) => any
  onCancel?: () => any
  className?: string
  style?: any
  onMouseEnter?: any
  onMouseLeave?: any
  t?: any
}> {
  state = {
    active: null
  }
  onTouchEnd = (_e) => {
    setTimeout(() => {
      this.setState({ active: null })
    })
  }
  onActiveReaction = (reaction) => {
    this.setState({
      active: reaction.type
    })
  }
  onResetActiveReaction = () => this.setState({ active: null })
  handleMouseLeave = (e) => {
    this.onResetActiveReaction()  
    this.props.onMouseLeave && this.props.onMouseLeave(e)
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.show && nextProps.show) {
      document.addEventListener('touchend', this.onTouchEnd)
    } else if (this.props.show && !nextProps.show) {
      document.removeEventListener('touchend', this.onTouchEnd)
    }
  }
  componentWillUnmount() {
    document.removeEventListener('touchend', this.onTouchEnd)
  }
  render() {
    return (
      <div ref={this.props.innerRef} className={this.props.className} style={{ pointerEvents: this.props.show ? 'unset' : 'none' }}>
        <Container show={this.props.show} onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.handleMouseLeave}>
          {
            reactions.map(reaction => (
              <div
                className={`reaction ${this.state.active === reaction.type ? 'active' : ''}`}
                key={reaction.type} 
                onMouseEnter={this.onActiveReaction.bind(null, reaction)}
                onMouseLeave={this.onResetActiveReaction}
                onClick={() => this.props.onClick && this.props.onClick(reaction.type)}
              >
                <div
                  className={`img`}
                  style={{ backgroundImage: `url(${reaction.image})`}}
                >
                </div>
                <div className="outline">
                  {this.props.t('reaction/' + reaction.type)}
                </div>
              </div>
            ))
          }
        </Container>
      </div>
    )
  }
}
