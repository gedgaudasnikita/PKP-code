import React, { Component } from 'react';
import { Input, Modal, Table, Button, Icon } from 'semantic-ui-react';

import apiClient from '../../../../commons/api.client';

class RoomManageModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            rooms: []
        };
        this._updateParent = this.props.updateParent;
    }

    reload = async () => {
        const rooms = await apiClient.getRooms(this.props.officeId, this.props.apartmentId);

        this.setState({ rooms });
    }

    componentDidMount = async () => {
        await this.reload();
    }

    handleInputChange = async ({ target: { name, value }}) => {
        await this.setState({ 
            [name]: value 
        });
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    render() {
        const { rooms } = this.state;

        return (
            <Modal 
                closeIcon 
                onClose={this.closeModal}
                open={this.state.showModal}
                trigger={
                    <Button 
                        icon='pencil'
                        content='Valdyti kambarius'
                        label={{ content: rooms.length }}
                        labelPosition='left'
                        onClick={
                            () => this.setState({ showModal: true })
                        }/>      
                }
            >
                <Modal.Header>Valdyti kambarius</Modal.Header>
                <Modal.Content>
                    <Table>
                        <Table.Header>
                            <Table.Row className='action-row'>
                                <Table.HeaderCell>Kambario numeris</Table.HeaderCell>
                                <Table.HeaderCell>
                                    <Button icon='plus' onClick={async () => {
                                        await apiClient.createRoom(this.props.officeId, this.props.apartmentId, {
                                            apartmentId: this.props.apartmentId,
                                            roomNumber: this._getNextNumber(rooms)
                                        });

                                        await this.reload();
                                        await this._updateParent();
                                    }}/>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                rooms.map((room) => (
                                    <Table.Row key={room.id} className='action-row'>
                                        <Table.Cell>
                                            <Input 
                                                name='roomNumber'
                                                transparent
                                                focus
                                                fluid
                                                autoComplete="new-password"
                                                defaultValue={room.roomNumber} 
                                                onBlur={
                                                    async ({ target: { value }}) => {
                                                        await apiClient.modifyRoom(
                                                            this.props.officeId,
                                                            this.props.apartmentId,
                                                            room.id, 
                                                            {
                                                                id: room.id,
                                                                apartmentId: this.props.apartmentId,
                                                                roomNumber: value
                                                            }
                                                        );

                                                        await this.reload();
                                                        await this._updateParent();
                                                    }                   
                                                }
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button icon color='red' onClick={async () => {
                                                await apiClient.deleteRoom(
                                                    this.props.officeId,
                                                    this.props.apartmentId,
                                                    room.id
                                                );

                                                await this.reload();
                                                await this._updateParent();
                                            }}>
                                                <Icon name='ban' />
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </Table.Body>
                    </Table>
                </Modal.Content>
            </Modal>
        );
    }

    _getNextNumber(rooms) {
        if (rooms.length > 0) {
            return Math.max(
                ...rooms.map(({ roomNumber }) => roomNumber)
            ) + 1;
        } else {
            return 1;
        }
    }
}

export default RoomManageModal;
