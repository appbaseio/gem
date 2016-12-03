import { default as React, Component } from 'react';
import { storageService } from '../service/StorageService';
import { dataOperation } from '../service/DataOperation';
import { render } from 'react-dom';
import { Modal } from 'react-bootstrap';
import { authOperation, authEmitter } from '../service/AuthOperation';

export class IntroModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			subscribeOption: 'major',
			profile: null
		};
	}
	componentWillMount() {
		authEmitter.addListener('profile', (data) => {
			this.setState({
				profile: data
			});
		});
	}
	componentDidMount() {
		if (!dataOperation.queryParams) {
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
	subscribe() {
		authOperation.login(this.state.subscribeOption);
	}
	subscribeBtn() {
		let subscribeBtn;
		if(!this.state.profile) {
			subscribeBtn = (
				<button className="btn btn-primary pull-right" onClick={() => this.subscribe()}>
					<i className="fa fa-github"></i> Subscribe with Github
				</button>
			);
		} else {
			subscribeBtn = (
				<button disabled="true" className="btn btn-primary pull-right">
					<i className="fa fa-check"></i> Subscribed
				</button>
			);
		}
		return subscribeBtn;
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
								Check out this video and the links below for a quick start with GEM.
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
									<li className="introBottom">
										<a href="https://github.com/appbaseio/gem/blob/dev/README.md" target="_blank" className="pull-left">Read more on Github</a>
										{this.subscribeBtn()}
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
