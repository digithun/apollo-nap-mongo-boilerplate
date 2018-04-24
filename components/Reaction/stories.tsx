import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import ReactionList from './ReactionList.component'
import ReactButton from './ReactButton.component'
import ReactionSummary from './ReactionSummary.component'
import ReactionCompose from './ReactionCompose.component'
import Layout from '../Layout'

import reactions from './reactions'

class ToggleReactionList extends React.Component {
  state = {
    show: true
  }
  render() {
    return (
      <div>
        <button onClick={() =>{this.setState({ show: !this.state.show })}} style={{ top: 100, position: 'relative' }}>toggle</button>
        <br/>
        <ReactionList show={this.state.show}/>
      </div>
    )
  }
}

class ToggleReactionButton extends React.Component {
  state = {
    show: true
  }
  render() {
    return (
      <div>
        <ReactButton onClick={() => this.setState({ show: !this.state.show })} expand={this.state.show} />
      </div>
    )
  }
}

storiesOf("Reaction", module)
  .addDecorator(story => (
    <Layout>
      {story()}
    </Layout>
  ))
  .add("show simple button", () => (
    <ReactButton expand/>
  ))
  .add("un expand react button", () => (
    <ReactButton expand={false}/>
  ))
  .add("toggle react button", () => (
    <ToggleReactionButton/>
  ))
  .add("show reacted reaction", () => (
    <div>
      {
        reactions.map(reaction => (
          <div key={reaction.type}>
            <ReactButton onClick={action("react")} userReaction={{ type: reaction.type }} expand/>
          </div>
        ))
      }
    </div>
  ))
  .add("show list of reaction", () => (
    <ReactionList onClick={action('reaction')} show/>
  ))
  .add("action list toggle", () => (
    <ToggleReactionList/>
  ))
  .add("summary reaction", () => (
    <ReactionSummary reactions={[{ count: 4, type: "LIKE" }, { count: 4, type: "WOW" }]}/>
  ))
  .add("empty summary reaction", () => (
    <ReactionSummary reactions={[]}/>
  ))
  .add("null summary reaction", () => (
    <ReactionSummary reactions={null}/>
  ))
  .add("compose", () => (
    <div style={{ paddingTop: 70, paddingLeft: 40 }}>
      <ReactionCompose onAddReaction={action('add')} onRemoveReaction={action('remove')} reactionSummary={[{ count: 4, type: "LIKE" }, { count: 4, type: "WOW" }]}/>
      <ReactionCompose onAddReaction={action('add')} onRemoveReaction={action('remove')} reactionSummary={[]}/>
      <ReactionCompose onAddReaction={action('add')} onRemoveReaction={action('remove')} userReaction={{ type: "LIKE" }} reactionSummary={[{ count: 4, type: "LIKE" }, { count: 4, type: "WOW" }]}/>
      <ReactionCompose onAddReaction={action('add')} onRemoveReaction={action('remove')} userReaction={{ type: "WOW" }} reactionSummary={[]}/>
    </div>
  ))
