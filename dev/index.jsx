import React from "react";
import ReactDOM from "react-dom";
import MediaControls from './ui/component/MediaControls.js';
import ActivityPlaylist from './ui/activity/ActivityPlaylist.js';
import ActivityRecordPlayer from './ui/activity/ActivityRecordPlayer.js';
import AudioPlayer from './class/MusicPlayer.js';

const playlist = require('./music.js').default.songs;

class App extends React.Component {

    constructor(props){
        super(props);

        this.startActivity = this.startActivity.bind(this);

        AudioPlayer.setPlaylist(props.playlist);
        
        this.state = {
            activity :  <ActivityPlaylist playlist={props.playlist} startActivity={this.startActivity} />,
            currentActivity : 'Playlist'
        };
    }

    render() {
        return(
            <div id="application">
                {this.state.activity}
                <MediaControls currentActivity={this.state.currentActivity} startActivity={this.startActivity}/>
            </div>
        )
    }

    startActivity(type, data = null){
        switch(type) {
            case 'RecordPlayer':
                this.setState({
                    activity: <ActivityRecordPlayer songData={data} startActivity={this.startActivity} />,
                    currentActivity : 'RecordPlayer'
                });
                break;
            case 'Playlist':
                this.setState({
                    activity: <ActivityPlaylist playlist={this.props.playlist} startActivity={this.startActivity} />,
                    currentActivity : 'Playlist'
                });
                break;
        }
    }
}

ReactDOM.render(<App playlist={playlist} />, document.getElementById("container"));
