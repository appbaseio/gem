import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { Modal } from 'react-bootstrap';

export class ErrorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this.internalClose = false;
  }
  componentDidUpdate() {
    if(!this.internalClose && this.props.title && !this.state.showModal) {
      this.setState({ showModal: true });  
    } else {
      this.internalClose = false;
    }
  }
  close() {
    this.internalClose = true;
    this.setState({ showModal: false });
    this.props.closeError();
  }
  open() {
    this.setState({ showModal: true });
  }
  render() {
    return (
      <Modal className="modal-danger" show={this.state.showModal} onHide={() => this.close()}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {this.props.message}
          </p>
        </Modal.Body>
      </Modal>
    );
  }
}