import React, { Component } from 'react';
import { Input, Modal, Button, Icon } from 'semantic-ui-react';

import apiClient from '../../../../commons/api.client';

class OfficeAddModal extends Component {
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

    saveOffice = async () => {
        const office = {
            name: this.state.name,
            address: this.state.address,
        }
        await apiClient.createOffice(office);
        this._updateParent();
        this.closeModal();
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    isStateReadyForSaving = () => {
        return this.state.name;
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
                        Pridėti ofisą
                    </Button>
                }
            >
                <Modal.Header>Pridėti ofisą</Modal.Header>
                <Modal.Content>
                    <Input 
                        fluid
                        name='name'
                        placeholder='Įveskite naujo ofiso pavadinimą.'
                        onBlur={
                            async (event) => {
                                await this.handleInputChange(event);
                            }                   
                        }
                    ></Input><br/>
                    <Input 
                        fluid
                        name='address'
                        placeholder='Įveskite naujo ofiso adresą.'
                        onBlur={
                            async (event) => {
                                await this.handleInputChange(event);
                            }                   
                        }
                    ></Input>
                    <br/>
                    <Button disabled={!this.isStateReadyForSaving()} fluid color='green' onClick={this.saveOffice}>Išsaugoti</Button>
                </Modal.Content>
            </Modal>
        );
    }
}

export default OfficeAddModal;
