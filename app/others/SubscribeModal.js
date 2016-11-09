import { default as React, Component } from 'react';
import { storageService } from '../service/StorageService';
import { render } from 'react-dom';
import { Modal } from 'react-bootstrap';
import { authOperation, authEmitter } from '../service/authOperation';

export class SubscribeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      profile: false,
      subscribeOption: 'major'
    };
    this.options = {
      option1: {
        value: 'major',
        text: 'New GEM releases'
      },
      option2: {
        value: 'all',
        text: 'Limited major updates'
      }
    }
    this.timer = 1;
    this.init();
  }
  init() {
    authEmitter.addListener('profile', (data) => {
      this.setState({
        profile: data
      });
    });
    if(storageService.get('popuptimer')) {
      this.timer = parseInt(storageService.get('popuptimer'));
    }
    setTimeout(() => {
      if(!this.state.profile) {
        this.open();
      }
    }, 1000*60*this.timer);
  }
  close() {
    this.internalClose = true;
    storageService.set('popuptimer', this.timer+5);
    this.setState({ showModal: false });
  }
  open() {
    if(!this.state.profile) {
      this.setState({ showModal: true });
    }
  }
  subscribe() {
    authOperation.login(this.state.subscribeOption);
  }
  subscribeOptionChange(value) {
    this.setState({
      subscribeOption: value
    });
  }
  showIcon() {
    let icon = (<i className="fa fa-envelope-o"></i>);
    if(this.state.profile) {
      icon = (<i className="fa fa-check"></i>);
    }
    return icon;
  }
  render() {
    return (
      <div>
        <a title="Subscribe to updates" className="subscribe" href="javascript:void;" onClick={() => this.open()}>
          {this.showIcon()}
        </a>
        <Modal className="modal-info" show={this.state.showModal} onHide={() => this.close()}>
          <Modal.Header closeButton>
            <Modal.Title>Be in the know about major updates!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-12 single-option">
                    <label className="radio-inline">
                      <input type="radio"
                        checked={this.state.subscribeOption === this.options.option1.value}
                        onChange={() => this.subscribeOptionChange(this.options.option1.value)}
                        name="subscribeOption" id="subscribeOption" value={this.options.option1.value} /> {this.options.option1.text}
                    </label>
                  </div>
                  <div className="col-xs-12 single-option">
                    <label className="radio-inline">
                      <input type="radio"
                        checked={this.state.subscribeOption === this.options.option2.value}
                        onChange={() => this.subscribeOptionChange(this.options.option2.value)}
                        name="subscribeOption1" id="subscribeOption1" value={this.options.option2.value} /> {this.options.option2.text}
                    </label>
                  </div>
                </div>
              </div>
            </div>
						<div className="col-xs-12 text-center">
              <button className="btn btn-primary" onClick={() => this.subscribe()}>
                <i className="fa fa-github"></i> Subscribe with Github
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}
