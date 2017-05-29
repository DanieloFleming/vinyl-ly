import React from "react";
import ReactDOM from "react-dom";
import AudioPlayer from "../../class/MusicPlayer";
import Slider from "../element/Slider";


class SeekBar extends React.Component
{
    constructor(props) {
        super(props);

        this.handleOnChange = this.handleOnChange.bind(this);
    }

    formatTimeOutput(value) {
        const seconds = value || 0;
    
        return new Date(seconds * 1000).toISOString().substr(14, 5);
    }
    
    render(){
        return (
            <div className="track-seeker">
                <span className="elapsed">{this.formatTimeOutput(this.props.currentTime)}</span>
                <span className="duration">{this.formatTimeOutput(this.props.duration)}</span>
                <Slider onChange={this.handleOnChange} type="range" value={this.props.percentage || 0} className="seekbar"  min="0" max="99.9" />
            </div>
        );
    }

    handleOnChange(e) {
       const value = e.currentTarget.value;

        AudioPlayer.setPlayTime(this.props.duration * (value / 100));
    }

}

export {SeekBar as default}