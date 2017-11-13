import React from 'react';

const launchSite = (event) => {
    // stop default action
    event.preventDefault();

    // extract objects
    let form = event.target,
        $configId = form["configId"],
        $baseUrl = form["baseUrl"],
        $label = form.querySelectorAll("label")[0];

    // create url
    let baseUrl = $baseUrl.value,
        configId = $configId.value.replace(/^\s+|\s+$/g, ''),
        fullUrl = baseUrl + configId;

    // launch demo site in new window
    if(configId.length > 0){
        $label.className = "label";
        //window.open(fullUrl);
        console.log(fullUrl);
        $configId.value = '';
    } else {
        $label.className = 'label show';
    }

    // removes focus from button
    $configId.focus();
};

const onChangeHandler = () => {


};

const Form = (props) => (
    <div className="form">
        <div className="container">
            <h3>Enter a configId</h3>
            <form onSubmit={launchSite}>
                <label className="label">Please provide a Config ID <span>(Opens in new window/tab)</span></label>
                <p className="helper visuallyHidden">Enter just the config ID eg. 2hwH09m</p>
                <input id="configId" onChange={onChangeHandler} name="configId" className="form-control" placeholder="eg 2hwH09m" /><br />
                <input type="hidden" name="baseUrl" value={props.url} />
                <button className="btn btn-default btn-submit" disabled>Start</button>
            </form>
            <hr />
        </div>
    </div>
);

export default Form;