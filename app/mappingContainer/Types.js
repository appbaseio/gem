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
    
  }
  selectOption() {
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
    this.setState({
      selectedType: selectedType
    }, function() {
      this.props.typeSelection(selectedType);
    }.bind(this));
  }
  generateTypeList() {
    let types = Object.keys(this.props.mappings);
    return types.map((type, index) => {
      return (<li key={index}>
        <div className="checkbox">
          <label><input type="checkbox" ref={type} value={type} onChange={() => this.onTypeChange(type)} />{type}</label>
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