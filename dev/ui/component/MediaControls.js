import React from "react";
import ReactDOM from "react-dom";
import AudioPlayer from "../../class/MusicPlayer.js";
import Button from '../element/Button.js';
import VolumeSlider from '../component/VolumeSlider.js';

class MediaControls extends React.Component
{
    constructor(props){
        super(props);
        
        this.state = {
            types : [
                ['previous', 'flaticon-back'], 
                ['play', 'flaticon-play-button'], 
                ['next', 'flaticon-next']
            ],
            volumeButton : ['volume', 'flaticon-interface'],
            isActive : false,
            volume:100
        };
        
        this.handlePlayChange = this.handlePlayChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.setInactive = this.setInactive.bind(this);
    }

    componentDidMount() {
        AudioPlayer.listenTo(AudioPlayer.Event.PlayChange, this.handlePlayChange);
    }
    componentWillUnmount(){
        AudioPlayer.unListenTo(AudioPlayer.Event.PlayChange, this.handlePlayChange);
    }

    handlePlayChange(e) {
        let types = this.state.types;

        if(e.isPlaying && types[1][0] == "play") {
            
            types[1] = ['pause', 'flaticon-pause-button'];
        } else if(!e.isPlaying && types[1][0] == "pause") {
            types[1] = ['play', 'flaticon-play-button'];
        } else {
            return;
        }

        this.setState({types : types});
    }

    handleButtonClick(e){
        const type = e.currentTarget.getAttribute('data-type');

        switch(type) {
            case 'previous':
                AudioPlayer.previous();
                break;
            case 'play':
                AudioPlayer.play();
                break;
            case 'pause':
                AudioPlayer.pause();
                break;
            case 'next':
                AudioPlayer.next();
                break;
            case 'player':
            case 'list':
                this.startActivity();
                break;
            case "volume":
                this.toggleVolume();
                break;
        }
    }

    toggleVolume() {
        this.setState((prevState, props) => {
            return {isActive : !prevState.isActive}
        });
    }

    handleVolumeChange(e) {
        const value = e.currentTarget.value / 100 || 0;
        
        AudioPlayer.audioPlayer.volume = value;

        this.setState({
            volume:AudioPlayer.audioPlayer.volume * 100
        });
    }
    setInactive() {
        this.setState({isActive : false});
    }

    render() {
        return (
            <div className="media-controls">
                <Button type={this.getAction(this.props.currentActivity)} onClick={this.handleButtonClick} />
                {this.state.types.map((value, index) => 
                    <Button key={index} type={value} onClick={this.handleButtonClick} />
                )}
                <Button type={this.state.volumeButton} onClick={this.handleButtonClick} />
                <VolumeSlider setInactive={this.setInactive} isActive={this.state.isActive} onChange={this.handleVolumeChange} volume={this.state.volume}/>
            </div>
        );
    }

    getAction(activityType) {
        this.action = activityType == "Playlist" ? ["player", 'flaticon-lp-player'] : ["list", "flaticon-list"];
        return this.action;
    }

    startActivity() {
        if(this.action[0] == 'list') {
            this.props.startActivity('Playlist');
        } else {
            this.props.startActivity('RecordPlayer', AudioPlayer.currentTrack);
        }
    }
}

export {MediaControls as default}