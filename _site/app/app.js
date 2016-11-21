import { default as React, Component } from 'react';
var ReactDOM = require('react-dom');
import { dataOperation } from './service/DataOperation';
import { storageService } from './service/StorageService';
import { Header } from './header/Header';
import { Footer } from './footer/Footer';
import { MappingContainer } from './mappingContainer/MappingContainer';
import { AppLogin } from './appLogin/AppLogin';
import { config } from './config';

class Main extends Component {
  constructor(props) {
      super(props);
      this.state = {
        inputState: null,
        mapping: null,
        connecting: false,
        queryParams: null
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
      if(dataOperation.queryParams.hasOwnProperty('hf')) {
        this.getMapping();
      }
      this.setState({
        inputState: inputState,
        appsList: localConfig.appsList,
        queryParams: dataOperation.queryParams
      }, this.getIndices.bind(this));
    }).catch(() => {
      this.setState({
        inputState: dataOperation.inputState,
        appsList: localConfig.appsList
      }, this.getIndices.bind(this));
    });
  }
  getIndices() {
    if(config.BRANCH === 'master') {
      let es_host = document.URL.split('/_plugin/')[0];
      dataOperation.getIndices(es_host).done((res) => {
        this.getIndicesCb(es_host, res);
      }).fail((res) => {
      });
    }
  }
  getIndicesCb(es_host, data) {
    var indices = [];
    var historicApps = this.state.appsList;
    for (let indice in data.indices) {
      if (historicApps && historicApps.length) {
        historicApps.forEach(function(old_app, index) {
          if (old_app.appname === indice) {
            historicApps.splice(index, 1);
          }
        })
      }
      var obj = {
        appname: indice,
        url: es_host
      };
      indices.push(indice);
      historicApps.push(obj);
    }
    // if no app found
    if(!historicApps.length) {
      var obj = {
        appname: 'sampleapp',
        url: es_host
      };
      historicApps.push(obj);
    }
    let updateState = {
      appsList: historicApps
    };
    if(dataOperation.inputState.url == '') {
      let inputState = JSON.parse(JSON.stringify(dataOperation.inputState));
      inputState.url = es_host;
      dataOperation.updateInputState(inputState)
      updateState.inputState = inputState;
    }
    this.setState(updateState);
    storageService.set('gem-appsList', JSON.stringify(historicApps)); 
  }
  getMapping() {
    this.setState({
      connecting: true
    });
    dataOperation.updateMappingState(null);
    dataOperation.getSettings().done((settings) => {
      dataOperation.updateSettingState(settings);  
      getVersion.call(this);
    }).fail((res) => {
      getMapping.call(this);
    });
    function getMapping() {
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
    function getVersion() {
      dataOperation.getVersion().done((data) => {
          let inputState = dataOperation.inputState;
          if(data && data.version && data.version.number) {
            inputState.version = data.version.number;
            dataOperation.updateInputState(inputState);
          }
          getMapping.call(this);
        }).fail((res) => {
      });
    }
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
    dataOperation.updateMappingState(null);
  }
  includePart(part) {
    let res;
    if(!(dataOperation.queryParams && dataOperation.queryParams.hasOwnProperty('hf'))) {
      switch(part) {
        case 'header':
          res = (<Header queryParams={this.state.queryParams}></Header>);
        break;
        case 'footer':
          res = (<Footer></Footer>);
        break;
        case 'appLogin': 
          res = (
            <AppLogin 
              appsList = {this.state.appsList} 
              inputState = {this.state.inputState} 
              getMapping = {this.getMapping}
              mappings = {this.state.mappings}
              disconnect = {this.disconnect} >
            </AppLogin>
            );
        break;
      }
    }
    return res;
  }
  render() {
    let appContainer, mappingMarkup;
    if(this.state.inputState) {
      appContainer = (
        <div className="container-fluid app-container">
          {this.includePart('header')}
          <div className="app-with-sidebar-container container-fluid">
            <div className="app-main-container">
              {this.includePart('appLogin')}
              <MappingContainer 
                setField= {this.setField} 
                mappings = {this.state.mappings} 
                getMapping = {this.getMapping}/>
            </div>
          </div>
       </div>
      );
    }
    return (
      <div className={"appContainer "+ (dataOperation.queryParams && dataOperation.queryParams.hasOwnProperty('hf') ? 'without-hf' : '')}>
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
        {this.includePart('footer')}
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('gem-container'));