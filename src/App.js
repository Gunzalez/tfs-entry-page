import React, { Component } from 'react';

import Logo from './assets/images/logo.svg';
import './App.css'

import List from './components/List/List';

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            url: 'http://18.195.38.29/',
            presetConfigIds: [],
            localConfigIds: [],
            predefined: "Preset list",
            locals: "5 most recent config IDs"
        };
    }

    componentDidMount(){
        let url = '/data/configids.json';
        fetch(url)
            .then(response => {
                return response.json()
            })
            .then(array => {
                this.setState({
                    presetConfigIds: array
                })
            })
            .catch(function(err){
                console.log(err);
            });

        // local storage
        if (typeof(Storage) !== "undefined") {
            let localConfigIds = localStorage.getItem("localConfigIds");
            if(localConfigIds){
                this.setState({
                    localConfigIds: localConfigIds.split('||')
                })
            }
        }
    }

    launchSite(event){
        // stop default action
        event.preventDefault();

        // extract objects
        let $form = event.target,
            $configId = $form["configId"],
            $baseUrl = $form["baseUrl"],
            $btn = $form["btn-submit"],
            $error = document.querySelectorAll(".error")[0];

        // create url
        let baseUrl = $baseUrl.value,
            configId = $configId.value.replace(/^\s+|\s+$/g, ''),
            fullUrl = baseUrl + configId;

        // launch demo site in new window
        if(configId.length > 0){

            // open new window
            window.open(fullUrl);

            this.updateLocateList(configId);

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

    onChangeBaseUrl(event){
        let newBaseUrl = event.target.value;
        this.setState({
            url: newBaseUrl
        })
    }

    onChangeHandler(event){
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

    updateLocateList(configId){
        if (typeof(Storage) !== "undefined") {

            let localConfigIds = [];
            if(localStorage.getItem("localConfigIds") !== null){
                localConfigIds = localStorage.getItem("localConfigIds").split('||');
            }
            let presetConfigIds = [];
            this.state.presetConfigIds.map(configId => {
                presetConfigIds.push(configId.id)
            });
            if(localConfigIds.indexOf(configId) === -1 && presetConfigIds.indexOf(configId) === -1){
                localConfigIds.unshift(configId);

                if(localConfigIds.length > 5){
                    let amountToRemove = localConfigIds.length - 5;
                    localConfigIds.splice(4, amountToRemove);
                }

                localStorage.setItem("localConfigIds", localConfigIds.join('||'));
                this.setState({
                    localConfigIds: localConfigIds
                })
            }
        }
    };

    resetBaseUrl(event){
        event.preventDefault();
        window.location.reload();
    }

    clearLocalConfigIds(event){
        event.preventDefault();
        if (typeof(Storage) !== "undefined") {

            localStorage.removeItem("localConfigIds");
            this.setState({
                localConfigIds: []
            })
        }
    };

    render() {
        return (
            <div className="App">
                <div className="header">
                    <div className="container">
                        <img src={Logo} alt="Toyota" />
                    </div>
                </div>
                <div className="body">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-sm-6 col-md-8">
                                <div className="form">
                                    <form onSubmit={this.launchSite.bind(this)} autoComplete="off">
                                        <label className="label">Config ID test page</label>
                                        <p className="helper">Type in just the config ID eg. <span>2hwH09m</span></p>
                                        <p className="helper">This will launch the demo site in a new window or tab</p>
                                        <p className="error display-none">Please provide a config ID to progress</p>
                                        <input id="configId" onChange={this.onChangeHandler} name="configId" className="form-control configId" />
                                        <button name="btn-submit" className="btn btn-default btn-submit" disabled>Launch</button><br /><br />
                                        <p className="likeLabel">Base Url (including http part) | <a href="" onClick={this.resetBaseUrl}>Reset</a></p>
                                        <input defaultValue={this.state.url} onChange={this.onChangeBaseUrl.bind(this)} name="baseUrl" className="baseUrl" />
                                    </form>
                                </div>
                                <List title={this.state.locals} items={this.state.localConfigIds} url={this.state.url} />
                                { this.state.localConfigIds.length > 0 ? <p className="clearList"><a href="" onClick={this.clearLocalConfigIds.bind(this)}>Clear</a> recent list.</p> : null }
                            </div>
                            <div className="col-6 col-md-4">
                                <List title={this.state.predefined} sub={true} items={this.state.presetConfigIds} url={this.state.url} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default App;
