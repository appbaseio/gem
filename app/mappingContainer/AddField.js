import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { Modal } from 'react-bootstrap';
import { defaultTypes, defaultIndexType } from '../service/default';

export class AddField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      formObj: {
        values: {
          type: '',
          name: '',
          datatype: '',
          index: ''
        },
        validate: {
          start: false,
          type: false,
          name: false,
          datatype: false,
          index: false
        }
      }
    };
    this.types = defaultTypes;
    this.indexes = defaultIndexType;
  }
  close() {
    this.setState({ showModal: false });
  }
  open() {
    this.setState({ showModal: true });
  }
  componentWillMount() {
    
  }
  getTypes() {
    return this.props.types.map((type, i) => {
      return (<option key={i} value={type}>{type}</option>)
    });
  }
  getIndexes() {
    return this.indexes.map((index, i) => {
      return (<option key={i} value={index}>{index}</option>)
    });
  }
  getDatatypes() {
    return this.types.map((type, i) => {
      return (<option key={i} value={type}>{type}</option>)
    });
  }
  submit() {
    let formObj = this.state.formObj;
    let flag = true;
    for(let field in formObj.values) {
      formObj.validate[field] = (formObj.values[field] && formObj.values[field].length) ? true : false;
      if(!formObj.validate[field]) {
        flag = false;
      }
    }
    formObj.validate.start = true;
    this.setState({
      formObj: formObj
    });
    if(flag) {
      this.props.submitField(formObj.values);
      this.close();
    }
  }
  inputHandle(method) {
    let formObj = this.state.formObj;
    let val = this.refs[method].value;
    formObj.values[method] = val;
    this.setState({
      formObj: formObj
    }); 
  }
 
  render() {
    let formObj = this.state.formObj;
    return (
    <span className="btn-add-field-container">
      <a
        className="btn btn-primary btn-add-field"
        onClick={() => this.open()}
      >
        <i className="fa fa-plus"></i>
      </a>

      <Modal show={this.state.showModal} onHide={() => this.close()}>
        <Modal.Header closeButton>
          <Modal.Title>Add Field</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form >
            <div className={"form-group "+ (formObj.validate.start ? (formObj.validate.type ? '' : 'has-error') : '')} >
              <label className="control-label" htmlFor="typeInput">Choose Type</label>
              <select ref='type' className="form-control" id="typeInput" value={formObj.values.type} onChange={()=> this.inputHandle('type')}  >
                <option value="">Choose Type</option>
                {this.getTypes()} 
              </select>
            </div>  
            <div className={"form-group "+ (formObj.validate.start ? (formObj.validate.name ? '' : 'has-error') : '')}>
              <label className="control-label" htmlFor="name">Field name</label>
              <input ref="name" placeholder="Field name" type="text" className="form-control" id="name"  value={formObj.values.name} onChange={()=> this.inputHandle('name')} />
            </div>
            <div className={"form-group "+ (formObj.validate.start ? (formObj.validate.datatype ? '' : 'has-error') : '')}>
              <label className="control-label" htmlFor="name">Datatype</label>
              <select ref='datatype' className="form-control" id="typeInput" value={formObj.values.datatype} onChange={()=> this.inputHandle('datatype')}>
                <option value="">Choose datatype</option>
                {this.getDatatypes()} 
              </select>
            </div>
            <div className={"form-group "+ (formObj.validate.start ? (formObj.validate.index ? '' : 'has-error') : '')}>
              <label className="control-label" htmlFor="index">Index Type</label>
              <select ref='index' className="form-control" id="index"  value={formObj.values.index} onChange={()=> this.inputHandle('index')}>
                <option value="">Choose Index Type</option>
                {this.getIndexes()} 
              </select>
            </div>
          </form>  
        </Modal.Body>
        <Modal.Footer>
          <a className="btn" onClick={() => this.close()}>Close</a>
          <a className="btn btn-primary" onClick={() => this.submit()}>Submit</a>
        </Modal.Footer>
      </Modal>
    </span>
    );
  }
}