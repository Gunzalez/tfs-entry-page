import React from 'react';

const launchSite = (event) => {
    // stop default action
    event.preventDefault();

    // extract objects
    let form = event.target,
        $configId = form["configId"],
        $baseUrl = form["baseUrl"],
        $btn = form["btn-submit"],
        $error = document.querySelectorAll(".error")[0];

    // create url
    let baseUrl = $baseUrl.value,
        configId = $configId.value.replace(/^\s+|\s+$/g, ''),
        fullUrl = baseUrl + configId;

    // launch demo site in new window
    if(configId.length > 0){

        // open new window
        window.open(fullUrl);

        // reset values and states
        $configId.value = '';
        $btn.setAttribute('disabled','disabled');
        $error.className = "error display-none";

    } else {

        // display error
        $error.className = 'error';
    }

    // removes focus from button
    $configId.focus();
};

const onChangeHandler = (event) => {
    let $form = event.target.parentNode,
        $formField = event.target,
        $btn = $form["btn-submit"];

    let currentValue = $formField.value.replace(/^\s+|\s+$/g, '');
    if(currentValue.length > 0){
        $btn.removeAttribute("disabled");
    } else {
        $btn.setAttribute('disabled','disabled');
    }
};

const Form = (props) => (
    <div className="form">
        <div className="container">
            <form onSubmit={launchSite} autoComplete="off">
                <label className="label">Config ID</label>
                <p className="helper">Enter in just the config ID eg. <span>2hwH09m</span></p>
                <p className="helper">This will launch the demo site in a new window or tab</p>
                <p className="error display-none">Please provide a config ID to progress</p>
                <input id="configId" onChange={onChangeHandler} name="configId" className="form-control" /><br />
                <input type="hidden" name="baseUrl" value={props.url} />
                <button name="btn-submit" className="btn btn-default btn-submit" disabled>Launch</button>
            </form>
            <hr />

        </div>
    </div>
);

export default Form;