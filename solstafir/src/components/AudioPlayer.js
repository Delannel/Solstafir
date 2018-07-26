import React, { Component } from 'react'
import $ from 'jquery'
import ButtonPanel from './ButtonPanel'
import ProgressBar from './ProgressBar'
import VolumeBar from './VolumeBar'
import TimeLabel from './TimeLabel'
import NameLabel from './NameLabel'
import SongList from './SongList'
import SongFormatterMixin from './../mixins/SongFormatterMixin'
var Howl = require('howler').Howl;


class AudioPlayer extends Component {
  mixins: [SongFormatterMixin]

  state = {
    isPlaying: false,
    isPause: false,
    isLoading: false,
    currentSongIndex: false,
    volume: 0.5,
    songs: []
  
  }

  ComponentWillMount = () => {
    if (this.props.dataUrl) {
      $.ajax({
        dataType: "json",
        url: this.props.dataUrl,
        succes: function(response) {
          this.setState({
            songs: response.songs,
            currentSongIndex: 0
          })
        }

        .bind(this)
      })
    }
    else if (this.props.songs) {
      this.setState({
        songs:this.props.songs,
        currentSongIndex:0
      })
    }

    else {
      throw "no data"
    }
  }

  ComponentDidUpdate = (prevProps, prevState, prevContext) => {
    if (this.state.isPlaying && this.state.currentSongIndex != prevState.currentSongIndex){
      this.initSoundObject()
    }
  }

  render () {
    // return <div></div>
    let songCount = this.songCount()
    let percent = 0
    if (this.state.seek && this.state.duration) {
      percent = this.state.seek / this.state.duration
    }

    let topComponents = [
    <div>
      <ButtonPanel isPlaying={this.state.isPlaying} isPause={this.state.isPause}
                   isLoading={this.state.isLoading}
                   currentSongIndex={this.state.currentSongIndex} songCount={songCount}
                   onPlayBtnClick={this.onPlayBtnClick} onPauseBtnClick={this.onPauseBtnClick}
                   onPrevBtnClick={this.onPauseBtnClick} onNextBtnClick={this.onNextBtnClick} />
      <ProgressBar shorter={songCount > 1} percent={percent} seekTo={this.seekTo} /> 
      <VolumeBar volume={this.state.volume} adjustVolumeTo={this.adjustVolumeTo} />
      </div>         
    ]

    let songName
    if (this.songCount() > 1) {
      topComponents.push(
        <SongList ref="SongList" className="pull-left"
                  songs={this.state.songs}
                  currentSongIndex={this.state.currentSongIndex}
                  isPlaying={this.state.isPlaying} isPause={this.state.isPause}
                  onSongItemClick={this.state.onSongItemClick}
                  />)
      songName = (this.state.currentSongIndex + 1) + ". " + this.getCurrentSongName()
    }
    else {
      songName = this.getCurrentSongName()
    }

    return (
      <div className="audio-player">
        <div className="clearfix">
          { topComponents}
        </div>

        <div className="audio-desc-container clearfix">
          <NameLabel name={songName} />
          <TimeLabel seek={this.state.seek} duration={this.state.duration} />
        </div>

      </div>

      )
  }
    onPlayBtnClick = () => {
      if (this.state.isPlaying && !this.state.isPause) {
        return
      }
      this.play()
    }

    onPauseBtnClick = () => {
      let isPause =!this.state.isPause
      this.setState({ isPause: isPause})
      isPause ? this.isPause(): this._play()
    }

    onPrevBtnClick = () => {
      this.prev()
    }

    onNextBtnClick = () => {
      this.next()
    }

    onSongItemClick = (songIndex) => {
      if (this.state.currentSongIndex == songIndex) {
        if (this.state.isPause) {
          this.onPauseBtnClick()
          this.refs.SongList.hideDropdownMenu()
        }
        else if (!this.state.isPlaying) {
          this.onPlayBtnClick()
          this.refs.songList.hideDropdownMenu()
        }
        return
      }

      this.stop()
      this.clearSoundObject()
      this.setState({
        currentSongIndex: songIndex,
        duration: 0,
        isPlaying: true,
        isPause: false
      })
      this.refs.songList.hideDropdownMenu()
    }

    play = () => {
      this.setState({ 
        isPlaying: true,
        isPause: false
      })

      if(!this.howler) {
        this.initSoundObject()
      }

      else {
        let songUrl = this.state.songs[this.state.currentSongIndex].url
        if (songUrl != this.howler._src){
          this.initSoundObject()
        }

        else {
          this._play()
        }
      }
    }

    initSoundObject = () => {
      this.clearSoundObject()
      this.setState({
        isLoading: true
      })

      let song = this.state.songs[this.state.currentSongIndex]
      this.howler = new Howl ({
        src: song.url,
        volume: this.state.volume,
        onload: this.initSoundObjectCompleted,
        onend: this.playEnd
      })
    }

    initSoundObjectCompleted = () => {
      this._play()
      this.setState({
        duration: this.howler.duration(),
        isLoading: false
      })
    }

    _play = () => {
      this.howler.play()
      this.stopUpdateCurrentDuration()
      this.updateCurrentDuration()
      this.interval = setInterval(this.updateCurrentDuration, 1000)
    }

    playEnd = () => {
      if(this.state.currentSongIndex == this.state.songs.length -1) {
        this.stop()
      }
      else {
        this.next()
      }
    }

    stop = () => {
      this.stopUpdateCurrentDuration()
      this.setState({
        seek: 0,
        isPlaying: false
      })
    }

    pause = () => {
      this.howler.pause()
      this.stopUpdateCurrentDuration()
    }

    prev = () => {
      if (this.state.seek > 1 || this.state.currentSongIndex == 0) {
        this.seekTo(0)
      }
      else {
        this.updateSongIndex(this.state.currentSongIndex -1)
      }
    }

    next = () => {
      this.updateSongIndex(this.state.currentSongIndex +1)
    }

    updateSongIndex = (index) => {
      this.setState({
        currentSongIndex: index,
        duration: 0
      })

      if(this.state.isPause) {
        this.stop()
        this.clearSoundObject()
      }
      else {
        this.stopUpdateCurrentDuration()
      }
    }

    updateCurrentDuration = () => {
      this.setState({
        seek: this.howler.seek()
      })
    }

    stopUpdateCurrentDuration = () => {
      clearInterval(this.interval)
    }

    seekTo = (percent) => {
      let seek = this.state.duration * percent
      this.howler.seek(seek)
      this.setState({
        seek: seek
      })
    } 

    adjustVolumeTo = (percent) => {
      this.setState({
        volume: percent
      })

      if (this.howler) {
        this.howler.volume(percent)
      }
    }

    songCount = () => {
      return this.state.songs ? this.state.songs.length : 0
    }

    getCurrentSongName = () => {
      if (this.state.currentSongIndex < 0) {
        return ""
      }
      let song = this.state.songs[this.state.currentSongIndex]
      return this.getSongName(song)
    } 
}
    export default AudioPlayer