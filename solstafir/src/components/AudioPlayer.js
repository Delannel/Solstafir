import React from 'react'
// import ButtonPanel from './ButtonPanel'
// import ProgressBar from './ProgressBar'
// import VolumeBar from './VolumeBar'
// import TimeLabel from './TimeLabel'
// import NameLabel from './NameLabel'
// import SongList from './SongList'
// import SongFormatterMixin from './../mixins/SongFormatterMixin'

class AudioPlayer extends Component {
  mixins: [SongFormatterMixin],

  getDefaultProps = () => {
    return {songs: [] }
  },

  getInitialState = () => {
    return {
      isPlaying: false,
      isPause: false,
      isLoading: false,
      currentSongIndex: false,
      volume: 0.5
    }
  },

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

  render(){
    let songCount = this.songCount()
    let percent = 0
    if (this.state.seek && this.state.duration) {
      percent = this.state.seek / this.state.duration
    }

    let topComponents = [
      <ButtonPanel isPlaying={this.state.isPlaying} isPause={this.state.isPause}
                   isLoading={this.state.isLoading}
                   currentSongIndex={this.state.currentSongIndex} songCount={songCount}
                   onPlayBtnClick={this.onPlayBtnClick} onPauseBtnClick={this.onPauseBtnClick}
                   onPrevBtnClick={this.onPauseBtnClick} onNextBtnClick={this.onNextBtnClick} />
      <ProgressBar shorter={songCount > 1} percent={percent} seekTo={this.seekTo} /> 
      <VolumeBar volume={this.state.volume} adjustVolumeTo={this.adjustVolumeTo} />           
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
}
}