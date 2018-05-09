import * as React from 'react'
import gql from 'graphql-tag'
import styled from 'styled-components'
import ReactButton from './ReactButton.component'
import ReactionList from './ReactionList.component'
import ReactionSummary from './ReactionSummary.component'
import withDict from '../../lib/with-dict'
import { moveInDom } from './utils'
const isMobile = require('ismobilejs')

const Container = styled.div`
  display: flex;
  flex-direction: ${props => (props as any).isCenter ? 'column' : 'row'};
  align-items: ${props => (props as any).isCenter ? 'center' : 'flex-end'};
  .action {
    position: relative;
    display: inline-flex;
    align-items: center;
    .reaction-list {
      z-index: 20;
      position: absolute;
      top: -85px;
      @media only screen and (max-width: 600px) {
        top: -75px;
      }
      ${props => (props as any).isCenter 
      ? `
        @media only screen and (min-width: 0px) {
          top: -100px;
        }
        left: 50%;
        transform: translateX(-50%);      
      `
      : `
        left: -5px;
        @media only screen and (max-width: 600px) {
          left: -61px;
        }
      `}
    }
  }
` as any

@(withDict as any)
export default class ReactionCompose extends React.Component<{ className?: string, t?: any, isCenter?: boolean, direction?: string, userReaction?: any, reactionSummary?: any, style?: any, onAddReaction?: any, onRemoveReaction?: any, isAbleToReact?: boolean}> {
  static fragments = {
    threadReaction: gql`
      fragment ThreadReaction on Thread {
        reactionSummary
        userReaction {
          type
        }
      }
    `,
    commentReaction: gql`
      fragment CommentReaction on Comment {
        reactionSummary
        userReaction {
          type
        }
      }
    `
  }
  ticker
  tickerLeave
  reactionList: any
  reactionButton: any
  state = {
    hoverStart: null,
    showReactionList: false,
  }
  handleClick = () => {
    if (this.props.userReaction) {
      this.props.onRemoveReaction && this.props.onRemoveReaction()
    } else {
      this.props.onAddReaction && this.props.onAddReaction("LIKE")
    }
  }
  onTouchStart = (_e) => {
    const e = _e.touches[0]
    if (!moveInDom(e, this.reactionButton) && !moveInDom(e, this.reactionList)) {
      this.setState({ showReactionList: false })      
    }
  }
  onMouseDown = (e) => {
    if (isMobile.any) return
    if (!moveInDom(e, this.reactionButton) && !moveInDom(e, this.reactionList)) {
      this.setState({ showReactionList: false })      
    }
  }
  handleAfterMouseEnter = () => {
    if (this.ticker) {
      clearTimeout(this.ticker)
      this.ticker = null
    }
    this.setState({
      hoverStart: null,
      showReactionList: true,
    })
  }
  handleAfterMouseLeave = () => {
    this.setState({
      showReactionList: false,
    })
    this.tickerLeave = null
  }
  handleOnMouseEnter = () => {
    if (this.props.userReaction) return
    if (this.state.showReactionList) {
      if (this.tickerLeave) {
        clearTimeout(this.tickerLeave)
        this.tickerLeave = null
      }
      return
    }
    if (this.ticker) {
      clearTimeout(this.ticker)
    }
    this.ticker = setTimeout(this.handleAfterMouseEnter, 500)
  }
  handleOnMouseLeave = () => {
    if (this.props.userReaction) return
    if (!this.state.showReactionList) {
      if (this.ticker) {
        clearTimeout(this.ticker)
        this.ticker = null
      }
      return
    }
    if (this.tickerLeave) {
      clearTimeout(this.tickerLeave)
    }
    this.tickerLeave = setTimeout(this.handleAfterMouseLeave, 500)
  }
  handleReactionClick = (type) => {
    this.props.userReaction && this.props.onRemoveReaction && this.props.onRemoveReaction()
    !this.props.userReaction && this.props.onAddReaction && this.props.onAddReaction(type)
    this.setState({
      showReactionList: false,
    })
    if (this.ticker) {
      clearTimeout(this.ticker)
      this.ticker = null
    }
    if (this.tickerLeave) {
      clearTimeout(this.tickerLeave)
      this.tickerLeave = null
    }
  }
  handleReactionClickV2 = (type) => {
    if (this.state.showReactionList) {
      this.props.onAddReaction && this.props.onAddReaction(type)
      this.setState({
        showReactionList: false,
      })
    } else if (this.props.userReaction) {
      this.props.onRemoveReaction && this.props.onRemoveReaction()
    } else {
      this.setState({
        showReactionList: true,
      })
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (!this.state.showReactionList && nextState.showReactionList) {
      document.addEventListener('touchstart', this.onTouchStart)
      document.addEventListener('mousedown', this.onMouseDown)
    } else if (this.state.showReactionList && !nextState.showReactionList) {
      document.removeEventListener('touchstart', this.onTouchStart)
      document.removeEventListener('mousedown', this.onMouseDown)
    }
  }
  componentWillUnmount() {
    document.removeEventListener('touchstart', this.onTouchStart)
    document.removeEventListener('mousedown', this.onMouseDown)
  }
  render() {
    return (
      <Container className={this.props.className} style={this.props.style} isCenter={this.props.isCenter}>
        <div className="action">
          <ReactionList innerRef={node => this.reactionList = node} className="reaction-list" show={this.state.showReactionList} onClick={this.handleReactionClickV2} onCancel={() => this.setState({ showReactionList: false })} />
          {
            this.props.isAbleToReact
            ? <ReactButton
              innerRef={node => this.reactionButton = node}
              style={{ transform: this.props.isCenter ? 'scale(2.3)' : undefined }}
              direction={this.props.direction}
              userReaction={this.props.userReaction}
              // onCancel={() => this.setState({ showReactionList: false })}
              // onEnter={this.handleOnMouseEnter}
              // onLeave={this.handleOnMouseLeave}
              onClick={this.handleReactionClickV2}
              // expand={this.state.showReactionList}
              expand={false}
            />
            : null
          }
        </div>
        <div
          style={{
            marginLeft: this.props.isAbleToReact && !this.props.isCenter ? 5 : 0,
            marginTop: this.props.isCenter ? 40 : 0,
            display: 'flex',
          }}
        >
          <ReactionSummary
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            reactions={this.props.reactionSummary}
          />
          {
            this.props.isCenter
            ? <div style={{ marginLeft: 10 }}>
              {this.props.t('reacted')}
            </div>
            : null
          }
        </div>
      </Container>
    )
  }
}
