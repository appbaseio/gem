import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { Types } from './Types';
import { Fields } from './Fields';

export class MappingContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: []
    };
    this.typeSelection = this.typeSelection.bind(this);
  }
  componentWillMount() {

  }
  typeSelection(selectedType) {
    let inputState = dataOperation.inputState;
    inputState.selectedType = selectedType;
    dataOperation.updateInputState(inputState);
    this.setState({
      selectedType: selectedType
    });
  }
  render() {
    let returnMarkup = null;
    if(this.props.mappings) {
      returnMarkup = (<div className="mappingWrapper">
          <Types mappings={this.props.mappings} typeSelection={this.typeSelection} />
          <Fields mappings={this.props.mappings} selectedType={this.state.selectedType} />
        </div>);
    }
    return (<div className="mappingContainer">
      {returnMarkup}
    </div>);
  }
}