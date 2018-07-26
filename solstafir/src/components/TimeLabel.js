import React from 'react'
let TimeFormatterMixin = require('./../mixins/TimeFormatterMixin')

class TimeLabel extends React.Component {
  mixins: [TimeFormatterMixine]

  render = () => {
    let classes = "audio-time pull-right"
    if (this.props.seek == undefined || !this.props.duration) {
      return (
        <span></span>
        )
    }

    let seek = this.secondsToTime(this.props.seek)
    let duration = this.secondsToTime(this.props.duration)
    return (
      <span className={classes}> {seek} / {duration} </span>
      )
  }
}

export default TimeLabel 
