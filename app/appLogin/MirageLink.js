import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { urlShare } from '../service/UrlShare';

export class MirageLink extends Component {
  constructor(props) {
    super(props);
  }
  redirect() {
    urlShare.redirectUrl('mirage').then((url) => {
      window.open(url, '_self');
    }).catch((error) => console.log(error));
  }
  render() {
    return (
      <a title="Mirage - Query Explorer"
        className="link action-btn" 
        onClick = {() => this.redirect()}>
        M
      </a>
    );
  }
}