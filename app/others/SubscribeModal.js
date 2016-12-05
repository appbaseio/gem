import { default as React, Component } from 'react';
import { storageService } from '../service/StorageService';
import { render } from 'react-dom';
import { Modal } from 'react-bootstrap';
import { authOperation, authEmitter } from '../service/AuthOperation';

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
		this.countdown = 0;
		this.timer = 1;
		this.activetab = true;
		this.holdSubscribe = false;
		this.internalClose = false;
		this.init();
	}
	init() {
		authEmitter.addListener('profile', (data) => {
			this.setState({
				profile: data
			});
		});
		storageService.set('subPopuptimerAlreadyOpen', 'no');
		let popupInterval = setInterval(() => {
			this.countdown++;
			if (!this.state.profile) {
				let subPopuptimer = storageService.get('subPopuptimer');
				if (subPopuptimer && subPopuptimer !== 'NaN') {
					this.timer = parseInt(storageService.get('subPopuptimer'), 10);
				}
				if(this.countdown === this.timer) {
					this.open();
				}
			} else {
				popupInterval();
			}
		}, 1000 * 60);

		$(window).focus(function() {
			this.activetab = true;
			setTimeout(() => {
				if (!this.state.profile && this.holdSubscribe && !this.internalClose) {
					this.open();
				}
			}, 1000 * 10 * this.timer);
		}.bind(this));

		$(window).blur(function() {
			this.activetab = false;
		}.bind(this));
	}
	close() {
		this.internalClose = true;
		storageService.set('subPopuptimer', this.timer + 5);
		storageService.set('subPopuptimerAlreadyOpen', 'no');
		this.setState({ showModal: false });
	}
	open() {
		if (!this.state.profile) {
			if (!$('.fade.in.modal').length) {
				if(this.activetab) {
					if(storageService.get('subPopuptimerAlreadyOpen') == 'no') {
						this.setState({ showModal: true });
						storageService.set('subPopuptimerAlreadyOpen', 'yes');
					}
				} else {
					this.holdSubscribe = true;
				}
			} else {
				setTimeout(() => {
					this.open();
				}, 1000 * 10);
			}
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
		if (this.state.profile) {
			icon = (<i className="fa fa-check"></i>);
		}
		return icon;
	}
	setOption(options) {
		return options.map((opt, index) => {
			return (
				<div key={index} className="col-xs-12 single-option">
					<label className="radio-inline">
					<input type="radio"
						checked={this.state.subscribeOption === opt.value}
						onChange={() => this.subscribeOptionChange(opt.value)}
						name="subscribeOption" id={"subscribeOption"+index} value={opt.value} /> {opt.text}
					</label>
				</div>
			);
		});
	}
	render() {
		return (
		<div>
			<a title="Subscribe to updates" className="subscribe pointer" onClick={() => this.open()}>
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
							{this.setOption([this.options.option1, this.options.option2])}
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
