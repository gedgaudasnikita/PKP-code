import React, { Component } from 'react'
import { Button, Icon, Form, Grid, Message, Segment } from 'semantic-ui-react'

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = { };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
 
  handleInputChange({ target: { value, name }}) {
    this.setState({
      [name]: value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {
      email,
      password
    } = this.state;

    const loginSuccessful = await this.props.authService.login(
      email,
      password
    )
     
    this.setState({ loginSuccessful })
  }

  render() {
    return (
      <div className='login-form'>
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}
        </style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Message 
              hidden={
                this.state.loginSuccessful !== true && 
                this.state.loginSuccessful !== false
              }
              success={this.state.loginSuccessful === true}
              error={this.state.loginSuccessful === false}
            >
              {
                this.state.loginSuccessful
                  ? 'Login successful!'
                  : 'Login failed.'
              }
            </Message>
            <Form size='large' onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input 
                  fluid 
                  icon='user' 
                  iconPosition='left' 
                  placeholder='E-mail address' 
                  name='email'
                  value={this.state.email || ''}
                  onChange={this.handleInputChange}
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  name='password'
                  value={this.state.password || ''}
                  onChange={this.handleInputChange}
                />

                <Button labelPosition='right' icon type='submit' color='teal' fluid size='large'>
                  Login
                  <Icon name='sign-in' />
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default LoginForm