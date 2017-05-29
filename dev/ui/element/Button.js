import React from "react";
import ReactDOM from "react-dom";

function Button(props) {

    return (
        <button className={"button " + props.type[1]} onClick={props.onClick} data-type={props.type[0]}></button>
    );
}

export {Button as default}