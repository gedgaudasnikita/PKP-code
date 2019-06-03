import React, { Component } from 'react';
import { Input, Modal, Dropdown, Button, Icon } from 'semantic-ui-react';

import apiClient from '../../../../commons/api.client';

class ApartmentAddModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            offices: []
        };
        this._updateParent = this.props.updateParent;
    }

    componentDidMount = async () => {
        const offices = await apiClient.getOffices();

        this.setState({ offices });
    }

    handleInputChange = async ({ target: { name, value }}) => {
        await this.setState({ 
            [name]: value 
        });
    }

    saveApartment = async () => {
        const apartment = {
            name: this.state.name,
            address: this.state.address,
            officeId: this.state.officeId
        }
        await apiClient.createApartment(this.state.officeId, apartment);
        this._updateParent();
        this.closeModal();
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    isStateReadyForSaving = () => {
        return this.state.address && this.state.officeId;
    }

    render() {
        const { offices } = this.state;

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
                        Pridėti apartamentus
                    </Button>
                }
            >
                <Modal.Header>Pridėti apartamentus</Modal.Header>
                <Modal.Content>
                    <Input 
                        fluid
                        name='name'
                        placeholder='Įveskite naujų apartamentų pavadinimą.'
                        onBlur={
                            async (event) => {
                                await this.handleInputChange(event);
                            }                   
                        }
                    ></Input><br/>
                    <Input 
                        fluid
                        name='address'
                        placeholder='Įveskite naujų apartamentų adresą.'
                        onBlur={
                            async (event) => {
                                await this.handleInputChange(event);
                            }                   
                        }
                    ></Input>
                    <br/>
                    <Dropdown 
                        name='officeId'
                        onChange={
                            async (event, target) => {
                                await this.handleInputChange({ target });
                            }                   
                        } 
                        defaultValue={this.state.officeId || null} 
                        selection 
                        disabled={offices.length === 0}
                        loading={offices.length === 0}
                        options={
                            offices.map((office) => ({
                                key: office.id,
                                text: office.name,
                                value: office.id
                            }))
                        }
                    /><br/><br/>
                    <Button disabled={!this.isStateReadyForSaving()} fluid color='green' onClick={this.saveApartment}>Išsaugoti</Button>
                </Modal.Content>
            </Modal>
        );
    }
}

export default ApartmentAddModal;
