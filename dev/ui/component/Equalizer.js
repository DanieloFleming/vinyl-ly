import React from "react";
import ReactDOM from "react-dom";

class Equalizer extends React.Component
{
    render(){
        const isPlaying = this.props.isPlaying ? 'play' : '';
        return(
            <div className={"equaliser-container " + isPlaying}>
                {this.getBars().map(value => value)}
            </div>
        );
    }

    getBars() {
        let i = 0, amount = 10, bars = [];
        for(i; i < amount; i++) {
            bars.push(<div key={i} className="equaliser-column"><div className="colour-bar"></div></div>);
        }

        return bars;
    }
}

export {Equalizer as default};
