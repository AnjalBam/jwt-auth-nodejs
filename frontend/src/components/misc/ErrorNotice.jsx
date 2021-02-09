import React from "react";

function ErrorNotice(props) {
    console.log(props);
    return (
        <div className="error-notice">
            <span>{props.error}</span>
            <button onClick={props.clearError}>X</button>
        </div>
    );
}

export default ErrorNotice;
