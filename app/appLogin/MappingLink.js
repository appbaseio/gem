import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { urlShare } from '../service/UrlShare';
import { dataOperation } from '../service/DataOperation';
import {copyToClipboard, applyUrl} from '../others/helper';

export class MappingLink extends Component {
	constructor(props) {
		super(props);
		this.state = {
			url: '',
			copied: ''
		};
		this.copyToClipboard = copyToClipboard.bind(this);
		this.applyUrl = applyUrl.bind(this);
	}
	selectText() {
		let inputObj = dataOperation.inputState;
		inputObj.mappingObj = this.props.mappingObj;
		dataOperation.updateInputState(inputObj, false);
		urlShare.mappingUrlWithoutApp({ mappingObj: this.props.mappingObj }).then((url) => {
			this.applyUrl(url);
		}).catch((error) => console.log(error));
	}
	render() {
		let disable;
		if (!this.props.shareAllowed) {
			disable = {
				disabled: true
			};
		}
		return (
			<span className = 'share-btn action-btn' >
				<OverlayTrigger rootClose trigger = "click" onClick = {() => this.selectText()} placement = "right" overlay = 
				{
					<Popover id="share_pop" className = "nestedJson" >
						<div className="share_content">
							<input type="text" className="form-control" value={this.state.url} id="for-share" readOnly />
							<p className="mt-10">{this.state.copied}</p> 
						</div>
					</Popover>
				} >
				<button {...disable} className = "btn btn-default" >
					<i className = "fa fa-share-alt"> </i>
				</button> 
				</OverlayTrigger> 
			</span>
		);
	}
}
