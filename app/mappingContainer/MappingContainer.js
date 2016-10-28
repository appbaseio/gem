import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { Types } from './Types';
import { Fields } from './Fields';
import { AddField } from './AddField';
import { ErrorModal } from '../others/ErrorModal';
import { ImportModal } from './importContainer';
import { ImportSettings } from './importSettings/';

export class MappingContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: [],
      error: {
        title: null,
        message: null
      },
      view: 'default',
      key: 1
    };
    this.typeSelection = this.typeSelection.bind(this);
    this.submitField = this.submitField.bind(this);
    this.closeError = this.closeError.bind(this);
  }
  componentWillMount() {

  }
  typeSelection(selectedType) {
    let inputState = dataOperation.inputState;
    inputState.selectedType = selectedType;
    dataOperation.updateInputState(inputState);
    this.setState({
      selectedType: selectedType
    });
  }
  submitField(formObj) {
    let mappings = this.props.mappings;
    let fieldObj =  {
      type: formObj.datatype,
      index: formObj.index
    };
    if(mappings[formObj.type].hasOwnProperty('properties')) {
      mappings[formObj.type].properties[formObj.name] = fieldObj;
    } else {
      mappings[formObj.type].properties = {
        [formObj.name]: fieldObj
      };
    }
    let request = {
      properties: mappings[formObj.type].properties
    };
    dataOperation.updateMapping(request, formObj.type).done((res) => {
      this.props.setField(mappings);
    }).fail((res) => {
      let error = this.state.error;
      error.title = 'Error';
      error.message = res.responseText;
      this.setState({
        error: error
      });
    });
  }
  closeError() {
    let error = this.state.error;
    error.title = null;
    error.message = null;
    this.setState({
      error: error
    });
  }
  changeView(view) {
    if(view === 'default') {
      this.props.getMapping();
    }
    this.setState({
      view: view
    });
  }
  selectedView(method) {
    let types = Object.keys(this.props.mappings);
    if(this.state.key === 1 && method === 'default') {
      let typesComponent = (
        <Types 
          key = {0}
          mappings={this.props.mappings}
          setField={this.props.setField}
          typeSelection={this.typeSelection}>
        </Types>    
      );
      let fields = (
        <Fields 
          key = {1}
          setField={this.props.setField}
          mappings={this.props.mappings} 
          selectedType={this.state.selectedType} ></Fields>
      );
      return [typesComponent, fields];
    }  else {
      return null;
    }
  }
  viewFor(method) {
    let markup = null;
    if(this.props.mappings) {
      markup = (<div className="mappingWrapper">
          {this.selectedView(method)}
        </div>);
    }
    return markup;
  }
  render() {
    let view, importModal, importSettings;
    if(this.props.mappings) {
      view = this.viewFor('default');
      importModal = (
        <ImportModal 
        key={1}
        selectedType={this.state.selectedType}
        mappings={this.props.mappings} 
        getMapping={this.props.getMapping}
        ></ImportModal>
      );
      importSettings = (
        <ImportSettings 
        key={2}
        selectedType={this.state.selectedType}
        mappings={this.props.mappings} 
        getMapping={this.props.getMapping}
        ></ImportSettings>
      );
    }
    return (
      <div className={"mappingContainer " + this.state.view+"View"}>
      {view}
      <span className="importBtn">
        <div className="btn-group">
          <button type="button" className="btn btn-yellow">
            {importModal}
          </button>
          <button type="button" className="btn btn-yellow dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu">
            <li>
              {importSettings}
            </li>
          </ul>
        </div>
      </span>
      <ErrorModal {...this.state.error} closeError={this.closeError} />
    </div>
    );
  }
}