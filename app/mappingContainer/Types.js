import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';

export class Types extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: []
    };
  }
  componentWillMount() {
    if(dataOperation.inputState.selectedType) {
      this.selectedType = dataOperation.inputState.selectedType;
      this.applyTypeSelection(this.selectedType);
    }
  }
  onTypeChange(type) {
    let checkVal = this.refs[type].checked;
    let selectedType = this.state.selectedType;
    if(checkVal) {
      selectedType.push(type);
    } else {
      selectedType = selectedType.filter((singleType) => {
        return singleType !== type;
      });
    }
    this.applyTypeSelection(selectedType);
  }
  applyTypeSelection(selectedType) {
    this.setState({
      selectedType: selectedType
    }, function() {
      this.props.typeSelection(selectedType);
    }.bind(this));
  }
  isChecked(type) {
    this.selectedType = dataOperation.inputState.selectedType;
    return ((this.selectedType && this.selectedType.indexOf(type)) > -1 ? true : false);
  }
  generateTypeList() {
    let types = Object.keys(this.props.mappings);
    return types.map((type, index) => {
      return (<li key={index}>
        <div className="checkbox">
          <label><input type="checkbox" 
            ref={type} 
            value={type} 
            checked = {this.isChecked(type)}
            onChange={() => this.onTypeChange(type)} />{type}</label>
        </div>
      </li>);
    });
  }
  render() {
    let typeList = this.generateTypeList();
    return (
      <div className="typesContainer">
        <h3 className="title">Types</h3>
        <ul>
          {typeList}
        </ul>
      </div>
    );
  }
}