import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { Types } from './Types';
import { Fields } from './Fields';
import { AddField } from './AddField';

export class MappingContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: []
    };
    this.typeSelection = this.typeSelection.bind(this);
    this.submitField = this.submitField.bind(this);
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
      alert(JSON.stringify(res));
      this.props.setField(mappings);
    }).fail((res) => {
      alert(res.responseText)
    });
  }
  render() {
    let returnMarkup = null;
    if(this.props.mappings) {
      let types = Object.keys(this.props.mappings);
      returnMarkup = (<div className="mappingWrapper">
          <Types mappings={this.props.mappings}
            setField={this.props.setField}
            typeSelection={this.typeSelection} />
          <Fields 
            setField={this.props.setField}
            mappings={this.props.mappings} 
            selectedType={this.state.selectedType} />
          <AddField 
            types={types}
            submitField={this.submitField} />
        </div>);
    }
    return (<div className="mappingContainer">
      {returnMarkup}
    </div>);
  }
}