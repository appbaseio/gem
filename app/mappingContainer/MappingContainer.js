import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { Types } from './Types';
import { Fields } from './Fields';
import { AddField } from './AddField';
import { ErrorModal } from '../others/ErrorModal';
import { ImportContainer } from './importContainer/ImportContainer';

export class MappingContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: [],
      error: {
        title: null,
        message: null
      },
      view: 'default'
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
  selectedView() {
    let types = Object.keys(this.props.mappings);
    if(this.state.view === 'default') {
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
      let addFieldBtn = (<AddField 
          key={2}
          types={types}
          submitField={this.submitField} ></AddField>);
      let importBtn = (<button 
          key={3}
          className="btn btn-primary import-btn"
          onClick={() => this.changeView('import')}
           >Import json</button>);
      return [typesComponent, fields, addFieldBtn, importBtn];
    } else if(this.state.view === 'import') {
      let importContainer = (
       <ImportContainer 
          key={1}
          selectedType={this.state.selectedType}
          mappings={this.props.mappings} 
          ></ImportContainer>
      );
      let backBtn = (<button 
          key={2}
          className="btn btn-primary back-btn"
          onClick={() => this.changeView('default')}
           >Back</button>);
      return [importContainer, backBtn];
    }
  }
  render() {
    let returnMarkup = null;
    if(this.props.mappings) {
      returnMarkup = (<div className="mappingWrapper">
          {this.selectedView()}
        </div>);
    }
    return (<div className={"mappingContainer " + this.state.view+"View"}>
      {returnMarkup}
      <ErrorModal {...this.state.error} closeError={this.closeError} />
    </div>);
  }
}