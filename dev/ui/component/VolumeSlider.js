import React from "react";
import ReactDOM from "react-dom";
import Slider from "../element/Slider";

class VolumeSlider extends React.Component
{

    constructor(props){
        super(props);
        this.state = {isActive:false, fade:''};

        this.handleMouseEvent = this.handleMouseEvent.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.isActive !== this.props.isActive) {
            this.setState({isActive:nextProps.isActive});
            if(nextProps.isActive) {
                this.setTimer();
            }
        }
    }

    render() {
        const isActive = this.state.isActive ? 'active' : '';
        return(
            <div className={"volume-slider " + isActive + this.state.fade} onMouseEnter={this.handleMouseEvent} onMouseLeave={this.handleMouseEvent}>
                <Slider type="range" onChange={this.props.onChange} min="0" max="100" value={this.props.volume}/>
            </div> 
        );
    }

    handleMouseEvent(e) {
        switch(e.type) {
            case 'mouseenter':
                this.removeTimer();
                this.setState({fade:' fade-out'});
                break;
            case 'mouseleave':
                this.setTimer();
                break;
        }
    }

    setTimer(seconds = 2300) {
        this.timer = setTimeout(() => {
            this.setState({isActive:false, fade:''});
            this.removeTimer();
            this.props.setInactive();
        }, seconds);
    }

    removeTimer() {
        if(this.timer) clearTimeout(this.timer);
    }
}

export {VolumeSlider as default}