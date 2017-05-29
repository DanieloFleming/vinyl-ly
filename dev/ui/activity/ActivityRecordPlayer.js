import React from "react";
import ReactDOM from "react-dom";
import AudioPlayer from "../../class/MusicPlayer";
import RecordPlayer from "../component/RecordPlayer";
import SeekBar from "../component/SeekBar";
import Equalizer from "../component/Equalizer";

class ActivityRecordPlayer extends React.Component
{
    constructor(props) {
        super(props);

        this.handlePlayChange = this.handlePlayChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleTrackChange = this.handleTrackChange.bind(this);

        this.state = {
            songData : props.songData,
            isPlaying : AudioPlayer.isPlaying(),
            currentTime : AudioPlayer.currentTime,
            percentage : AudioPlayer.percentage,
            duration : AudioPlayer.duration,
            show : ''
        }
    }

    componentDidMount() {
        AudioPlayer.listenTo(AudioPlayer.Event.PlayChange, this.handlePlayChange);
        AudioPlayer.listenTo(AudioPlayer.Event.TimeUpdate, this.handleTimeChange);
        AudioPlayer.listenTo(AudioPlayer.Event.TrackChanged, this.handleTrackChange);
        this.timer = setTimeout(() => this.show(), 1);
        AudioPlayer.setTrack(this.state.songData.id);

    }

    show() {
        this.setState({show : 'show'});
        clearTimeout(this.timer);
    }

    componentWillUnmount() {
        AudioPlayer.unListenTo(AudioPlayer.Event.PlayChange, this.handlePlayChange);
        AudioPlayer.unListenTo(AudioPlayer.Event.TimeUpdate, this.handleTimeChange);
        AudioPlayer.unListenTo(AudioPlayer.Event.TrackChanged, this.handleTrackChange);
    }

    handlePlayChange(e) {
        this.setState({isPlaying : e.isPlaying});
    }

    handleTimeChange(e) {
        this.setState({
            currentTime : e.currentTime,
            percentage : e.percentage,
            duration : e.duration
        });
    }

    handleTrackChange(e) {
        this.setState({
            currentTime : 0,
            songData : e.currentTrack,
            percentage : 0,
            duration : e.duration
        });
    }

    render() {
        return(
            <div className={"activity " + this.state.show} data-activity="ActivityRecordPlayer">
                <header className="header">
                    <span className="artist-name">{this.state.songData.artist}</span>
                    <span className="song-title">{this.state.songData.songTitle}</span>
                </header>
                <RecordPlayer coverUrl={this.state.songData.coverUrl} percentage={this.state.percentage} isPlaying={this.state.isPlaying}/>
                <SeekBar currentTime={this.state.currentTime} duration={this.state.duration} percentage={this.state.percentage}/>
                <Equalizer isPlaying={this.state.isPlaying}/>
            </div>
        );
    }
}

export {ActivityRecordPlayer as default}