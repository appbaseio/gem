import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { urlShare } from '../service/UrlShare';

export class DejavuLink extends Component {
  constructor(props) {
    super(props);
  }
  redirect() {
    urlShare.redirectUrl('dejavu').then((url) => {
      window.open(url, '_self');
    }).catch((error) => console.log(error));
  }
  render() {
    return (
      <a title="Dejavu - data view" className="link action-btn" onClick = {() => this.redirect()}>
        D
      </a>
    );
  }
}