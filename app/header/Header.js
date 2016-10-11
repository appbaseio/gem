import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { AppSelect } from './AppSelect';


export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputState: null,
      hide_url_flag: false
    };
    this.setAppName = this.setAppName.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }
  componentWillMount() {
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
  updateInputState() {
    dataOperation.updateInputState(this.state.inputState);
  }
  connect() {
    dataOperation.getMapping().then((mapping) => {
      this.props.getMapping(mapping);
    });
  }
  render() {
    return (<div className="header-container">
    <header className="header text-center">
      <span className="header-container">
        <span className="img-container">
          <img src="assets/images/Mirage_Flat_9.png" alt="Mirage" className="img-responsive" />
        </span>
        <span className="tag-line">
          Elasticsearch mapping tool
        </span>
      </span>
    </header>
    <form className="col-xs-12 init-ES" id="init-ES">
      <div className="esContainer">
        <span className="action-btns">
          <a className="link btn btn-default">
            Data View <i className="fa fa-external-link-square"></i>
          </a>
        </span>
        <div className="form-group m-0 col-xs-4 pd-0 pr-5">
          <AppSelect 
            appsList={this.props.appsList} 
            appname={this.props.inputState.appname} 
            setAppName={this.setAppName} />
        </div>
        <div className="form-group m-0 col-xs-8 pr-5">
          <div className="url-container form-element header-element">
            <input type="text" value={this.state.inputState.url} onChange={this.handleInput} required className="form-control" name="url" placeholder="ElasticSearch Cluster URL: https://username:password@scalr.api.appbase.io" /> 
            <span className="hide-url" className={"hide-url "+(this.state.hide_url_flag ? 'expand' : 'collapse')}>
              <a className="btn btn-default"  onClick={() => this.changeHideUrl()}>
                <span className={"fa fa-eye "+(this.state.hide_url_flag ? 'hide' : '')}></span> 
                <span className={"fa fa-eye-slash "+(!this.state.hide_url_flag ? 'hide' : '')}></span> 
              </a>
            </span>  
          </div>
        </div>
        <div className="submit-btn-container">
          <a onClick={()=> this.connect()} className="btn btn-default submit-btn"> 
            <span>
              <i className="fa fa-play"></i>
              Connect
            </span> 
          </a>
        </div>
      </div>
    </form>    
  </div>);
  }

}

Header.propTypes = {  
};
// Default props value
Header.defaultProps = {
};