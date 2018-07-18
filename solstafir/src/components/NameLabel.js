import React from 'react'
var label = require('react-bootstrap/Label')

class NameLabel extends Component {
  render(){
    return (
      <span className="audio-name-label pull-left">{this.props.name}</span>
      )
  }
}