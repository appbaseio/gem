import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { Editable } from './Editable';

export class SingleOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultEdit: false,
      value: ''
    };
    this.modified = {};
    this.editCb = this.editCb.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    if(value && value !== '') { 
      this.props.optionEdit(this.props.index, this.modified);
    }
  }
  quitEditable() {
    this.props.optionEdit(this.props.index, this.modified, true);
  }
  handleChange(event) {
    let value = event.target.value;
    this.setState({value: value});
    try {
      let data = JSON.parse(value);
      this.props.optionEdit(this.props.index, data);
    } catch(e) {}
  }
  operationalBtn() {
    let operationalBtn;
    if(this.state.defaultEdit) {
      operationalBtn = (<span className="operationalBtns">
        <a onClick={() => this.quitEditable()} className="btn btn-xs btn-grey-bg">
          <i className="fa fa-times"></i>
        </a>
      </span>);
    }
    return operationalBtn;
  }
  render() {
    let operationalBtn = this.operationalBtn();
    return (
      <div className="fieldAdditionalRow fieldEdit col-xs-12">
        <span className="fieldName col-xs-12 pd-l0">
          <textarea
            className="col-xs-12"
            name="description"
            value={this.state.value}
            placeholder="Enter a valid JSON object"
            onChange={this.handleChange}
          />
        </span>
        {operationalBtn}
      </div>
    );
  }
}