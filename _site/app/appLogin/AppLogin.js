import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { AppSelect } from './AppSelect';
import { GemLink } from './GemLink';

export class AppLogin extends Component {
  constructor(props) {
    
    super(props);
    this.state = {
      inputState: null,
      hide_url_flag: false
    };
    this.setAppName = this.setAppName.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.setConfig = this.setConfig.bind(this);
  }
  componentWillMount() {
    this.init();
  }
  componentDidUpdate() {
    if((this.props.inputState && this.props.inputState.url !== '') && (this.state.inputState && this.state.inputState.url === '')) {
      this.init();
    }
  }
  init() {
    this.setState({
      inputState: this.props.inputState
    }, function() {
      if(this.state.inputState.url && this.state.inputState.appname) {
        this.connect();
      }
    }.bind(this));
  }
  changeHideUrl() {
    let hide_url_flag = !this.state.hide_url_flag;
    this.setState({
      hide_url_flag: hide_url_flag
    });
  }
  handleInput(event) {
    let inputState = this.state.inputState;
    inputState.url = event.target.value;
    this.setState({
      inputState: inputState
    }, this.updateInputState.bind(this));
  }
  setAppName(val) {
    let inputState = this.state.inputState;
    inputState.appname = val;
    this.setState({
      inputState: inputState
    }, this.updateInputState.bind(this));
  }
  setConfig(inputState) {
    this.setState({
      inputState: inputState
    });
    dataOperation.updateInputState(inputState);
  }
  updateInputState() {
    dataOperation.updateInputState(this.state.inputState);
  }
  connect() {
    if(!this.props.mappings) {
      this.props.getMapping();
    } else {
      this.props.disconnect();
    }
  }
  readOnly() {
    let opts = {};
    if(this.props.mappings) {
      opts.readOnly = 'readOnly';
    }
    return opts;
  }
  allowConnect() {
    let opts = {};
    if(!(this.state.inputState.url && this.state.inputState.appname && this.state.inputState.appname.trim() !== '' && this.state.inputState.url.trim() !== '')) {
      opts.disabled = true;      
    }
    return opts;
  }
  render() {
    return (<div className="app-login-container">
    <form className="col-xs-12 init-ES" id="init-ES">
      <div className="esContainer">
        <span className="action-btns hidden-xs">
          <GemLink />
        </span>
        <div className="form-group m-0 col-xs-4 pd-0 pr-5">
          <AppSelect 
            setConfig={this.setConfig}
            appsList={this.props.appsList} 
            appname={this.props.inputState.appname} 
            setAppName={this.setAppName} 
            {...this.readOnly()}/>
        </div>
        <div className="form-group m-0 col-xs-8 pr-5">
          <div className="url-container form-element header-element">
            <input 
              required
              type="text" 
              value={this.state.inputState.url} 
              onChange={this.handleInput} 
              className="form-control" 
              name="url" 
              placeholder="ElasticSearch Cluster URL: https://username:password@scalr.api.appbase.io"
              {...this.readOnly()}
            /> 
            <span className="hide-url" className={"hide-url "+(this.state.hide_url_flag ? 'expand' : 'collapse')}>
              <a className="btn btn-default"  onClick={() => this.changeHideUrl()}>
                <span className={"fa fa-eye "+(this.state.hide_url_flag ? 'hide' : '')}></span> 
                <span className={"fa fa-eye-slash "+(!this.state.hide_url_flag ? 'hide' : '')}></span> 
              </a>
            </span>  
          </div>
        </div>
        <div className="submit-btn-container">
          <a {...this.allowConnect()} onClick={()=> this.connect()} className="btn btn-default submit-btn"> 
            <span className= {(this.props.mappings ? 'hide' : '')}>
              <i className="fa fa-play"></i>&nbsp;
              Connect
            </span> 
            <span className= {(this.props.mappings ? '' : 'hide')}>
              <i className="fa fa-pause"></i>&nbsp;
              Disconnect
            </span> 
          </a>
        </div>
      </div>
    </form>    
  </div>);
  }

}

AppLogin.propTypes = {  
};
// Default props value
AppLogin.defaultProps = {
};