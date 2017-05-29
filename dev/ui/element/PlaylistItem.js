import React from "react";
import ReactDOM from "react-dom";

function PlaylistItem(props) {
    const onClick = props.onClick;
    const coverArt = props.data.coverUrl;
    const artistName = props.data.artist;
    const songTitle = props.data.songTitle;
    const isSelected = props.isSelected ? ' selected' : '';
    const isPlaying = props.isSelected && props.isPlaying ? ' playing' : ''

    return( 
        <li data-index={props.index} onClick={onClick} className={"playlist-item " + isSelected + isPlaying} data-id={props.id}
        ref={ (li) => props.isSelected ? props.setTarget(li) : null}>
            <div className="cover-art">
                <figure className="cover-art-vinyl"></figure>
                <img src={coverArt} />
            </div>
            <div className="playlist-item--info">
                <span className="artist-name">{artistName}</span>
                <span className="song-title">{songTitle}</span>
            </div>
        </li>
    ); 
}


export {PlaylistItem as default};