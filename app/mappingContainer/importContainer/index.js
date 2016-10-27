import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { Modal } from 'react-bootstrap';
import { ImportContainer } from './ImportContainer';

export class ImportModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      profile: false
    };
    this.close = this.close.bind(this);
  }
  close() {
    this.internalClose = true;
    this.setState({ showModal: false });
  }
  open() {
    if(!this.state.profile) {
      this.setState({ showModal: true });
    }
  }
  subscribe() {
    authOperation.login();
  }
  render() {
    return (
      <div>
        <a title="Add new import" className="btn btn-yellow importBtn" href="javascript:void;" onClick={() => this.open()}>
          Import new data
        </a>
        <Modal backdrop="static" className="modal-yellow" id="importModal" 
          enforceFocus={false}
          show={this.state.showModal}
          onHide={() => this.close()}>
          <Modal.Header closeButton>
            <Modal.Title>Import sample JSON data to create new mapping</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <ImportContainer
                key={1}
                selectedType={this.props.selectedType}
                mappings={this.props.mappings}
                getMapping={this.props.getMapping}
                close={this.close}
                ></ImportContainer>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
