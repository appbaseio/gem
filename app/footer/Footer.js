import { default as React, Component } from 'react';
import { render } from 'react-dom';

export class Footer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <footer className="text-center"> 
        <span className="github-star">
          <iframe src="https://ghbtns.com/github-btn.html?user=appbaseio&repo=gem&type=star&count=true" frameBorder="0" scrolling="0" width="120px" height="20px"></iframe>
        </span>
        <span className="powered_by">
          Create your ElasticSearch in cloud with&nbsp;<a href="http://appbase.io">appbase.io</a>
        </span>
      </footer>
    );
  }

}