import React from 'react'
let DropDownButton = require("react-bootstrap/DropDownButton")
import SongItem from'./SongItem'
let SongFormatterMixin = require("./../mixins/SongFormatterMixin")

class SongList extends Component {
  mixins: [SongFormatterMixin],

  render = () => {
    let songs = []
    let currentSongIndex = this.props.currentSongIndex
    let isPlaying = this.props.isPlaying
    let isPause = this.props.isPause
    let songCount = this.props.length

    songs = this.props.songs.map(function(song, index){
      let songName = this.getSongName(song)
      let songName = songCount > 1 ? (index + 1) + ". " + songName : songName

      return <SongItem currentSongIndex={currentSongIndex}
              eventKey={index} 
              name={songName}
              isPlaying={isPlaying} 
              isPause={isPause} 
              onSongItemClick={this.props.onSongItemClick.bind(null, index)} /> 
    }, this)

    return (
      <div className="audio-songs-list">
        <DropDownButton ref="DropDownButton">{songs}</DropDownButton>
      </div>
      ) 
  }

  hideDropdownMenu = () => {
    this.refs.DropDownButton.setDropdownState(false)
  }
} 

export default SongList