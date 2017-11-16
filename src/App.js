import React, { Component } from 'react';

import Logo from './assets/images/logo.svg';
import './App.css'

import List from './components/List/List';

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            historyCount: 10,
            url: "",
            environments: [],
            presetConfigIds: [],
            localConfigIds: [],
            predefined: "Config ID examples",
            locals: "most recent config IDs",
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

        let envUrl = '/data/environments.json';
        fetch(envUrl)
            .then(response => {
                return response.json()
            })
            .then(array => {
                let firstENV = array[0].url;
                this.setState({
                    environments: array,
                    url: firstENV
                });
            })
            .catch(function(err){
                console.log(err);
            });
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

            // add to local storage if not already in
            this.updateLocalHistoryList(fullUrl);

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

    onChangeConfigIdHandler(event){
        let $form = document.getElementsByTagName('form')[0],
            $formField = event.target,
            $btn = $form["btn-submit"];

        let currentValue = $formField.value.replace(/^\s+|\s+$/g, '');
        if(currentValue.length > 0){
            $btn.removeAttribute("disabled");
        } else {
            $btn.setAttribute('disabled','disabled');
        }
    };

    updateLocalHistoryList(configId){
        if (typeof(Storage) !== "undefined") {

            let localConfigIds = [];
            if(localStorage.getItem("localConfigIds") !== null){
                localConfigIds = localStorage.getItem("localConfigIds").split('||');
            }

            if(localConfigIds.indexOf(configId) !== -1){
                let curIndex = localConfigIds.indexOf(configId);
                localConfigIds.splice(curIndex, 1);
            }
            localConfigIds.unshift(configId);

            if(localConfigIds.length > this.state.historyCount){
                let amountToRemove = localConfigIds.length - this.state.historyCount;
                localConfigIds.splice((this.state.historyCount - 1), amountToRemove);
            }

            localStorage.setItem("localConfigIds", localConfigIds.join('||'));
            this.setState({
                localConfigIds: localConfigIds
            })
        }
    };

    clearLocalConfigIds(event){
        event.preventDefault();
        if (typeof(Storage) !== "undefined") {
            localStorage.removeItem("localConfigIds");
            this.setState({
                localConfigIds: []
            })
        }
    };

    onChangeSelect(event){
        let $form = document.getElementsByTagName('form')[0],
            $select = event.target,
            $baseUrl = $form["baseUrl"];

        $baseUrl.value = $select.value;
        this.setState({
            url: $select.value
        });
    }

    createListItem(item){
        return <option key={item.url} value={item.url}>{item.name}</option>
    };

    simpleListItem(item){
        return <li key={item}><a href={item} target="_blank">{item}</a></li>
    };

    doStuff(thing){
        alert(thing)
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

                                {/* Form */}
                                <div classID="theForm" className="form">

                                    <h1>TFS Entry page</h1>
                                    <div className="intro">
                                        <p>Provides access to the start of the project on the various environments as they become available. It is simply a shortcut to the main TFS project but <strong>not part of the project</strong>.</p>
                                            <p>Ideal for internal use like sharing and testing, but <strong>will be used by the client</strong> too and so this stops the client needing to type into the browser location bar.</p>
                                        <h2>How to use / Steps</h2>
                                        <ol>
                                            <li>Select an environment (if not in the select box, type it in)</li>
                                            <li>Type in a Config Id (or click on a Config ID from the list on the right)</li>
                                            <li>Press the Enter key, or click the <strong>Launch</strong> button</li>
                                        </ol>
                                    </div>

                                    <form onSubmit={this.launchSite.bind(this)} autoComplete="off">

                                        <label>Environment</label>
                                        <div className="row">
                                            <div className="col-sm-4 no-gutter-right">
                                                <select className="form-control environment" onChange={this.onChangeSelect.bind(this)}>
                                                    { this.state.environments.map(environment => {
                                                        return this.createListItem(environment)
                                                    })}
                                                </select>
                                            </div>
                                            <div className="col-sm-8 no-gutter-left">
                                                <input value={this.state.url} onChange={this.onChangeBaseUrl.bind(this)} name="baseUrl" className="form-control baseUrl" />
                                            </div>
                                        </div>

                                        <label>Config Id</label><span className="helper">Type in just the config ID eg. <span>2hwH09m</span></span>
                                        <input id="configId" onChange={this.onChangeConfigIdHandler} name="configId" className="form-control configId" />

                                        <p className="error display-none">Please provide a config ID to progress</p>
                                        <button name="btn-submit" className="btn btn-default btn-submit" disabled>Launch</button>

                                    </form>
                                </div>

                                {/* List */}
                                <div className="list simple">
                                    <h3 className="heading">{ this.state.historyCount } { this.state.locals }</h3>
                                    <ul>
                                        { this.state.localConfigIds.map(item => {
                                            return this.simpleListItem(item)
                                        })}
                                        { this.state.localConfigIds.length < 1 ? <li>Empty list</li> : null }
                                    </ul>
                                </div>

                                {/* Link to clear the list */}
                                { this.state.localConfigIds.length > 0 ? <p className="clearList"><a href="" onClick={this.clearLocalConfigIds.bind(this)}>Clear</a> this list.</p> : null }

                            </div>
                            <div className="col-6 col-md-4">

                                {/* List component */}
                                <List title={this.state.predefined} sub={true} items={this.state.presetConfigIds} url={this.state.url} action={this.doStuff.bind(this)} />

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default App;
