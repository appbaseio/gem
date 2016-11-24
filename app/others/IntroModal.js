import { default as React, Component } from 'react';
import { storageService } from '../service/StorageService';
import { dataOperation } from '../service/DataOperation';
import { render } from 'react-dom';
import { Modal } from 'react-bootstrap';

export class IntroModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }
  componentDidMount() {
    if(!dataOperation.queryParams) {
      this.open();
    }
  }
  close() {
    this.internalClose = true;
    storageService.set('popuptimer', this.timer + 5);
    this.setState({ showModal: false });
  }
  open() {
    if (!this.state.profile) {
      this.setState({ showModal: true });
    }
  }
  render() {
    return (
      <span>
        <a title="Intro to gem" className="intro-link" href="javascript:void;" onClick={() => this.open()}>
          Gem introduction
        </a>
        <Modal id="learnModal" className="modal-info" show={this.state.showModal} onHide={() => this.close()}>
          <Modal.Header closeButton>
            <Modal.Title>New to Gem?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="learn-description">
              <p>
                Check out this video and the links below for a quick start with Mirage.
              </p>
              <div className="learn-list-contianer">
                <ul className="learn-list">
                  <li>
                      <iframe 
                        src="https://player.vimeo.com/video/192771591?title=0&byline=0&portrait=0" 
                        width="100%" 
                        height="300px" 
                        frameBorder="0" 
                        allowFullScreen></iframe>
                  </li>
                  <li>
                    <a href="https://github.com/appbaseio/gem/blob/dev/README.md" target="_blank">Read more on Github</a>
                  </li>
                </ul>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </span>
    )
  }
}
