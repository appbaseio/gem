import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';

export class Editable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editValue: ''
    };
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
  render() {
    return (
      <div className={"editableContainer col-xs-12" + (this.props.defaultEdit ? ' on ' : ' off ')}>
        <div className="frontEditable">
          {this.props.editValue}
        </div>
        <div className="backEditable">
          <div className="form-group">
            <input className="form-control" type="text" value={this.state.editValue} ref="editInput" onChange={()=> this.inputHandle()} placeholder={this.props.placeholder} />
          </div>
        </div>
      </div>
    );
  }
}