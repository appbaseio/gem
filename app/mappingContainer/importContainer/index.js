import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { Modal } from 'react-bootstrap';
import { ImportContainer } from './ImportContainer';

export class ImportModal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="modal-yellow" id="importModal">
        <h3 className="view-title">
          Import sample JSON data to create new mapping
        </h3>
        <ImportContainer
          key={1}
          selectedType={this.props.selectedType}
          mappings={this.props.mappings}
          getMapping={this.props.getMapping}
          changeView={this.props.changeView}
          >
        </ImportContainer>
      </div>
    );
  }
}
