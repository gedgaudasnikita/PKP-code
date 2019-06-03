import React, { Component } from 'react';
import { Table, Input, Button, Dropdown, Form, Icon } from 'semantic-ui-react';

import apiClient from '../../../../commons/api.client';

import RoomManageModal from './RoomManageModal';

class ApartmentEditForm extends Component {
    constructor(props) {
        super(props);

        this._apartmentId = this.props.apartment.id;
        this.state = {
            address: this.props.apartment.address,
            name: this.props.apartment.name,
            officeId: this.props.apartment.officeId,
            offices: []
        };
        this._updateParent = this.props.updateParent;
    }

    componentDidMount = async () => {
        const offices = await apiClient.getOffices();
        this.setState({ offices });
    }

    handleInputChange = ({ target: { value, name }}) => {
        this.setState({
            [name]: value
        })
      }

    updateApartment = async () => {
        await apiClient.modifyApartment(this.state.officeId, this._apartmentId, {
            address: this.state.address,
            name: this.state.name,
            officeId: this.state.officeId
        });
        this._updateParent();
    }
    
    deleteApartment = async () => {
        await apiClient.deleteApartment(this.state.officeId, this._apartmentId);
        this._updateParent();
    }

    render = () => {
        const { 
            offices
        } = this.state;

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
                                await this.updateApartment(event);
                            }                   
                        }
                    ></Input>
                </Table.Cell>
                <Table.Cell>
                    <Input 
                        name='address'
                        transparent
                        focus
                        fluid
                        autoComplete="new-password"
                        defaultValue={this.state.address} 
                        onBlur={
                            async (event) => {
                                await this.handleInputChange(event);
                                await this.updateApartment(event);
                            }                   
                        }
                    ></Input>
                </Table.Cell>
                <Table.Cell>
                    <Dropdown 
                        name='officeId'
                        onChange={
                            async (event, target) => {
                                await this.handleInputChange({ target });
                                await this.updateApartment(event);
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
                    />
                </Table.Cell>
                <Table.Cell>
                        <RoomManageModal officeId={this.state.officeId} apartmentId={this._apartmentId} updateParent={this._updateParent}/>
                </Table.Cell>
                <Table.Cell>
                    <Button icon color='red' onClick={this.deleteApartment}>
                        <Icon name='ban' />
                    </Button>
                </Table.Cell>
            </Form>
        );
    }
}

export default ApartmentEditForm;
