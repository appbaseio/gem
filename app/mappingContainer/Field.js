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
      properties: {}
    };
    this.defaultRow = {
      name: 'sample',
      type: 'string',
      index: 'not_analyzed'
    };
    this.setModifiedField = this.setModifiedField.bind(this);
  }
  componentWillMount() {
    if(this.props.mappings[this.props.singleType].properties) {
      this.setState({
        properties: this.props.mappings[this.props.singleType].properties
      });
    }
  }
  setModifiedField(oldfieldName, newfield) {
    let modifiedField = this.state.modifiedField;
    let properties = this.state.properties;
    let fields = properties[this.props.field].fields;
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
    properties[this.props.field].fields = fields;
    modifiedField.push(newfield);
    this.setState({
      modifiedField: modifiedField,
      properties: properties,
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
      properties: this.state.properties
    };
    dataOperation.updateMapping(request, this.props.singleType).then((res) => {
      alert(JSON.stringify(res));
    });
  }
  render() {
    let properties = this.state.properties;
    let fields = properties[this.props.field].fields;
    let submit;
    if(this.state.modifiedField.length) {
      submit = (<a className="btn btn-success pull-right" onClick={() => this.submit() }>Submit</a>);
    }
    return (<div className="singleProperty col-xs-12">
      <h3 className='title row'>
        <span>
          {this.props.field} ({this.props.singleType})
        </span>
        <span className={'datatype '+ (!properties[this.props.field].type ? ' hide ' : '')}>
          {properties[this.props.field].type}
        </span>
        <a className="btn btn-primary pull-right" onClick={() => this.addField() }>Add Field</a>
        {submit}
      </h3>
      <div className="fieldContent row">
        {this.addRows()}
        {this.fieldContent(fields)}
      </div>
    </div>);
  }
}