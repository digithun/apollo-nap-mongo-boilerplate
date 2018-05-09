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
    show: false
  }
  render() {
    return (
      <div>
        <ReactButton onClick={() => this.setState({ show: !this.state.show })} expand={this.state.show} />
      </div>
    )
  }
}

storiesOf("Reaction/combine", module)
  .addDecorator(story => (
    <Layout>
      {story()}
    </Layout>
  ))
  .add("compose", () => (
    <div style={{ paddingTop: 90, paddingLeft: 40, display: 'flex', flexDirection: 'column' }}>
      <ReactionCompose isAbleToReact={false} reactionSummary={[{ count: 4, type: "LIKE" }, { count: 4, type: "WOW" }]}/>
      <ReactionCompose isAbleToReact onAddReaction={action('add')} onRemoveReaction={action('remove')} reactionSummary={[{ count: 4, type: "LIKE" }, { count: 4, type: "WOW" }]}/>
      <ReactionCompose isAbleToReact onAddReaction={action('add')} onRemoveReaction={action('remove')} reactionSummary={[]}/>
      <ReactionCompose isAbleToReact onAddReaction={action('add')} onRemoveReaction={action('remove')} userReaction={{ type: "LIKE" }} reactionSummary={[{ count: 4, type: "LIKE" }, { count: 4, type: "WOW" }]}/>
      <ReactionCompose isAbleToReact onAddReaction={action('add')} onRemoveReaction={action('remove')} userReaction={{ type: "WOW" }} reactionSummary={[]}/>
    </div>
  ))
  .add("compose/center", () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 100 }}>
      <ReactionCompose isAbleToReact reactionSummary={[{ count: 4, type: "LIKE" }, { count: 400000, type: "WOW" }]} isCenter/>
    </div>
  ))

storiesOf("Reaction/ReactButton", module)
  .addDecorator(story => (
    <Layout>
      {story()}
    </Layout>
  ))
  .add("No Reacted", () => (
    <ReactButton expand={false}/>
  ))
  .add("Reacted", () => (
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
  .add("Expanded", () => (
    <ReactButton expand/>
  ))
  .add("Toggle", () => (
    <ToggleReactionButton/>
  ))
  

storiesOf("Reaction/ReactionList", module)
  .addDecorator(story => (
    <Layout>
      {story()}
    </Layout>
  ))
  .add("show", () => (
    <ReactionList onClick={action('reaction')} show/>
  ))
  .add("toggle", () => (
    <ToggleReactionList/>
  ))

storiesOf("Reaction/ReactionSummary", module)
  .addDecorator(story => (
    <Layout>
      {story()}
    </Layout>
  ))
  .add("summary reaction", () => (
    <ReactionSummary reactions={[{ count: 1, type: "SAD" },{ count: 4, type: "WOW" }, { count: 4, type: "LIKE" }, { count: 20, type: "LAUGH" }]}/>
  ))
  .add("empty", () => (
    <ReactionSummary reactions={[]}/>
  ))
  .add("null", () => (
    <ReactionSummary reactions={null}/>
  ))
