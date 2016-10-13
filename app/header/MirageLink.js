import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { urlShare } from '../service/UrlShare';

export class MirageLink extends Component {
  constructor(props) {
    super(props);
  }
  redirect() {
    urlShare.redirectUrl('mirage').then((url) => {
      window.open(url, '_blank');
    }).catch((error) => console.log(error));
  }
  render() {
    return (
      <a className="link btn btn-default action-btn" onClick = {() => this.redirect()}>
        Query Explorer <i className="fa fa-external-link-square"></i>
      </a>
    );
  }
}