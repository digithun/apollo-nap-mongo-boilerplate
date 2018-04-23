import * as React from 'react'
import styled from 'styled-components'
import ReactButton from './ReactButton.component'
import ReactionList from './ReactionList.component'
import ReactionSummary from './ReactionSummary.component'

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  * {
    float: left;
  }
  .reaction-list {
    z-index: 20;
    position: absolute;
    top: -42px;
    left: -5px;
  }
`

export default class ReactionCompose extends React.Component<{ userReaction?: any, reactionSummary?: any, style?: any, onAddReaction?: any, onRemoveReaction?: any}> {
  ticker
  tickerLeave
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
    this.ticker = setTimeout(this.handleAfterMouseEnter, 1000)
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
    this.tickerLeave = setTimeout(this.handleAfterMouseLeave, 1000)
  }
  handleReactionClick = (type) => {
    this.props.onAddReaction && this.props.onAddReaction(type)
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
  render() {
    return (
      <Container style={this.props.style}>
        <ReactionList onClick={this.handleReactionClick} className="reaction-list" show={this.state.showReactionList} onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave}/>
        <ReactButton onClick={() => this.handleReactionClick("LIKE")} userReaction={this.props.userReaction} onMouseEnter={this.handleOnMouseEnter} onMouseLeave={this.handleOnMouseLeave}/>
        <ReactionSummary style={{ marginLeft: 5 }} reactions={this.props.reactionSummary}/>
        <div style={{clear: "both"}}/>
      </Container>
    )
  }
}
