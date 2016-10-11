import {
  default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';

export class AppSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectVal: null,
      apps: null,
      searchValue: '',
      setAppClass: 'hide'
    };
    this.handleInput = this.handleInput.bind(this);
  }
  componentDidMount() {
    if(!this.state.searchValue) {
      this.setState({
        searchValue: this.props.appname
      });
    }
  }
  handleInput(event) {
    this.setState({
      searchValue: event.target.value
    });
    if (this.props.setAppName) {
      this.props.setAppName(event.target.value);
    }
  }
  focusInput() {
    // if (this.props.appsList.length && !this.props.connect) {
    //   this.setState({
    //     setAppClass: 'show'
    //   });
    // }
  }
  blurInput() {
    // setTimeout(function() {
    //   this.setState({
    //     setAppClass: 'hide'
    //   });
    // }.bind(this), 300);
  }
  selectOption(appname) {
    this.setState({
      searchValue: appname
    });
    var app_config = this.props.appsList.filter(function(app, index) {
      if (app.appname === appname) {
        return {
          appname: app.appname,
          url: app.url
        };
      }
    });
    if (app_config.length && app_config[0].url) {
      this.props.setConfig(app_config[0].url);
    }
  }
  render() {
    var opts = {};
    var optionsArr = [];
    if (this.props.connect) {
      opts['readOnly'] = 'readOnly';
    }
    if (this.props.appsList && this.props.appsList.length) {
      optionsArr = this.props.appsList.filter(function(app, index) {
        return this.state.searchValue === '' || (this.state.searchValue !== '' && app.appname.toUpperCase().indexOf(this.state.searchValue.toUpperCase()) !== -1)
      }.bind(this));
    }

    var options = optionsArr.map(function(app, index) {
        return (<li key = { index } onClick = { this.selectOption.bind(this, app.appname) }> { app.appname } </li>);
        }.bind(this));

      var searchValue = this.state.searchValue;
      var setAppClass = options.length == 0 ? 'hide' : 'autolist setApp col-xs-12 ' + this.state.setAppClass;
      return ( <div className="autocomplete form-element header-element">
          <input className = "search form-control"
          type = "text"
          value = { searchValue }
          name = "appname"
          placeholder = "Appname (aka index) goes here"
          onChange = {this.handleInput}
          onFocus = { this.focusInput }
          onBlur = { this.blurInput } {...opts }
          /> 
          <ul id = "setApp"
          className = { setAppClass }
          name = "apps" > 
            { options } 
          </ul> 
        </div >
      );
    }
  }
