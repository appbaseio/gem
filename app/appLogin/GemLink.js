import {default as React, Component } from 'react';
import { render } from 'react-dom';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { urlShare } from '../service/UrlShare';
import {copyToClipboard, applyUrl} from '../others/helper';

export class GemLink extends Component {
	constructor(props) {
		super(props);
		this.state = {
			url: '',
			copied: '',
			iframeurl: ''
		};
		this.copyToClipboard = copyToClipboard.bind(this);
		this.applyUrl = applyUrl.bind(this);
	}
	selectText() {
		urlShare.redirectUrl('gem').then((url) => {
			this.applyUrl(url);
		}).catch((error) => console.log(error));
	}
	render() {
		return (
			<span className = 'share-btn action-btn' >
				<OverlayTrigger rootClose trigger = "click" onClick = {() => this.selectText()} placement = "right" overlay = 
				  { 
					<Popover id="share_pop" className = "nestedJson" >
					  <div className="share_content">
						<section className="share_part">
						  <h3 className="title">
							Link
						  </h3>
						  <div className="description">
							<input type="text" className="form-control" value={this.state.url} id="for-share" readOnly />
							<p className="mt-10">{this.state.copied}</p> 
						  </div>
						</section>
						<section className="share_part">
						  <h3 className="title">
							Embed
						  </h3>
						  <div className="description">
							<input type="text" readOnly className="form-control" value={`<iframe src="${this.state.iframeurl}" width="1024" height="768" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`} id="for-share" />
						  </div>
						</section>
					  </div>
					</Popover>
				  } >
				<a className = "btn btn-default pointer" >
				  <i className = "fa fa-share-alt"> </i> 
				</a>
				</OverlayTrigger> 
			</span>
		);
	}
}
