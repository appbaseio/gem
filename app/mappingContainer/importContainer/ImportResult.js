import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../../service/DataOperation';
import { Field } from '../Field';
import { ErrorModal } from '../../others/ErrorModal';

export class ImportResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {
        title: null,
        message: null
      }
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.subfieldUpdate = this.subfieldUpdate.bind(this);
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
      mappingObj: mappingObj,
      isExists: isExists.call(this, parent, field)
    };    
    if(mappingObj.hasOwnProperty('properties')) {
      obj.resolved = false;
    } else {
      obj.resolved = true;
    }
    function isExists(parent, field) {
      let check = this.props.existingMapping && this.props.existingMapping[singleType] && this.props.existingMapping[singleType].properties.hasOwnProperty(field) ? true : false;
      console.log(field, this.props.existingMapping[singleType]);
      return check;
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
          editable = {!item.isExists}
          handleUpdate = {this.handleUpdate}
          subfieldUpdate = {this.subfieldUpdate}
          key = {index}>
        </Field>);
      });

    }
  }
  handleUpdate(key, value, listId) {
    this.fieldList = this.fieldList.map((item) => {
      if(item.id && item.id === listId) {
        if((key === 'type' || key === 'index') && item.mappingObj) {
          item.mappingObj[key] = value;
        }
        else if(key === 'fieldName') {
          item.field = value;
        }
      }
      return item;
    });
  }
  reverseMapping() {
    let finalObj = {};
    this.fieldList.forEach((parentItem, index) => {
      if(parentItem.parent === 0) {
        finalObj[parentItem.field] = this.generateObj(parentItem.id, parentItem, index);
      }
    });
    return finalObj;
  }
  generateObj(id, selfItem, index) {
    let obj = {};
    let isChildExists = this.fieldList.filter((cItem) => {
      return cItem.parent === id && !cItem.resolved1;
    });
    if(isChildExists.length) {
      obj.properties = {};
      this.fieldList.forEach((cItem, index1) => {
        if(cItem.parent === id && !cItem.resolved1) { 
          obj.properties[cItem.field] = this.generateObj(cItem.id, cItem, index1);
        }
      });
    } else {
      this.fieldList[index].resolved1 = true;
      if(selfItem.mappingObj.type) {
        obj.type = selfItem.mappingObj.type;
      }
      if(selfItem.mappingObj.index) {
        obj.index = selfItem.mappingObj.index;
      }
      if(selfItem.fields) {
        obj.fields = selfItem.fields;
      }
    }
    return obj;
    return obj;
  }
  submit() {
    let finalMapping = this.reverseMapping();
    let request = {
      properties: finalMapping
    };
    console.log(JSON.stringify(request, null, 4));
    dataOperation.updateMapping(request, this.props.selectedType[0]).done((res) => {
    }).fail((res) => {
      let error = this.state.error;
      error.title = 'Error';
      error.message = res.responseText;
      this.setState({
        error: error
      });
    });
  }
  subfieldUpdate(fieldRecord, id) {
    this.fieldList = this.fieldList.map((item) => {
      if(item.id === id) {
        item.fields = fieldRecord;
      }
      return item;
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
  render() {
    let fieldList = this.arrangeFields();
    return (
      <div className="ImportResult col-xs-12 col-sm-6 ">
        <div className="FieldContainer">
          {fieldList}
        </div>
        <div className="submit-row">
          <button onClick={() => this.submit()} className="btn btn-primary btn-submit">Submit</button>
        </div>
        <ErrorModal {...this.state.error} closeError={this.closeError} />
      </div>
    );
  }
}