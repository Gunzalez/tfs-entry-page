import React, { Component } from 'react';
import Logo from './assets/images/logo.svg';
import './App.css'
import { NavLink, Route, Switch } from 'react-router-dom';

import Form from './pages/Form/Form';
import List from './pages/List/List';
import Four04 from './pages/Four04/Four04';


class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            url: 'https://www.google.com/'
        };
    }

    render() {
        return (
            <div className="App">

                  <div className="header">
                      <div className="container">
                          <img src={Logo} alt="Toyota" />
                      </div>
                  </div>

                  <div className="navbar">
                      <div className="container">
                          <ul className="nav">
                              <li className="nav-item">
                                  <NavLink
                                      to="/form"
                                      activeClassName="active">Free form</NavLink>
                              </li>
                              <li className="nav-item">
                                  <NavLink
                                      to="/list"
                                      activeClassName="active">Predefined list</NavLink>
                              </li>
                          </ul>
                      </div>
                  </div>

                  <Switch>
                      <Route exact={true} path="/" render={ (props) => <Form {...props} url={this.state.url} /> } />
                      <Route exact={true} path="/form" render={ (props) => <Form {...props} url={this.state.url} /> } />
                      <Route exact={true} path="/list" render={ (props) => <List {...props} url={this.state.url} /> } />
                      <Route path="/*" component={Four04} />
                  </Switch>
            </div>
        );
    }
}

export default App;
