import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { urlShare } from '../service/UrlShare';

export class MappingLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      copied: ''
    };
  }
  selectText() {
    urlShare.mappingUrl(this.props.mappingObj).then((url) => {
      this.applyUrl(url);
    }).catch((error) => console.log(error));
  }
  applyUrl(url) {
    this.setState({url: url, copied: ''});
    setTimeout(function() {
      var ele = document.getElementById('for-share');
      var succeed = this.copyToClipboard(ele);
      if(succeed) {
        this.setState({copied: 'Link is copied to clipboard!'});
      }
    }.bind(this),500);
  }
  copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
      // can just use the original source element for the selection and copy
      target = elem;
      origSelectionStart = elem.selectionStart;
      origSelectionEnd = elem.selectionEnd;
    } else {
      // must use a temporary form element for the selection and copy
      target = document.getElementById(targetId);
      if (!target) {
        var target = document.createElement("textarea");
        target.style.position = "absolute";
        target.style.left = "-9999px";
        target.style.top = "0";
        target.id = targetId;
        document.body.appendChild(target);
      }
      target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
      succeed = document.execCommand("copy");
    } catch (e) {
      succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
      currentFocus.focus();
    }

    if (isInput) {
      // restore prior selection
      elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
      // clear temporary content
      target.textContent = "";
    }
    return succeed;
  }
  render() {
    return (
      <span className = 'share-btn action-btn' >
        <OverlayTrigger rootClose trigger = "click" onClick = {() => this.selectText()} placement = "right" overlay = 
          { 
            <Popover id="share_pop" className = "nestedJson" >
              <div className="share_content">
                <input type="text" className="form-control" value={this.state.url} id="for-share" />
                <p className="mt-10">{this.state.copied}</p> 
              </div>
            </Popover>
          } >
        <a href = "javascript:void(0);" className = "btn btn-default" >
          <i className = "fa fa-share-alt"> </i> 
        </a> 
        </OverlayTrigger> 
      </span>
    );
  }
}