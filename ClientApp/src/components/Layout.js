import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
        <div style={{ backgroundColor: '#6482AD' }}>
            <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
                <NavMenu />
            </header>
            <Container tag="main" style={{ marginTop: '55px', minHeight: '100vh'}}>
              {this.props.children}
            </Container>
      </div>
    );
  }
}
