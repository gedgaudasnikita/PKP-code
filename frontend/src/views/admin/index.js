import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react'

import UserManagement from './components/user.management';
import OfficeManagement from './components/office.management';
import ApartmentManagement from './components/apartment.management';

class Admin extends Component {
  static get route() {
    return '/admin';
  }

  static get title() {
    return 'Administruoti';
  }

  render() {
    return (
      <div>
        <Tab panes={
          [          
            {
              menuItem: UserManagement.title,
              render: () => <Tab.Pane><UserManagement/></Tab.Pane>
            },
            {
              menuItem: OfficeManagement.title,
              render: () => <Tab.Pane><OfficeManagement/></Tab.Pane>
            },
            {
              menuItem: ApartmentManagement.title,
              render: () => <Tab.Pane><ApartmentManagement/></Tab.Pane>
            }
          ]
        }/>
      </div>
    );
  }
}

export default Admin;