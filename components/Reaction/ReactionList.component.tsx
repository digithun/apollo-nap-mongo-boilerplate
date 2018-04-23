import * as React from "react"
import styled from 'styled-components'
import reactions from './reactions'

const Container = styled.div`
  display: inline-block;
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
  border: 1.3px solid ${props => props.theme.darkGrey};
  border-radius: 18px;
  padding: 0 5px;
  overflow: auto;
  .reaction {
    display: inline-block;
    height: 38px;
    width: 36px;
    vertical-align: middle;
    .img {
      cursor: pointer;
      transition: background 0.05s;
      vertical-align: middle;
      margin: auto;
      display: inline-block;
      background-size: 30px 30px;
      background-repeat: no-repeat;
      background-position: center center;
      width: 36px;
      height: 38px;
      &:hover {
        background-size: 35px 35px;
      }
    }
  }
` as any

export default class ActionList extends React.Component<{ show: boolean, onClick?: (reaction: string) => any, className?: string, style?: any, onMouseEnter?: any, onMouseLeave?: any }, {}> {
  render() {
    return (
      <div className={this.props.className} style={{ pointerEvents: this.props.show ? 'unset' : 'none' }}>
        <Container show={this.props.show} onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave}>
          {
            reactions.map(reaction => (
              <div className='reaction' key={reaction.type}>
                <div onClick={() => this.props.onClick && this.props.onClick(reaction.type)} className='img' style={{ backgroundImage: `url(${reaction.image})`}}>
                </div>
              </div>
            ))
          }
        </Container>
      </div>
    )
  }
}
