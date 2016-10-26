import { default as React, Component } from 'react';
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
        text: 'Only for major release'
      },
      option2: {
        value: 'all',
        text: 'For all releases'
      }
    }
    this.init();
  }
  init() {
    authEmitter.addListener('profile', (data) => {
      this.setState({
        profile: data
      });
    });
    setTimeout(() => {
      if(!this.state.profile) {
        this.open();
      }
    }, 1000*60*1);
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
      icon = (<img src={this.state.profile.picture} alt={this.state.profile.name} className="avatar img-responsive"></img>);
    }
    return icon;
  }
  render() {
    return (
      <div>
        <a title="subscribe to appbase" className="subscribe" href="javascript:void;" onClick={() => this.open()}>
          {this.showIcon()}
        </a>
        <Modal className="modal-info" show={this.state.showModal} onHide={() => this.close()}>
          <Modal.Header closeButton>
            <Modal.Title>Subscribe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-xs-12">
                <p>Subscribe to appbase</p>
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
          </Modal.Body>
          <Modal.Footer>
            <div className="col-xs-12 text-center">
              <button className="btn btn-primary" onClick={() => this.subscribe()}>
                Subscribe
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}