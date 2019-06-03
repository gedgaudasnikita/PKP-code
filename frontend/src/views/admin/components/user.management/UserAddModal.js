import React, { Component } from 'react';
import { Input, Dropdown, Modal, Button, Icon } from 'semantic-ui-react';

import { getViewReadyUserRole } from '../../../../utils/translation/user.role';
import UserRoles from '../../../../enums/user.roles';

import apiClient from '../../../../commons/api.client';

class UserAddModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false
        };
        this._updateParent = this.props.updateParent;
    }

    handleInputChange = async ({ target: { name, value }}) => {
        await this.setState({ 
            [name]: value 
        });
    }

    saveUser = async () => {
        const user = {
            email: this.state.email,
            name: this.state.name,
            role: this.state.role,
        }
        await apiClient.addUser(user);
        this._updateParent();
        this.closeModal();
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    isStateReadyForSaving = () => {
        return this.state.name && this.state.role && this.state.email && /\S+@\S+\.\S+/g.test(this.state.email)
    }

    render() {
        return (
            <Modal 
                closeIcon 
                onClose={this.closeModal}
                open={this.state.showModal}
                trigger={
                    <Button 
                        labelPosition='right' 
                        icon 
                        onClick={
                            () => this.setState({ showModal: true })
                        } >
                        <Icon name='plus'/>
                        Pridėti vartotoją
                    </Button>
                }
            >
                <Modal.Header>Pridėti vartotoją</Modal.Header>
                <Modal.Content>
                    <Input 
                        fluid
                        name='name'
                        placeholder='Įveskite naujo vartotojo vardą.'
                        onBlur={
                            async (event) => {
                                await this.handleInputChange(event);
                            }                   
                        }
                    ></Input><br/>
                    <Input 
                        fluid
                        name='email'
                        type='email'
                        placeholder='Įveskite naujo vartotojo el. pašto adresą.'
                        onBlur={
                            async (event) => {
                                await this.handleInputChange(event);
                            }                   
                        }
                    ></Input><br/>
                    <Dropdown 
                        name='role'
                        fluid 
                        placeholder='Pasirinkite naujo vartotojo galimybių lygį.'
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
                        onChange={
                            async (event, target) => {
                                await this.handleInputChange({target});
                            }                   
                        }
                    />
                    <br/>
                    <Button disabled={!this.isStateReadyForSaving()} fluid color='green' onClick={this.saveUser}>Išsaugoti</Button>
                </Modal.Content>
            </Modal>
        );
    }
}

export default UserAddModal;
