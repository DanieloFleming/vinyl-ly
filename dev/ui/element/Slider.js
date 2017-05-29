import React from "react";
import ReactDOM from "react-dom";
import Range from '@mapbox/react-range';


class Slider extends React.Component {

    render() {
      return (this.isIe ? (
        <Range onChange={this.props.onChange} type="range" value={this.props.value || 0} className={this.props.className}  min="0" max="99.99" />
      ) : (
        <input onChange={this.props.onChange} type="range" value={this.props.value || 0} className={this.props.className}  min="0" max="99.99" />
      ))
    }
}

Slider.prototype.isIe = navigator.userAgent.indexOf("Edge") > -1 || navigator.userAgent.indexOf("Trident/7.0") > -1;



export {Slider as default}

