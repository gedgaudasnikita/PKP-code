import React, { Component } from 'react';
import { Table, Input, Button, Form, Icon } from 'semantic-ui-react';

import apiClient from '../../../../commons/api.client';

class OfficeEditForm extends Component {
    constructor(props) {
        super(props);

        this._officeId = this.props.office.id;
        this.state = {
            address: this.props.office.address,
            name: this.props.office.name
        };
        this._updateParent = this.props.updateParent;
    }

    handleInputChange = ({ target: { value, name }}) => {
        this.setState({
            [name]: value
        })
      }

    updateOffice = async () => {
        await apiClient.modifyOffice(this._officeId, this.state);
        this._updateParent();
    }
    
    deleteOffice = async () => {
        await apiClient.deleteOffice(this._officeId);
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
                                await this.updateOffice(event);
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
                                await this.updateOffice(event);
                            }                   
                        }
                    ></Input>
                </Table.Cell>
                <Table.Cell>
                    <Button icon color='red' onClick={this.deleteOffice}>
                        <Icon name='ban' />
                    </Button>
                </Table.Cell>
            </Form>
        );
    }
}

export default OfficeEditForm;
