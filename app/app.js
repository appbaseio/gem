import { default as React, Component } from 'react';
var ReactDOM = require('react-dom');
import { dataOperation } from './service/DataOperation';
import { storageService } from './service/StorageService';
import { Header } from './header/Header';
import { Footer } from './footer/Footer';
import { MappingContainer } from './mappingContainer/MappingContainer';

class Main extends Component {
  constructor(props) {
      super(props);
      this.state = {
      	inputState: null,
      	mapping: null,
        connecting: false
      };
      this.getMapping = this.getMapping.bind(this);
      this.setField = this.setField.bind(this);
      this.disconnect = this.disconnect.bind(this);
  }
  componentWillMount() {
  	this.getInputState();
  }
  getInputState() {
    let localConfig = dataOperation.getLocalConfig();
    dataOperation.getInputState().then((inputState) => {
      if(localConfig.url && !inputState.url) {
        inputState = {
          url: localConfig.url,
          appname: localConfig.appname
        };
        dataOperation.updateInputState(inputState);
      }
      this.setState({
        inputState: inputState,
        appsList: localConfig.appsList
      });
    }).catch(() => {
      this.setState({
        inputState: dataOperation.inputState,
        appsList: localConfig.appsList
      });
    });
  }
  getMapping() {
    this.setState({
      connecting: true
    });
    dataOperation.updateMappingState(null);
    dataOperation.getMapping().done((mapping) => {
      this.setMappingData(mapping);
      this.setState({
        connecting: false
      });
      dataOperation.updateMappingState(mapping);
    }).fail((res) => {
      this.setState({
        connecting: false
      });
    });
  }
  setMappingData(mappingData) {
    if(mappingData && dataOperation.inputState.appname) {
      let appsList = this.setAppsList();
      let mappings = mappingData[dataOperation.inputState.appname].mappings;
      this.setState({
        mappings: mappings,
        appsList: appsList
      });
    }
  }
  setAppsList() {
    let appsList = this.state.appsList;
    let obj = {
      url: dataOperation.inputState.url,
      appname: dataOperation.inputState.appname
    };
    if(appsList.length) {
      appsList = appsList.filter(function(app) {
        return app.appname !== obj.appname;
      });
    }
    appsList.push(obj);
    storageService.set('gem-appsList', JSON.stringify(appsList));
    return appsList;
  }
  setField(mappings) {
    this.setState({
      mappings: mappings
    });
  }
  disconnect() {
    this.setState({
      mappings: null
    });
  }
  render() {
  	let appContainer, mappingMarkup;
  	if(this.state.inputState) {
  		appContainer = (<div className="container-fluid app-container">
	      <Header 
          appsList = {this.state.appsList} 
          inputState = {this.state.inputState} 
          getMapping = {this.getMapping}
          mappings = {this.state.mappings}
          disconnect = {this.disconnect} />
	      <MappingContainer setField= {this.setField} mappings = {this.state.mappings} />
	    </div>);
  	}
    return (
      <div className="appContainer">
        <section className={(this.state.connecting ? 'loading' : 'hide')}>
          <div className="is-loadingApp">
            <div className="loadingBar"></div>
          </div>
        </section>
      	<section className={(this.state.inputState ? "hide" : "loading")}>
    			<div className="is-loadingApp">
    				<div className="loadingBar"></div>
    			</div>
  		  </section>
      	{appContainer}
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('gem-container'));