import React, { Component } from 'react';
import { 
  Link,
  withRouter 
} from 'react-router-dom';

import { 
  Sidebar,
  Menu,
  Button,
  Icon,
  Segment,
  Divider,
  Grid
} from 'semantic-ui-react';

import { getCurrentUser } from '../commons/user.service';

import { getViewReadyUserRole } from '../utils/translation/user.role';

import UserAvatar from '../commons/components/UserAvatar';

class SidebarNavigation extends Component {
  constructor(props) {
    super(props);
    this._authService = props.authService;

    this.state = {
      user: getCurrentUser()
    }
  }

  getMenuItems(views) {
    return views.map(({ route, title }, i) => 
      <Menu.Item 
        as={Link} 
        to={route} 
        key={i} 
        active={this.props.location.pathname.includes(route)}
      >
        {title}
      </Menu.Item>
    );
  }

  render() {
    return (
      <div>
        <Sidebar 
          as={Menu} 
          animation='push' 
          inverted 
          vertical 
          visible
          width='thin'
        >
          <div className="flex-container">
            <Menu.Item 
                header={true}
                color='teal'
            >
              <span>
                <Icon className="grid" name='user' color='blue'/>
                Kelionių rengimo sistema
              </span>
              <br/><br/>
              <Grid columns={2}>
                <Grid.Row>
                  <Grid.Column verticalAlign='middle' width={4}>
                    <UserAvatar user={this.state.user} noPopup={true}/>
                  </Grid.Column>
                  <Grid.Column width={12}   >
                    <div className='user-info' title={this.state.user.name}>{this.state.user.name}</div>
                    <div className='user-info' title={this.state.user.email}>{this.state.user.email}</div>
                    <div className='user-info' title={getViewReadyUserRole(this.state.user.role)}>{getViewReadyUserRole(this.state.user.role)}</div>
                  </Grid.Column>
                </Grid.Row>
              </Grid>              
            </Menu.Item>
            <Divider fitted={true}/>
            <Divider fitted={true}/>

            <div>
              {this.getMenuItems(this.props.views)}
            </div>
            <div className='bottom-aligned'>
              <
                Button 
                onClick={this.props.authService.logout}
                icon
                labelPosition='right'
              >
                <Icon name='sign-out' />
                Atsijungti
              </Button>
            </div>
          </div>
        </Sidebar>

        
        <Sidebar.Pusher 
          style={{
            /*style hack: https://github.com/Semantic-Org/Semantic-UI/issues/3351*/
            width: 'calc(100% - 150px)'
          }}
        >
          <Segment basic>
            {this.props.children}
          </Segment>
        </Sidebar.Pusher>
      </div>
    );
  }
}

export default withRouter(SidebarNavigation); 
