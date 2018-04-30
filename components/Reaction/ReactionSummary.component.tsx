import * as React from 'react'
import styled from 'styled-components'
import { sortBy } from 'lodash'

import { reactionMapping } from './reactions'

const Container = styled.div`
  display: inline-block;
  height: 25px;
  .icon {
    height: 25px;
    display: inline-block;
    position: relative;
    &:not(:first-child) {
      margin-left: -5px;
    }
    img {
      width: 25px;
      height: 25px;
    }
  }
  .count {
    margin-left: 10px;
    line-height: 25px;
    vertical-align: top;
  }
`

export default class ReactionSummary extends React.Component<{reactions?: { type: string, count: number }[], style?: any}> {
  render() {
    const reactions = sortBy(this.props.reactions || [], ['count', 'weight'])
    const count = reactions.reduce((prev, cur) => prev + cur.count, 0)
    return (
      <Container style={this.props.style}>
        <span>
          {reactions.map((reaction, idx) => (
            <div key={reaction.type} className="icon" style={{ zIndex: reactions.length - idx }}>
              <img src={reactionMapping[reaction.type].image}/>
            </div>
          ))}
        </span>
        {count ? <span className="count">{count}</span> : null}
      </Container>
    )
  }
}
