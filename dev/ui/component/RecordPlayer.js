import React from "react";
import ReactDOM from "react-dom";

class RecordPlayer extends React.Component
{

    setArm(percentage) {
        const value = -31 + (22 * percentage / 100);

        return {
            transform : "rotate(" + value + "deg)" 
        }
    }

    render(){
        const isPlaying = this.props.isPlaying ? 'is-playing' : '';

        return (
            <div className={"record-table " + isPlaying}>
                <figure className="record-vinyl">
                    <img className="record-image" src={this.props.coverUrl} />
                </figure>
                <figure style={this.setArm(this.props.percentage)} className="record-arm"></figure>
            </div>
        );
    }
}

export {RecordPlayer as default}