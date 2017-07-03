
class MusicPlayer {

    /**
     * Get Event
     * 
     * @readonly
     * 
     * @memberof MusicPlayer
     */
    get Event() {
        return {
            TrackChanged : 'onTrackChange',
            PlayChange : 'onPlayChange',
            TimeUpdate : 'onTimeUpdate'
        }
    }

    /**
     * Creates an instance of MusicPlayer.
     * @param {any} playlist 
     * 
     * @memberof MusicPlayer
     */
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

    /**
     * handle what happends when the playstate has changed.
     * 
     * @param {Event} e 
     * 
     * @memberof MusicPlayer
     */
    handlePlayState(e) {
       this.trigger("onPlayChange", {
           isPlaying : this.isPlaying()
        });
    }

    /**
     * Play next track when end of audio is reached.
     * 
     * @param {Event} e 
     * 
     * @memberof MusicPlayer
     */
    handleEnded(e) {
        this.next();
    }

    /**
     * Set the playlist
     * 
     * @param {Array} playlist 
     * 
     * @memberof MusicPlayer
     */
    setPlaylist(playlist) {
        this.playlist = playlist;
        this.playlistCount = playlist.length
    }

    /**
     * Register object which want to listen to provided events.
     * Something like an Observer.
     * 
     * @param {string} eventName 
     * @param {function} callback 
     * 
     * @memberof MusicPlayer
     */
    listenTo(eventName, callback) {
        if(!this.events[eventName])  this.events[eventName] = [];

        this.events[eventName].push({
            type : eventName,
            target : this,
            callback : callback
        }); 
    }

    /**
     * Unregister objects listening to provided events.
     * 
     * @param {string} eventName 
     * @param {function} callback 
     * 
     * @memberof MusicPlayer
     */
    unListenTo(eventName, callback) {
        if(this.events[eventName]) {
            this.events[eventName].forEach((eventObject, index) => {
                if(eventObject.callback == callback) {
                    this.events[eventName].splice(index, 1);
                }
            });
        }
    }

    /**
     * Perform action on provided (trigger) event.
     * 
     * @param {string} eventName 
     * @param {object} props 
     * @memberof MusicPlayer
     */
    trigger(eventName, props) {
        if(this.events[eventName]) {
            props.type = eventName;
            this.events[eventName].forEach(eventObject => 
                eventObject.callback(props)
            );
        }
    }


    /**
     * 
     * @param {int} playTime 
     * 
     * @memberof MusicPlayer
     */
    setPlayTime(playTime) {
        if(this.audioPlayer.duration) {
            this.audioPlayer.currentTime = playTime;
            this.trigger("onTimeUpdate", this.durationInfo());
        }
    }

    /**
     * Assign audiotrack to play based on index of audio in playlist
     * 
     * @param {int} id 
     * @returns 
     * @memberof MusicPlayer
     */
    setTrack(id) {
        if(this.isSetable()) {
            this.currentTrack = this.playlist[id];
            this.audioPlayer.src = this.currentTrack.audio;
            
            this.play();

            this.trigger('onTrackChange', {
                currentTrack : this.currentTrack,
                duration : this.audioPlayer.duration
            });
        }

    }

    /**
     * Play the next audio track.
     * 
     * @memberof MusicPlayer
     */
    next() {
        const index = this.playlist.indexOf(this.currentTrack) + 1;
        
        if(index > this.playlistCount - 1) {
            this.setTrack(0);
        } else {
            this.setTrack(index);
        }
    }

    /**
     * Play the previous audio track
     * 
     * @memberof MusicPlayer
     */
    previous() {
        const index = this.playlist.indexOf(this.currentTrack) - 1;
        
        if(index < 0) {
            this.setPlayTime(0);
        } else {
            this.setTrack(index);
        }
    }

    /**
     * Pause audio playback
     * 
     * @memberof MusicPlayer
     */
    pause() {
        if(!this.notLoaded()){
            this.audioPlayer.pause();
        }
    }

    /**
     * Play audio.
     * 
     * @memberof MusicPlayer
     */
    play() {

        if(!this.currentTrack || this.id == -1) {
            this.setTrack(0);
        }

        this.audioPlayer.play();
    }

    /**
     * Check if audio is playing.
     * 
     * @returns true|false
     * 
     * @memberof MusicPlayer
     */
    isPlaying() {
        return !this.audioPlayer.paused;
    }

    /**
     * Pause or play audio depending on playstate.
     * 
     * @memberof MusicPlayer
     */
    togglePlay() {
        if(this.isPlaying()) {
            this.pause();
        } else {
            this.play();
        }
    }

    /**
     * Duration of current audio
     * 
     * @readonly
     * @memberof MusicPlayer
     */
    get duration() {
        return Math.floor(this.audioPlayer.duration) || 0;
    }

    /**
     * Elapsed time played.
     * 
     * @readonly
     * @memberof MusicPlayer
     */
    get currentTime() {
        return Math.floor(this.audioPlayer.currentTime) || 0;
    }

    /**
     * Elapsed time played conferted to percentage
     * 
     * @readonly
     * @memberof MusicPlayer
     */
    get percentage() {
        return (this.currentTime / this.duration * 100) || 0; 
    }

    /**
     * Get index of audio in Array
     * 
     * @readonly
     * @memberof MusicPlayer
     */
    get id() {
        if(!this.currentTrack) return -1;

        return this.currentTrack.id;
    }

    /**
     * 
     * 
     * @param {Event} e 
     * @memberof MusicPlayer
     */
    updateTime(e) {
        const info = this.durationInfo();
        
        this.trigger("onTimeUpdate", this.durationInfo());
    }

    /**
     * Calculate audio playtime and playintime.
     * 
     * @returns {object} durationInfo
     * 
     * @memberof MusicPlayer
     */
    durationInfo() {
        const currentTime = Math.floor(this.audioPlayer.currentTime);
        const duration = Math.floor(this.audioPlayer.duration);
        const percentage = currentTime / duration * 100; 

        return {currentTime, duration, percentage};
    } 

    /**
     * Check if audio is not loaded
     * 
     * @returns true|false
     * 
     * @memberof MusicPlayer
     */
    notLoaded() {
        return !this.isIe11 ? this.currentTrack 
            && (this.audioPlayer.readyState !== 2 &&  this.audioPlayer.readyState !== 4)  
            : false;
    }

    /**
     * Check if track is settable
     * 
     * @param {int} id 
     * 
     * @returns true|false
     * 
     * @memberof MusicPlayer
     */
    isSetable(id) {
        return !(id < 0 || (this.currentTrack && this.currentTrack.id == id) || this.notLoaded());
        //if(this.id !== -1 && (this.notLoaded() || (this.currentTrack && this.currentTrack.id == id))) return false;
    }
    
}
/**
 * Check if browser is ie11
 * NOTE: Ie11 does some bs with the playstate.
 */
MusicPlayer.prototype.isIe11 = navigator.userAgent.indexOf("Edge") > -1;

/**
 * Make singleton
 */
let AudioPlayer = new MusicPlayer();

export {AudioPlayer as default}