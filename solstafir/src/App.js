import React, { Component } from 'react';
import AudioPlayer from "./components/AudioPlayer"

class App extends Component {
  render() {
    return (
      <div class="container">
        <div class="row">
            
            <h2>React Audio Player</h2>
            <AudioPlayer/>
            

            <h2>One Song</h2>
            <div id="audio-player1"></div>

            <h2>Multi Songs</h2>
            <div id="audio-player2"></div>

        </div>
      </div>
    );
  }
}

export default App;
