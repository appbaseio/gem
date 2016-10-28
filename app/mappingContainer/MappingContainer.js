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
    this.changeView = this.changeView.bind(this);
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
  changeView() {
    let view = this.state.view === 'default' ? 'mapping' : 'default';
    this.setState({
      view: view
    });
  }
  viewFor() {
    let markup = null;
    let method = this.state.view;
    switch(method) {
      case 'default':
        if(this.props.mappings) {
          markup = (
            <div className="mappingWrapper">
              <Types 
                key = {0}
                mappings={this.props.mappings}
                setField={this.props.setField}
                typeSelection={this.typeSelection}>
              </Types>      
              <Fields 
                key = {1}
                setField={this.props.setField}
                mappings={this.props.mappings} 
                selectedType={this.state.selectedType} >
              </Fields>
            </div>
          );
        }
      break;
      case 'mapping':
          markup = (
            <div className="mappingWrapper">
              <ImportModal 
                key={1}
                selectedType={this.state.selectedType}
                mappings={this.props.mappings} 
                getMapping={this.props.getMapping}
                changeView = {this.changeView}
                >
              </ImportModal>
            </div>
          );
      break;
    }
    return markup;
  }
  changeViewBtn() {
    let markup = null;
    if(this.props.mappings) {
      let changeViewText = (<span><i className="fa fa-plus"></i> Create New Mappings</span>);
      if(this.state.view !== 'default') {
        changeViewText = (<span><i className="fa fa-table"></i> View Current Mappings</span>);
      }
      markup = (
        <button type="button" className={"btn btn-operational "+(this.state.view === 'default' ? 'btn-yellow' : 'btn-primary')} onClick={() => this.changeView()}>
          {changeViewText}
        </button> 
      );
    }
    return markup;
  }
  render() {
    let view;
    return (
      <div className={"mappingContainer " + this.state.view+"View"}>
      {this.viewFor()}
      {this.changeViewBtn()}
      {
      // <span className="importBtn">
      //   <div className="btn-group">
      //     <button type="button" className="btn btn-yellow">
      //       {importModal}
      //     </button>
      //     <button type="button" className="btn btn-yellow dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      //       <span className="caret"></span>
      //     </button>
      //     <ul className="dropdown-menu">
      //       <li>
      //         {importSettings}
      //       </li>
      //     </ul>
      //   </div>
      // </span>
    }
      <ErrorModal {...this.state.error} closeError={this.closeError} />
    </div>
    );
  }
}