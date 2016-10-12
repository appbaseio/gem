import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { defaultTypes, defaultIndexType } from '../service/default';

export class Editable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editValue: ''
    };
    this.types = defaultTypes;
    this.indexes = defaultIndexType;
  }
  componentWillMount() {
    this.setState({
      editValue: this.props.editValue
    });
    this.props.editCb(this.props.editKey, this.props.editValue);
  }
  inputHandle() {
    let editValue = this.refs.editInput.value;
    this.setState({
      editValue: editValue
    });
    this.props.editCb(this.props.editKey, editValue);
  }
  gettypes() {
    return this.types.map((type, i) => {
      return (<option key={i} value={type}>{type}</option>)
    });
  }
  getindexes() {
    return this.indexes.map((index, i) => {
      return (<option key={i} value={index}>{index}</option>)
    });
  }
  inputOptions() {
    let inputSample;
    switch(this.props.editKey) {
      case 'fieldName':
        inputSample =(<input className="form-control" type="text" value={this.state.editValue} ref="editInput" onChange={()=> this.inputHandle()} placeholder={this.props.placeholder} ></input>);
      break;
      case 'type':
        inputSample =(<select className="form-control" value={this.state.editValue} ref="editInput" onChange={()=> this.inputHandle()} >
            {this.gettypes()}
          </select>);
      break;
      case 'index':
        inputSample =(<select className="form-control" value={this.state.editValue} ref="editInput" onChange={()=> this.inputHandle()} >
            {this.getindexes()}
          </select>);
      break;
    }
    return inputSample;
  }
  render() {
    return (
      <div className={"editableContainer col-xs-12" + (this.props.defaultEdit ? ' on ' : ' off ')}>
        <div className="frontEditable">
          {this.props.editValue}
        </div>
        <div className="backEditable">
          <div className="form-group">
            {this.inputOptions()}
          </div>
        </div>
      </div>
    );
  }
}