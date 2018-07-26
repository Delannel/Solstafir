import React from 'react'
import SongItem from './SongItem'
import {DropdownButton} from "react-bootstrap"
let SongFormatterMixin = require("./../mixins/SongFormatterMixin")

class SongList extends React.Component {
  mixins: [SongFormatterMixin]

  render = () => {
    let songs = []
    let currentSongIndex = this.props.currentSongIndex
    let isPlaying = this.props.isPlaying
    let isPause = this.props.isPause
    let songCount = this.props.length

    songs = this.props.songs.map(function(song, index){
      let songName = this.getSongName(song)
      songName = songCount > 1 ? (index + 1) + ". " + songName : songName

      return <SongItem currentSongIndex={currentSongIndex}
              eventKey={index} 
              name={songName}
              isPlaying={isPlaying} 
              isPause={isPause} 
              onSongItemClick={this.props.onSongItemClick.bind(null, index)} /> 
    }, this)

    return (
      <div className="audio-songs-list">
        <DropdownButton ref="DropdownButton">{songs}</DropdownButton>
      </div>
      ) 
  }

  hideDropdownMenu = () => {
    this.refs.DropdownButton.setDropdownState(false)
  }
} 

export default SongList