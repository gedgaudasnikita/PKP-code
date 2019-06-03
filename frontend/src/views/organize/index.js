import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import TripList from './components/trip.list';

class Organize extends Component {
  static get route() {
    return '/organize';
  }

  static get title() {
    return 'Organizuoti';
  }

  render() {
    return (
      <Switch>
        <Route exact path={Organize.route} component={TripList}/>
        <Redirect from={Organize.route + '*'} to={Organize.route}/>
      </Switch>
    );
  }
} 
  
export default Organize;