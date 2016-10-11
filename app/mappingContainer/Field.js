import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { SingleField } from './SingleField';

export class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      modifiedField: [],
      fieldRecord: {}
    };
    this.defaultRow = {
      name: 'sample',
      type: 'string',
      index: 'not_analyzed'
    };
    this.setModifiedField = this.setModifiedField.bind(this);
  }
  componentWillMount() {
    if(this.props.fieldRecord) {
      this.setState({
        fieldRecord: this.props.fieldRecord
      });
    }
  }
  setModifiedField(oldfieldName, newfield) {
    let modifiedField = this.state.modifiedField;
    let fieldRecord = this.state.fieldRecord;
    let fields = fieldRecord.fields;
    let rows = this.state.rows;
    rows = rows.filter((row) => {
      row.fieldName !== oldfieldName
    });
    if(fields) {
      delete fields[oldfieldName];
    } else {
      fields = {};
    }
    fields[newfield.fieldName] = {
      type: newfield.type,
      index: newfield.index,
    };
    fieldRecord.fields = fields;
    modifiedField.push(newfield);
    this.setState({
      modifiedField: modifiedField,
      fieldRecord: fieldRecord,
      rows: rows
    });
  }
  addField(field, type) {
    let rows = this.state.rows;
    let defaultRow = JSON.parse(JSON.stringify(this.defaultRow));
    rows.push(defaultRow); 
    this.setState({
      rows: rows
    });
  }
  fieldContent(fields) {
    let generateFields = [];
    let index = 0;
    for(let singleField in fields) {
      index++;
      let fieldMarkup = (<SingleField 
        fieldInfo={fields[singleField]} 
        fieldName={singleField}
        field={this.props.field}
        singleType={this.props.singleType} 
        setModifiedField = {this.setModifiedField}
        key={index} ></SingleField>);
      generateFields.push(fieldMarkup);
    }
    return generateFields;
  }
  addRows() {
    let generateFields = [];
    let index = 0;
    let existingRows = this.state.rows;
    generateFields = existingRows.map((field, index) => {
      return (<SingleField 
        fieldInfo={{
          type: field.type,
          index: field.index
        }} 
        fieldName={field.name} 
        defaultEdit={true}
        field={field}
        singleType={this.props.singleType}
        setModifiedField = {this.setModifiedField}
        key={index} ></SingleField>);
    });
    return generateFields;
  }
  submit() {
    let request = {
      properties: {
        [this.props.field]: this.state.fieldRecord
      }
    };
    dataOperation.updateMapping(request, this.props.singleType).then((res) => {
      alert(JSON.stringify(res));
    });
  }
  multipleField() {
    let fieldList = this.props.fieldList.filter((item, index) => this.props.id === item.parent);
    return fieldList.map((item, index) => {
      return (<Field 
        mappings = {this.props.mappings}
        fieldRecord = {item.mappingObj}
        field = {item.field}
        singleType = {item.singleType}
        className="singleProperty col-xs-12" 
        fieldList = {this.props.fieldList}
        id = {item.id}
        parent = {item.parent}
        key = {index} >
      </Field>);
    })
  }
  render() {
    let fieldRecord = this.state.fieldRecord;
    let fields = fieldRecord.fields;
    let submit, addRow;
    if(this.state.modifiedField.length) {
      submit = (<a className="btn btn-success pull-right" onClick={() => this.submit() }>Submit</a>);
    }
    if(fieldRecord.type) {
      addRow = (<a className="btn btn-primary pull-right" onClick={() => this.addField() }>Add Field</a>);
    }
    return (<div className="singleProperty col-xs-12">
      <h3 className='title row'>
        <span>
          {this.props.field} ({this.props.singleType})
        </span>
        <span className={'datatype '+ (!fieldRecord.type ? ' hide ' : '')}>
          {fieldRecord.type}
        </span>
        {addRow}
        {submit}
      </h3>
      <div className="fieldContent row">
        {this.addRows()}
        {this.fieldContent(fields)}
        <div className="col-xs-12 nestedField">
          {this.multipleField()}
        </div>
      </div>
    </div>);
  }
}