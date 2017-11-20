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
            envName: "",
            environments: [],
            presetConfigIds: [],
            localConfigIds: []
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
                let firstENV = array[0].url,
                    firstEnvName = array[0].name;

                this.setState({
                    environments: array,
                    url: firstENV,
                    envName: firstEnvName
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

            // add to local storage if not already in
            this.updateLocalHistoryList(fullUrl);

            // open new window
            window.location.assign(fullUrl);

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

    updateLocalHistoryList(configIdUrl){
        if (typeof(Storage) !== "undefined") {

            let localConfigIds = [];
            if(localStorage.getItem("localConfigIds") !== null){
                localConfigIds = localStorage.getItem("localConfigIds").split('||');
            }

            if(localConfigIds.indexOf(configIdUrl) !== -1){
                let curIndex = localConfigIds.indexOf(configIdUrl);
                localConfigIds.splice(curIndex, 1);
            }
            localConfigIds.unshift(configIdUrl);

            if(localConfigIds.length > this.state.historyCount){
                let amountToRemove = localConfigIds.length - this.state.historyCount;
                localConfigIds.splice((this.state.historyCount - 1), amountToRemove);
            }

            localStorage.setItem("localConfigIds", localConfigIds.join('||'));
            // this.setState({
            //     localConfigIds: localConfigIds
            // })
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

        let envName = $select.options[$select.selectedIndex].text;
        $baseUrl.value = $select.value;
        this.setState({
            url: $select.value,
            envName: envName
        });
    }

    createListItem(item){
        return <option key={item.url} value={item.url}>{item.name}</option>
    };

    simpleListItem(item){
        return (
            <li key={item}>
                <a href={item} onClick={()=>{this.updateLocalHistoryList(item)}}>{item}</a>
            </li>
        )
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
                            <div className="col-md-9">

                                {/* Form */}
                                <div classID="theForm" className="form">

                                    <div className="copy-box">
                                        <h1>Entry page</h1>
                                        <p>Provides access to the start of the project on the various environments as they become available. It is simply a shortcut to the main TFS project but not part of the project.</p>
                                        <p>Ideal for internal use like sharing and testing, but will be used by the client too and so this stops the client needing to type into the browser location bar.</p>
                                    </div>

                                    <form onSubmit={this.launchSite.bind(this)} autoComplete="off">

                                        <label><span>1.</span> Select an environment</label>
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <select className="form-control environment" onChange={this.onChangeSelect.bind(this)}>
                                                    { this.state.environments.map(environment => {
                                                        return this.createListItem(environment)
                                                    })}
                                                </select>
                                            </div>
                                            <div className="col-sm-8">
                                                <p className="baseUrl-text">{this.state.url}</p>
                                                <input value={this.state.url} onChange={this.onChangeBaseUrl.bind(this)} name="baseUrl" className="form-control baseUrl visuallyHidden" />
                                            </div>
                                        </div>

                                        <hr />

                                        {/* List component */}
                                        <label><span>2.</span> Choose a Config ID to view on "{ this.state.envName }"</label>
                                        <List items={this.state.presetConfigIds} url={this.state.url} />

                                        <div className="bespoke-config-id">
                                            <label>Type in a Config ID to view on "{ this.state.envName }"</label>
                                            <div className="fields">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <input id="configId" onChange={this.onChangeConfigIdHandler} placeholder="e.g. 2hwH09m" name="configId" defaultValue="" className="form-control configId" autoComplete="off" />
                                                        <p className="error display-none">Please provide a config ID to progress</p>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <button name="btn-submit" className="btn btn-default btn-submit" disabled>Launch</button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </form>

                                </div>

                            </div>
                            <div className="col-md-3">

                                {/* List */}
                                <div className="list simple">
                                    <h4 className="heading">Your most recent Config IDs</h4>
                                    <ul>
                                        { this.state.localConfigIds.map(item => {
                                            return this.simpleListItem(item)
                                        })}
                                        { this.state.localConfigIds.length < 1 ? <li>This section will list previous visits in your history, it's empty right now.</li> : null }
                                    </ul>
                                </div>

                                {/* Link to clear the list */}
                                { this.state.localConfigIds.length > 0 ? <button className="form-control btn-clear" onClick={this.clearLocalConfigIds.bind(this)}>Clear History</button> : null }

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default App;
