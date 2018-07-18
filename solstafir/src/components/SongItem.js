import React from 'react'
let classnames = require("classnames")
let MenuItem = require ('react-bootstrap/MenuItem')
let Glyphicon = require('react-bootstrap/Glyphicon')

class SongItem extends Component {
  render = () => {
    let currentSongIndex = this.props.currentSongIndex
    let isSelected= this.props.currentSongIndex == this.props.eventKey
    let components = []

    if (isSelected && this.props.isPlaying) {
      components[0] = <Glyphicon className="audio-song-item-icon active" glyph="play" />
    }

    else {
      components[0] = <span className="audio-song-item-not-selected"></span>
    }

    components[1] = <span className="audio-song-item-label" >{this.props.name}</span>

    let classes = classnames({
      'audio-song-item: true',
      'active': isSelected,
    })

    return (
      <MenuItem className={classes} eventKey={this.props.eventKey} onClick={this.props.onSongItemClick} >
        { components}
      </MenuItem>
      )
  }
}

export default SongItem