import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import TripList from './components/trip.list';

class Travel extends Component {
  static get route() {
    return '/travel';
  }

  static get title() {
    return 'Keliauti';
  }

  render() {
    return (
      <Switch>
        <Route exact path={Travel.route} component={TripList}/>
        <Redirect from={Travel.route + '*'} to={Travel.route}/>
      </Switch>
    );
  }
} 
  
export default Travel;