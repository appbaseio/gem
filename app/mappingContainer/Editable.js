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
    this.types = defaultTypes['2.x'];
    this.indexes = defaultIndexType;
  }
  componentWillMount() {
    this.setState({
      editValue: this.props.editValue
    });
    this.props.editCb(this.props.editKey, this.props.editValue);
    this.version = dataOperation.inputState.version && dataOperation.inputState.version.charAt(0) === '5' ? '5.x' : '2.x';
    this.types = defaultTypes[this.version];
  }
  inputHandle() {
    let editValue = this.refs.editInput.value;
    this.setState({
      editValue: editValue
    });
    this.props.editCb(this.props.editKey, editValue);
  }
  gettypes() {
    let types = this.types.map((type, i) => {
      return (<option key={i} value={type}>{type}</option>)
    });
    types.unshift(<option key={-1} value=''>select datatype</option>);
    return types;
  }
  getindexes() {
    let indexes = this.indexes.map((index, i) => {
      return (<option key={i} value={index}>{index}</option>)
    });
    indexes.unshift(<option key={-1} value=''>select index</option>);
    return indexes;
  }
  getanalyzers() {
    let analyzer = this.props.registeredAnalyzers.map((index, i) => {
      return (<option key={i} value={index}>{index}</option>)
    });
    analyzer.unshift(<option key={-1} value=''>select analyzer</option>);
    return analyzer;
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
      case 'analyzer':
        inputSample =(<select className="form-control" value={this.state.editValue} ref="editInput" onChange={()=> this.inputHandle()} >
            {this.getanalyzers()}
          </select>);
      break;
      default:
        inputSample =(<input className="form-control" type="text" value={this.state.editValue} ref="editInput" onChange={()=> this.inputHandle()} placeholder={this.props.placeholder} ></input>);
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