import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { urlShare } from '../service/UrlShare';

export class DejavuLink extends Component {
  constructor(props) {
    super(props);
  }
  redirect() {
    urlShare.redirectUrl('dejavu').then((url) => {
      window.open(url, '_blank');
    }).catch((error) => console.log(error));
  }
  render() {
    return (
      <a className="link btn btn-default action-btn" onClick = {() => this.redirect()}>
        Data View <i className="fa fa-external-link-square"></i>
      </a>
    );
  }
}