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
    this.editCb = this.editCb.bind(this);
  }
  componentWillMount() {
    if(this.props.defaultEdit) {
      this.setState({
        defaultEdit: this.props.defaultEdit
      });
    }
  }
  allowEdit() {
    let editFlag = !this.state.defaultEdit;
    this.setState({
      defaultEdit: editFlag
    });
  }
  deleteField() {
    var r = confirm('Do you want to delete this field?');
    if(r) {
      this.props.deleteField(this.props.field, this.props.singleType);
    }
  }
  editCb(key, value) {
    this.modified[key] = value;
  }
  saveEdit() {
    this.props.setModifiedField(this.props.fieldName, this.modified);
    this.quitEditable();
  }
  quitEditable() {
    this.setState({
      defaultEdit: false
    });
  }
  operationalBtn() {
    let operationalBtn = (<span className="operationalBtns">
      <a onClick={() => this.allowEdit()} className="btn btn-xs btn-info">
        <i className="fa fa-pencil"></i>
      </a>
    </span>);
    if(this.state.defaultEdit) {
      operationalBtn = (<span className="operationalBtns">
        <a onClick={() => this.saveEdit()} className="btn btn-xs btn-success">
          <i className="fa fa-check"></i>
        </a>
        <a onClick={() => this.quitEditable()} className="btn btn-xs btn-danger">
          <i className="fa fa-times"></i>
        </a>
      </span>);
    }
    return operationalBtn;
  }
  render() {
    let operationalBtn = this.operationalBtn();
    return (
      <div className="internalField col-xs-12">
        <span className="fieldName col-xs-12 col-sm-4">
          <Editable 
            editKey='fieldName'
            editCb={this.editCb}
            editValue={this.props.fieldName} 
            defaultEdit={this.state.defaultEdit} />
        </span>
        <span className="datatype col-xs-12 col-sm-4">
          <Editable
            editKey='type'
            editCb={this.editCb}
            editValue={this.props.fieldInfo.type} 
            defaultEdit={this.state.defaultEdit} />
        </span>
        <span className="fieldIndex col-xs-12 col-sm-4">
          <Editable 
            editKey='index'
            editCb={this.editCb}
            editValue={this.props.fieldInfo.index} 
            defaultEdit={this.state.defaultEdit} />
        </span>
        {operationalBtn}
      </div>
    );
  }
}