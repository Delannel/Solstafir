import React, { Component } from 'react'
import $ from 'jquery'
// var ProgressBar = require('react-bootstrap/ProgressBar')
var classnames = require("classnames")

class ProgressBar extends Component {
  
  getDefaultProps = () => {
    return {progressStyle : {marginLeft: '5px'} }
  }

  render = () => {
    let percent = this.props.percent * 100
    let style = {'width': percent +"%"}
    let classes = classnames({
      'audio-progress-container': true,
      'pull-left': true,
      'audio-progress-container-short-width': this.props.shorter
    })

    return (
      <div ref="progressBar" className={classes} style={this.props.progressStyle} onClick={this.seekTo}>
        <div className="audio-progress" style={style}></div>
      </div>
      )
  }

  seekTo = (e) => {
    if(!this.props.percent) {
      return
    }

    let container =$(this.progressBar.getDOMNode())
    let containerStartX = container.offset().left 
    let percent = (e.clientX - containerStartX) / container.width()
    percent = percent >= 1 ? 1 : percent
    this.props.seekTo(percent) 
  }
}

export default ProgressBar