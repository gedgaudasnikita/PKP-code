import React, { Component } from 'react';
import { 
  Switch, 
  Route,
  Redirect 
} from 'react-router-dom'

import LoginPage from '../authentication/LoginPage';

class UnauthorizedRouter extends Component {
    render() {
        return (
          <Switch>
            <Route path='/login' render={ 
              (routeProps) => <LoginPage {...routeProps} authService={this.props.authService}/>
            }/>
            <Redirect from="*" to='/login'/>
          </Switch>
        );
    }
}

export default UnauthorizedRouter;
