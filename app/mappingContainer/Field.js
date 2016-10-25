import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import Highlight from 'react-highlight';
import { dataOperation } from '../service/DataOperation';
import { SingleField } from './SingleField';
import { Editable } from './Editable';
import { ErrorModal } from '../others/ErrorModal';
import { SingleOption } from './SingleOption';


export class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      options: [],
      modifiedField: [],
      fieldRecord: {},
      error: {
        title: null,
        message: null
      }
    };
    this.defaultRow = {
      name: 'sample',
      type: 'string',
      index: 'not_analyzed'
    };
    this.defaultOption = {
      key: '',
      value: ''
    };
    this.excludeProperties = ['type', 'properties', 'index', 'fields'];
    this.setModifiedField = this.setModifiedField.bind(this);
    this.removeField = this.removeField.bind(this);
    this.closeError = this.closeError.bind(this);
    this.editCb = this.editCb.bind(this);
    this.optionEdit = this.optionEdit.bind(this);
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
    }, this.submit.call(this));
  }
  addField(field, type) {
    let rows = this.state.rows;
    let defaultRow = JSON.parse(JSON.stringify(this.defaultRow));
    rows.push(defaultRow); 
    this.setState({
      rows: rows
    });
  }
  addOptions() {
    let options = this.state.options;
    let defaultOption = JSON.parse(JSON.stringify(this.defaultOption));
    options.push(defaultOption); 
    this.setState(options); 
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
        removeField = {this.removeField}
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
        removeField = {this.removeField}
        key={index} ></SingleField>);
    });
    return generateFields;
  }
  removeField() {
    this.setState({
      rows: []
    });
  }
  submit() {
    let request = {
      properties: {
        [this.props.field]: this.state.fieldRecord
      }
    };
    if(!this.props.editable) {
      dataOperation.updateMapping(request, this.props.singleType).done((res) => {
      }).fail((res) => {
        let error = this.state.error;
        error.title = 'Error';
        error.message = res.responseText;
        this.setState({
          error: error
        });
      });
    } else {
      if(this.props.subfieldUpdate) {
        this.props.subfieldUpdate(this.state.fieldRecord.fields, this.props.id);
      }
    }
  }
  closeError() {
    let error = this.state.error;
    error.title = null;
    error.message = null;
    this.setState({
      error: error
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
        editable = {this.props.editable}
        subfieldUpdate = {this.props.subfieldUpdate}
        key = {index} >
      </Field>);
    })
  }
  editCb(key, value) {
    let fieldRecord = this.state.fieldRecord;
    if((key === 'type' || key === 'index') && fieldRecord) {
      fieldRecord[key] = value;
      this.setState({
        fieldRecord: fieldRecord
      });
    }
    if(this.props.handleUpdate) {
      this.props.handleUpdate(key, value, this.props.id);
    }
  }
  optionEdit(index, value, deleteFlag=false) {
    let options = this.state.options;
    if(deleteFlag) {
      options.splice(index, 1);
    } else {
      options[index] = value;
    }
    this.setState(options);
    if(this.props.handleUpdate) {
      this.props.handleUpdate('options', options, this.props.id);
    }
  }
  additionalOptions() {
    let additionalOptionsContainer, additionalOptions = [];
    let fieldRecord = this.state.fieldRecord;
    let fieldName = this.props.field;
    if(this.props.editable && this.state.options.length) {
      additionalOptions = this.state.options.map((option, index) => {
        return (<SingleOption defaultEdit={true} optionEdit={this.optionEdit} key={index} index={index} option={option} />)
      }); 
    }
    if(additionalOptions.length) {
      additionalOptionsContainer = (<div className="fieldAdditionalRow-container">
        {additionalOptions}
      </div>);
    }
    return additionalOptionsContainer;
  }
  setJsonPopover() {
    let fieldRecord = this.state.fieldRecord;
    let fieldRecordStringify = JSON.stringify(fieldRecord, null, 4);
    const jsonPopover = (
      <Popover id="jsonPopover" className='jsonPopover' title="Json">
        <Highlight className="json">{fieldRecordStringify}</Highlight>
      </Popover>
    );
    const jsonOverlay = (
      <OverlayTrigger trigger={['hover', 'focus']} placement="left" overlay={jsonPopover}>
        <button className="jsonPopoverBtn"></button>
      </OverlayTrigger>
    );
    return jsonOverlay;
  }
  setFieldRow() {
    let fieldRecord = this.state.fieldRecord;
    let fieldName = this.props.field;
    let singleType = this.props.parent === 0 ? (<span className="typeName">{this.props.singleType+' / '} </span>): '';
    let addRow, addOptions;
    if(fieldRecord.type && !this.state.rows.length) {
      addRow = (<a className="btn btn-xs btn-primary pull-right edit-btn" onClick={() => this.addField()} >
        <i className="fa fa-pencil"></i> 
      </a>);
    }
    if(fieldRecord.type && !this.state.rows.length) {
      addOptions = (<a className="btn btn-xs btn-primary pull-right add-option-btn" onClick={() => this.addOptions()} >
        <i className="fa fa-plus"></i> 
      </a>);
    }
    
    let finalField = (
      <div className="field-row">
        <h3 className='title row'>       
          {this.setJsonPopover()}
          <span>{singleType} {fieldName}</span>
          <span className={'datatype '+ (!fieldRecord.type ? ' hide ' : '')}>
            {fieldRecord.type}
          </span>
          {addRow}
        </h3>
        {this.additionalOptions()}
      </div>
    );
    if(this.props.editable) {
      let editableType, editableIndex;
      if(fieldRecord.type) {
        editableType = (<span className="col-xs-12 col-sm-4 fieldDataType">
          <Editable
            editKey='type'
            editCb={this.editCb}
            editValue={fieldRecord.type} 
            defaultEdit={true} />
        </span>);
        if(fieldRecord.type === 'string') {
        editableIndex =(<span className="fieldIndex col-xs-12 col-sm-4">
            <Editable 
              editKey='index'
              editCb={this.editCb}
              editValue={fieldRecord.index} 
              defaultEdit={true} />
          </span>);
        }
      }
      finalField = (
        <div className="field-row">
          <h3 className='title row'>
            <span className="fieldName col-xs-12 col-sm-4">
              <Editable 
                editKey='fieldName'
                editCb={this.editCb}
                editValue={fieldName} 
                defaultEdit={true} >
              </Editable>
            </span>
            {editableType}
            {editableIndex}
            {addOptions}
            {addRow}
          </h3>
          <div>
            {this.additionalOptions()}
          </div>
        </div>
      );
    }
    return finalField;
  }
  render() {
    let fieldRecord = this.state.fieldRecord;
    let fields = fieldRecord.fields;  
    return (<div className="singleProperty col-xs-12">
      {this.setFieldRow()}
      <div className="fieldContent row">
        {this.addRows()}
        {this.fieldContent(fields)}
        <div className="col-xs-12 nestedField">
          {this.multipleField()}
        </div>
      </div>
      <ErrorModal {...this.state.error} closeError={this.closeError} />
    </div>);
  }
}