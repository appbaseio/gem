import { default as React, Component } from 'react';
import { render } from 'react-dom';
import { dataOperation } from '../service/DataOperation';
import { SubscribeModal } from '../others/SubscribeModal';

export class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
    <header className="header text-center">
      <div className="img-container">
        <img src="assets/images/logo.png" alt="Gem" className="img-responsive"/>
      </div>
      <div className="tag-line">
        GUI for Elasticsearch Mappings
      </div>
      <SubscribeModal />
    </header> 
    );
  }
}

Header.propTypes = {  
};
// Default props value
Header.defaultProps = {
};