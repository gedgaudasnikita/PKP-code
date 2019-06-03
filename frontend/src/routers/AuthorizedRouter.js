import React, { Component } from 'react';
import { 
  Switch, 
  Route,
  Redirect 
} from 'react-router-dom'

import TripDetailsView from '../commons/components/trip/details';
import SidebarNavigation from '../navigation/SidebarNavigation';

class AuthorizedRouter extends Component {
  constructor(props) {
    super(props);

    this._authService = props.authService;
    this._views = this._authService.getViewsForCurrentUser();
  }

    getRoutes(pages) {
      return pages.map((view, i) => 
        <Route path={view.route} component={view} key={i}/>
      );
    }
  
    render = () => {
      return (
          <SidebarNavigation views={this._views} authService={this._authService}>
              <Switch>
                  {this.getRoutes(this._views)}
                  <Route path='/trips/:tripId' component={TripDetailsView} key={-1}/>
                  <Redirect from="*" to={this._views[0].route} />
              </Switch>
          </SidebarNavigation>
      );
    }
}

export default AuthorizedRouter;
