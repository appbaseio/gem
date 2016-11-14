import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { Editable } from './Editable';

export class SingleField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultEdit: false
    };
    this.modified = {};
    this.excludeProp = ['index', 'analyzer'];
    this.editCb = this.editCb.bind(this);
  }
  componentWillMount() {
    if(this.props.defaultEdit) {
    }
  }
  allowEdit() {
    let editFlag = !this.props.defaultEdit;
  }
  deleteField() {
    var r = confirm('Do you want to delete this field?');
    if(r) {
      this.props.deleteField(this.props.field, this.props.singleType);
    }
  }
  editCb(key, value) {
    this.modified[key] = value;
    this.setState(this.modified);
  }
  validate() {
    let flag = true;
    for(let field in this.modified) {
      if(this.excludeProp.indexOf(field) < 0 && !(this.modified[field] && this.modified[field] !== '')) {
        flag = false;
      }
    }
    this.excludeProp.forEach((pro) => {
      if(this.modified[pro] && this.modified[pro] === '') {
        delete this.modified[pro];
      }
    });
    return flag;
  }
  saveEdit() {
    if(this.validate()) {
      this.props.setModifiedField(this.props.fieldName, this.modified);
    }
  }
  quitEditable() {
    this.props.removeField(this.props.fieldName);
  }
  operationalBtn() {
    let operationalBtn;
    if(this.props.defaultEdit) {
      operationalBtn = (<span className="operationalBtns">
        <a onClick={() => this.saveEdit()} className={"btn btn-xs "+(this.props.view === 'mapping' ? 'btn-yellow' : 'btn-primary')}>
          <i className="fa fa-check"></i>
        </a>
        <a onClick={() => this.quitEditable()} className="btn btn-xs btn-grey-bg">
          <i className="fa fa-times"></i>
        </a>
      </span>);
    }
    return operationalBtn;
  }
  render() {
    let indexRow, analyzerRow, analyzer, registeredAnalyzers = null;
    let operationalBtn = this.operationalBtn();
    if(this.modified.type === 'string') {
      indexRow = (
        <span className="fieldIndex col-xs-12 col-sm-4">
          <Editable 
            editKey='index'
            editCb={this.editCb}
            editValue={this.props.fieldInfo.index} 
            defaultEdit={this.props.defaultEdit} 
            placeholder="index type"/>
        </span>
      );
    }
    if(dataOperation.settings) {
      try {
        registeredAnalyzers = dataOperation.settings[dataOperation.inputState.appname].settings.index.analysis.analyzer;
      } catch(e) {}
      registeredAnalyzers = registeredAnalyzers ? Object.keys(registeredAnalyzers) : [];
      if(registeredAnalyzers.length) {
        analyzerRow = (
          <span className="fieldAnalyzer col-xs-12 col-sm-4">
            <Editable 
              editKey='analyzer'
              editCb={this.editCb}
              editValue={this.props.fieldInfo.analyzer} 
              defaultEdit={this.props.defaultEdit} 
              registeredAnalyzers={registeredAnalyzers}
              placeholder="analyzer"/>
          </span>
        );
      } 
    }   
    return (
      <div className="internalField col-xs-12">
        <span className="fieldName col-xs-12 col-sm-4">
          <Editable 
            editKey='fieldName'
            editCb={this.editCb}
            editValue={this.props.fieldName} 
            defaultEdit={this.props.defaultEdit} 
            placeholder="Enter fieldname"/>
        </span>
        <span className="datatype col-xs-12 col-sm-4">
          <Editable
            editKey='type'
            editCb={this.editCb}
            editValue={this.props.fieldInfo.type} 
            defaultEdit={this.props.defaultEdit} 
            placeholder="datatype"/>
        </span>
        {indexRow}
        {analyzerRow}
        {operationalBtn}
      </div>
    );
  }
}