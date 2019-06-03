import React, { Component } from 'react';
import { Table, Input, Button, Dropdown, Form, Icon } from 'semantic-ui-react';

import UserRoles from '../../../../enums/user.roles';
import { getViewReadyUserRole } from '../../../../utils/translation/user.role';

import apiClient from '../../../../commons/api.client';
import { getCurrentUser } from '../../../../commons/user.service';

class UserEditForm extends Component {
    constructor(props) {
        super(props);

        this._userId = this.props.user.id;
        this.state = {
            email: this.props.user.email,
            role: this.props.user.role,
            name: this.props.user.name
        };
        this._updateParent = this.props.updateParent;
    }

    handleInputChange = ({ target: { value, name }}) => {
        this.setState({
            [name]: value
        })
      }

    updateUser = async () => {
        await apiClient.modifyUser(this._userId, this.state);
        this._updateParent();
    }
    
    deleteUser = async () => {
        await apiClient.deleteUser(this._userId);
        this._updateParent();
    }

    render = () => {
        return (
            <Form as={Table.Row} className='action-row'>
                <Table.Cell>
                    <Input 
                        name='name'
                        transparent
                        focus
                        fluid
                        autoComplete="new-password"
                        defaultValue={this.state.name} 
                        onBlur={
                            async (event) => {
                                await this.handleInputChange(event);
                                await this.updateUser(event);
                            }                   
                        }
                    ></Input>
                </Table.Cell>
                <Table.Cell>
                    <Input 
                        name='email'
                        type='email'
                        transparent
                        focus
                        fluid
                        disabled
                        autoComplete="new-password"
                        defaultValue={this.state.email} 
                        onBlur={
                            async (event) => {
                                await this.handleInputChange(event);
                                await this.updateUser(event);
                            }                   
                        }
                    ></Input>
                </Table.Cell>
                <Table.Cell>
                    <Dropdown 
                        name='role'
                        onChange={
                            async (event, target) => {
                                await this.handleInputChange({target});
                                await this.updateUser(event);
                            }                   
                        }
                        compact 
                        defaultValue={this.state.role} 
                        selection 
                        options={
                            Object.values(UserRoles).map(
                                (role) => (
                                    { 
                                        key: role, 
                                        text: getViewReadyUserRole(role), 
                                        value: role 
                                    }
                                )
                            )
                        }
                    />
                </Table.Cell>
                <Table.Cell>
                    <Button 
                        icon 
                        color='red' 
                        onClick={this.deleteUser}
                        disabled={this._userId === getCurrentUser().id}
                    >
                        <Icon name='ban' />
                    </Button>
                </Table.Cell>
            </Form>
        );
    }
}

export default UserEditForm;
