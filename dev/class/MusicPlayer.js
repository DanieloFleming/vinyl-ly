
class MusicPlayer {

    get Event() {
        return {
            TrackChanged : 'onTrackChange',
            PlayChange : 'onPlayChange',
            TimeUpdate : 'onTimeUpdate'
        }
    }

    constructor(playlist) {
        this.events = {};
        this.audioPlayer = new Audio();
        this.currentTrack = {
            coverUrl: 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==',
            artist : 'Ms. No Name',
            songTitle : 'No record selected, press play!',
            id:-1
        };
        this.updateTime = this.updateTime.bind(this);
        this.handlePlayState = this.handlePlayState.bind(this);
        this.handleEnded = this.handleEnded.bind(this);

        this.audioPlayer.addEventListener('timeupdate', this.updateTime);
        this.audioPlayer.addEventListener('play', this.handlePlayState);
        this.audioPlayer.addEventListener('pause', this.handlePlayState);
        this.audioPlayer.addEventListener('ended', this.handleEnded);
    }

    handlePlayState(e) {
       this.trigger("onPlayChange", {isPlaying : this.isPlaying()});
    }

    handleEnded(e) {
        this.next();
    }

    setPlaylist(playlist) {
        this.playlist = playlist;
        this.playlistCount = playlist.length
    }

    listenTo(eventName, callback) {
        if(!this.events[eventName])  this.events[eventName] = [];

        this.events[eventName].push({
            type : eventName,
            target : this,
            callback : callback
        }); 
    }

    unListenTo(eventName, callback) {
        if(this.events[eventName]) {
            this.events[eventName].forEach((eventObject, index) => {
                if(eventObject.callback == callback) {
                    this.events[eventName].splice(index, 1);
                }
            });
        }
    }

    trigger(eventName, props) {
        if(this.events[eventName]) {
            props.type = eventName;
            this.events[eventName].forEach(eventObject => 
                eventObject.callback(props)
            );
        }
    }

    setPlayTime(playTime) {
        if(!this.audioPlayer.duration) return;
        this.audioPlayer.currentTime = playTime;
        this.trigger("onTimeUpdate", this.durationInfo());
    }

    setTrack(id) {
        if(id < 0) return;

        if(this.id !== -1 && (this.notLoaded() || (this.currentTrack && this.currentTrack.id == id))) return false;

        this.currentTrack = this.playlist[id];
        this.audioPlayer.src = this.currentTrack.audio;
        
        this.play();

        this.trigger('onTrackChange', {
            currentTrack : this.currentTrack,
            duration : this.audioPlayer.duration
        });
    }

    next() {

        const index = this.playlist.indexOf(this.currentTrack) + 1;
        
        if(index > this.playlistCount - 1) {
            this.setTrack(0);
        } else {
            this.setTrack(index);
        }
    }

    previous() {
        const index = this.playlist.indexOf(this.currentTrack) - 1;
        
        if(index < 0) {
            this.setPlayTime(0);
        } else {
            this.setTrack(index);
        }
    }

    pause() {
        if(this.notLoaded()) return;

        this.audioPlayer.pause();
    }

    play() {

        if(!this.currentTrack || this.id == -1) {
            this.setTrack(0);
        }

        this.audioPlayer.play();
    }

    isPlaying() {
        return !this.audioPlayer.paused;
    }

    togglePlay() {
        if(this.isPlaying()) {
            this.pause();
        } else {
            this.play();
        }
    }

    get duration() {
        return Math.floor(this.audioPlayer.duration) || 0;
    }

    get currentTime() {
        return Math.floor(this.audioPlayer.currentTime) || 0;
    }

    get percentage() {
        return (this.currentTime / this.duration * 100) || 0; 
    }

    get id() {
        if(!this.currentTrack) return -1;

        return this.currentTrack.id;
    }

    updateTime(e) {
        const info = this.durationInfo();
        
        this.trigger("onTimeUpdate", this.durationInfo());
    }

    durationInfo(audio) {
        const currentTime = Math.floor(this.audioPlayer.currentTime);
        const duration = Math.floor(this.audioPlayer.duration);
        const percentage = currentTime / duration * 100; 

        return {currentTime, duration, percentage};
    } 

    notLoaded() {
        return !this.isIe11 ? this.currentTrack 
            && (this.audioPlayer.readyState !== 2 &&  this.audioPlayer.readyState !== 4)  
            : false;
    }
    
}
MusicPlayer.prototype.isIe11 = navigator.userAgent.indexOf("Edge") > -1;

let AudioPlayer = new MusicPlayer();

export {AudioPlayer as default}