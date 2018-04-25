import * as React from 'react'
import styled from 'styled-components'

import { reactionMapping } from './reactions'

const Container = styled.div`
  display: inline-block;
  height: 25px;
  .icon {
    height: 25px;
    display: inline-block;
    position: relative;
    img {
      width: 25px;
      height: 25px;
    }
    &:not(:last-child) {
      right: -5px;
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
    const count = this.props.reactions ? this.props.reactions.reduce((prev, cur) => prev + cur.count, 0) : 0
    return (
      <Container style={this.props.style}>
        <span>
          {(this.props.reactions || []).map((reaction, idx) => (
            <div key={reaction.type} className="icon" style={{ zIndex: this.props.reactions.length - idx }}>
              <img src={reactionMapping[reaction.type].image}/>
            </div>
          ))}
        </span>
        {count ? <span className="count">{count}</span> : null}
      </Container>
    )
  }
}
