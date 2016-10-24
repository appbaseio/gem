import {
  default as React, Component } from 'react';
import { render } from 'react-dom';
import { GemLink } from './GemLink';
import { MirageLink } from './MirageLink';
import { DejavuLink } from './DejavuLink';

export class Sidebar extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }
  
  render() {
      return ( 
        <div className="app-sidebar">
          <ul>
            <li>
              <DejavuLink />
            </li>
            <li>
              <MirageLink />
            </li>
          </ul>
        </div>
      );
    }
  }
