import React from "react";
import ReactDOM from "react-dom";
import TweenLite  from 'gsap';

import PlaylistItem from "../element/PlaylistItem.js";
import AudioPlayer from "../../class/MusicPlayer";

class ActivityPlaylist extends React.Component
{
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleTrackChange = this.handleTrackChange.bind(this);
        this.handlePlayChange = this.handlePlayChange.bind(this);
        this.setRef = this.setRef.bind(this);
        this.scroll = this.scroll.bind(this);

        this.state = {
            playlist : props.playlist,
            currentTrackId : AudioPlayer.id,
            isPlaying : AudioPlayer.isPlaying(),
            show : ''
        }

    }

    componentDidMount() {
        AudioPlayer.listenTo(AudioPlayer.Event.TrackChanged, this.handleTrackChange);
        AudioPlayer.listenTo(AudioPlayer.Event.PlayChange, this.handlePlayChange);

        this.timer = setTimeout(() => this.show(), 1);

        this.switched = true;
    }

    show() {
        this.setState({show : 'show'});
        clearTimeout(this.timer);
    }

    
    componentWillUnmount() {
        AudioPlayer.unListenTo(AudioPlayer.Event.TrackChanged, this.handleTrackChange);
        AudioPlayer.unListenTo(AudioPlayer.Event.PlayChange, this.handlePlayChange);
    }
    render() {
        return(
            <div className={"activity " + this.state.show} data-activity="ActivityPlaylist">
                <header className="header"><h2 className="header-title">playlist</h2></header>
                <ul className="playlist" ref={ (ul) => {this.list = ul || this.list}}>
                    {this.state.playlist.map((data, index) => 
                        <PlaylistItem 
                            key={index} 
                            index={index}
                            id={data.id} 
                            data={data}
                            isSelected={this.state.currentTrackId == data.id}
                            isPlaying={this.state.isPlaying}
                            onClick={this.handleClick}
                            setTarget={this.setRef}
                        />
                    )}
                </ul>
            </div>
        );
    }

    setRef(element) {
        if(!this.list || !element || !this.switched) return;

        this.switched = false;

        const id = element.getAttribute('data-index');
        const box = element.getBoundingClientRect();
        let obj = { top:this.list.scrollTop};

        TweenLite.to(obj, .6, {
            top:(box.height * id),
            onUpdate: this.scroll,
            onUpdateParams:[obj],
            clearProps: "all",
            ease: Power2.easeInOut
        });
    }

    scroll(obj){
        this.list.scrollTop = obj.top;
    }

    handleClick(e) {
        const songData = AudioPlayer.playlist[e.currentTarget.getAttribute("data-id")]
        
        this.props.startActivity('RecordPlayer', songData);
    }

    handleTrackChange(e) {
        this.setState({currentTrackId : e.currentTrack.id});

        this.switched = true;
    }

    handlePlayChange(e) {
        this.setState({isPlaying : e.isPlaying});
    }

}

export {ActivityPlaylist as default};
