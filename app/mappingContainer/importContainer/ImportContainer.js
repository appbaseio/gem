import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../../service/DataOperation';
import { ErrorModal } from '../../others/ErrorModal';
import { JsonImport } from './JsonImport';
import { ImportResult } from './ImportResult'

export class ImportContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      finalMapping: {},
      selectedType: null
    };
    this.detectMapping = this.detectMapping.bind(this);
  }
  detectMapping(jsonInput, selectedType, importType='data') {
    let finalMapping;
    if(importType === 'data' ) {
      let properties = this.generateMappingStructure(jsonInput);
      finalMapping = {
        [selectedType]: {
          properties: properties
        }
      };
    } else {
      finalMapping = {
        [selectedType]: jsonInput
      };
    }
    this.setState({
      selectedType: selectedType,
      finalMapping: finalMapping
    });
  }
  generateMappingStructure(jsonInput) {
    let finalMapping = {};
    for(let property in jsonInput) {
      let type = this.identifyDataType(jsonInput[property]);
      if(type !== 'object') {
        finalMapping[property] = {
          type: type
        }
      } else {
        finalMapping[property] = {
          properties: {}
        };
        finalMapping[property].properties = this.generateMappingStructure(jsonInput[property]);
      }
    }
    return finalMapping;
  }
  identifyDataType(val) {
    let type = typeof val;
    switch(type) {
      case 'object':
      case 'string':
        type = isGeopoint(val, type);
      break;
      case 'number':
        type = numberCategory(val, type);
      break;
    }
    return type;

    function isGeopoint(val, type) {
      if(type === 'object') {
        if(val && (val.hasOwnProperty('lat') && val.hasOwnProperty('lon')) || (val.hasOwnProperty('top_left') && val.hasOwnProperty('bottom_right')) || (val.constructor === Array && val.length === 2)) {
          type = 'geo_point';
        }
      }
      else if(type === 'string') {
        
      }
      return type;
    }

    function numberCategory(val, type) {
      if(val) {
        if(Number(val) === val && val % 1 === 0) {
          type = 'integer';
        } else if(Number(val) === val && val % 1 !== 0) {
          type = 'float';
        }
      }
      return type;
    }
  }
  render() {
    return (<div className="row" id="ImportContainer">
      <JsonImport 
        mappings={this.props.mappings} 
        detectMapping={this.detectMapping} />
      <ImportResult 
        selectedType={this.state.selectedType} 
        mappings={this.state.finalMapping} 
        existingMapping={this.props.mappings}
        getMapping={this.props.getMapping}
        close={this.props.close}
        />
    </div>);
  }
}