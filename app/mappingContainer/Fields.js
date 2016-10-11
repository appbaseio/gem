import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { Field } from './Field';

export class Fields extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    
  }
  generateFieldList() {
    let fieldList = [];
    if(this.props.selectedType && this.props.mappings) {
      let index = 0;
      for(let singleType in this.props.mappings) {
        if(this.props.selectedType.indexOf(singleType) > -1) {
          let fields = this.props.mappings[singleType].properties;
          for(let field in fields) {
            index++;
            let markup = (<Field 
              mappings = {this.props.mappings}
              field = {field}
              singleType = {singleType}
              className="singleProperty col-xs-12" key = {index}></Field>);
            fieldList.push(markup);
          }
        }
      }  
    }
    return fieldList;
  }
  render() {
    let fieldList = this.generateFieldList();
    return (
      <div className="FieldContainer">
        {fieldList}
      </div>
    );
  }
}