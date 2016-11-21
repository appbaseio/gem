import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { SubscribeModal } from '../others/SubscribeModal';
import { config } from '../config';

export class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var subscribeModal;
    if(config.BRANCH !== 'master' && (this.props.queryParams && !this.props.queryParams.subscribe)) {
      subscribeModal = (<SubscribeModal></SubscribeModal>);
    }
    return (
    <header className="header text-center">
      <div className="img-container">
        <img src="assets/images/logo.png" alt="Gem" className="img-responsive"/>
      </div>
      <div className="tag-line">
        GUI for Elasticsearch Mappings
      </div>
      {subscribeModal}
    </header> 
    );
  }
}

Header.propTypes = {  
};
// Default props value
Header.defaultProps = {
};