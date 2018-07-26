import React from 'react'
import {Label} from 'react-bootstrap'

class NameLabel extends React.Component {
  render(){
    return (
      <span className="audio-name-label pull-left">{this.props.name}</span>
      )
  }
}

export default NameLabel