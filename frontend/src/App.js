import React, { Component } from 'react';

import AuthenticationService from './authentication/authentication.service';

import UnauthorizedRouter from './routers/UnauthorizerRouter';
import AuthorizedRouter from './routers/AuthorizedRouter';

class Footer extends Component {
  render() {
    return (
      <p style={{
        position: 'absolute',
        float: 'right',
        bottom: 10,
        right: 10,
        opacity: 0.5,
        fontSize: '85%'
      }}>
        by <a 
          href='https://crepesteahouse.com/wp-content/uploads/2016/09/tuna-cutlet.png'
        >Cutlet Solutions</a> for <a 
          href='https://www.devbridge.com/'
        >DevBridge Group</a>, 2019
      </p>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    
    this._authService = new AuthenticationService((authenticated) => {
      this.setState({ isAuthenticated: authenticated })
    });
    global._authService = this._authService;

    this.state = {
      isAuthenticated: this._authService.isAuthenticated()
    }
  }

  render() {
    return (
      <div>
        {
          this.state.isAuthenticated
            ? <AuthorizedRouter authService={this._authService}/>
            : <UnauthorizedRouter authService={this._authService}/>
        }
        <Footer/>
      </div>
    )
  }   
}

export default App;
