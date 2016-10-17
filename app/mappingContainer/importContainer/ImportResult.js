import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../../service/DataOperation';
import { Field } from '../Field';

export class ImportResult extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    
  }
  arrangeFields() {
    this.fieldList = [];
    if(this.props.selectedType && this.props.selectedType.length && this.props.mappings) {
      let index = 0;
      for(let singleType in this.props.mappings) {
        if(this.props.selectedType.indexOf(singleType) > -1) {
          let fields = this.props.mappings[singleType].properties;
          for(let field in fields) {
            index++;
            let mappingObj = fields[field];
            let obj = this.isNested(index, 0, mappingObj, field, singleType);
            this.fieldList.push(obj); 
          }
        }
      }
      return this.resolveList();
    }
  }
  isNested(index, parent, mappingObj, field, singleType) {
    let obj = {
      parent: parent,
      id:  index,
      field: field,
      singleType: singleType,
      mappingObj: mappingObj
    };    
    if(mappingObj.hasOwnProperty('properties')) {
      obj.resolved = false;
    } else {
      obj.resolved = true;
    }
    return obj;
  }
  resolveList() {
    let list = this.fieldList.filter((item) => !item.resolved);
    if(list.length) {
      let index = this.fieldList.length;
      list.forEach((item) => {
        this.fieldList[item.id-1].resolved = true;
        for(let field in item.mappingObj.properties) {
          index++;
          let mappingObj = item.mappingObj.properties[field];
          let obj = this.isNested(index, item.id, mappingObj, field, item.singleType);
          this.fieldList.push(obj); 
        }
      });
      return this.resolveList();
    } else {
      let fieldList = this.fieldList.filter((item, index) => item.parent === 0);
      return fieldList.map((item, index) => {
        return (<Field 
          mappings = {this.props.mappings}
          fieldRecord = {item.mappingObj}
          field = {item.field}
          singleType = {item.singleType}
          className="singleProperty col-xs-12" 
          fieldList = {this.fieldList}
          id = {item.id}
          parent = {item.parent}
          editable = {true}
          key = {index}>
        </Field>);
      });

    }
  }
  render() {
    let fieldList = this.arrangeFields();
    return (
      <div className="FieldContainer">
        {fieldList}
      </div>
    );
  }
}