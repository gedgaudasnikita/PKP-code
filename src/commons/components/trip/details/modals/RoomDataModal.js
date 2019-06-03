import React, { Component } from 'react';
import { Table, Button, Radio, Modal, Dropdown } from 'semantic-ui-react';

import FormattedPrice from '../../../FormattedPrice';
import File from '../../../File';
import apiClient from '../../../../api.client';

import { getCurrentUser } from '../../../../user.service';

import CurrencyInput from 'react-currency-input';

class RoomData extends Component {
    constructor(props) {
        super(props);

        const { roomData = {} } = this.props;
        this.state = {
            isDevbridgeRoom: roomData.isDevbridgeRoom,
            price: roomData.price,
            roomId: roomData.roomId,
            apartmentId: roomData.apartmentId,
            filename: roomData.filename,
            fileForUpload: null,
            apartments: [],
            rooms: []
        }
    }

    componentDidMount = async () => {
        const apartments = await apiClient.getApartments(this.props.trip.endOffice.id);
        
        let rooms = []
        if (this.state.apartmentId) {
            rooms = await apiClient.getRooms(
                this.props.trip.endOffice.id,
                this.state.apartmentId,
                {
                    freeFrom: this.props.trip.startDate,
                    freeTo: this.props.trip.endDate
                }
            );
        }
        
        this.setState({ apartments, rooms });
    }

    _buildRow(name, value) {
        return (
            <Table.Row key={name}>
                <Table.Cell active><b>{name}</b></Table.Cell>
                <Table.Cell>{value}</Table.Cell>
            </Table.Row>
        )
    }

    _handleInputChange = async ({ target: { value, name }}) => {
        const state = {
            ...this.state,
            [name]: value
        }

        let rooms = [];

        if (state.apartmentId) {
            rooms = await apiClient.getRooms(
                this.props.trip.endOffice.id,
                state.apartmentId,
                {
                    freeFrom: this.props.trip.startDate,
                    freeTo: this.props.trip.endDate
                }
            );
        }

        this.setState({
            [name]: value,
            rooms
        });
    }

    _isStateReadyForSaving() {
        const {
            isDevbridgeRoom,
            price,
            roomId,
            apartmentId
        } = this.state;

        return isDevbridgeRoom ? roomId && apartmentId : price;
    }

    render() {
        const { mode, user, trip, onUpdate } = this.props;
        const roomData = this.state;
        const { apartments, rooms } = roomData;

        const editable = [ 'edit', 'create' ].includes(mode);
        
        return (
            <div>
                <Table>
                    <Table.Body>
                        {
                            [
                                ...(
                                    editable
                                        ? 
                                            [
                                                this._buildRow('DevBridge apartamentai', 
                                                    <Radio checked={roomData.isDevbridgeRoom} name='isDevbridgeRoom' toggle onChange={(event, target) => {
                                                        const adaptedTarget = {
                                                            ...target,
                                                            value: target.checked
                                                        };

                                                        this._handleInputChange({ target: adaptedTarget });
                                                    }}/>
                                                )
                                            ]
                                        : 
                                            []
                                ),
                                ...(roomData.isDevbridgeRoom
                                    ?
                                        [
                                            this._buildRow('Apartamentai', 
                                                editable
                                                    ?
                                                        <Dropdown 
                                                            name='apartmentId'
                                                            onChange={
                                                                async (event, target) => {
                                                                    await this._handleInputChange({ target });
                                                                }                   
                                                            }
                                                            compact 
                                                            defaultValue={this.state.apartmentId} 
                                                            selection 
                                                            placeholder='Pasirinkti apartamentus'
                                                            clearable
                                                            disabled={apartments.length === 0}
                                                            loading={apartments.length === 0}
                                                            options={
                                                                apartments.map((apartment) => ({
                                                                    key: apartment.id,
                                                                    text: apartment.name,
                                                                    value: apartment.id
                                                                }))
                                                            }
                                                        />
                                                    :
                                                        this.state.apartment ? this.state.apartment.name : ''
                                            ),
                                            this._buildRow('Kambario numeris', 
                                                editable
                                                    ?
                                                        <Dropdown 
                                                            name='roomId'
                                                            onChange={
                                                                async (event, target) => {
                                                                    await this._handleInputChange({ target });
                                                                }                   
                                                            }
                                                            compact 
                                                            defaultValue={this.state.roomId || null} 
                                                            selection 
                                                            placeholder='Pasirinkti kambarį'
                                                            clearable
                                                            disabled={rooms.length === 0}
                                                            loading={rooms.length === 0}
                                                            options={
                                                                rooms.map((room) => ({
                                                                    key: room.id,
                                                                    text: room.roomNumber,
                                                                    value: room.id
                                                                }))
                                                            }
                                                        />
                                                    :
                                                        roomData.roomNumber
                                                ),
                                        ]
                                    :
                                        [
                                            this._buildRow('Kaina', 
                                                editable
                                                    ?
                                                        <CurrencyInput name='price' prefix='$' value={roomData.price / 100} onChangeEvent={(event, maskedValue, floatValue) => {
                                                            const adaptedTarget = {
                                                                name: 'price',
                                                                value: floatValue * 100
                                                            }
                                                            
                                                            this._handleInputChange({ target: adaptedTarget });
                                                        }}/>
                                                    :
                                                        <FormattedPrice priceInCents={roomData.price}/>),
                                            this._buildRow('Rezervacijos patvirtinimas', 
                                                <File 
                                                    editable={editable} 
                                                    filename={roomData.filename} 
                                                    downloadAction={() => apiClient.getRoomFile(trip.id, user.id)}
                                                    removeAction={async () => {
                                                        await apiClient.deleteRoomDataFile(trip.id, user.id);
        
                                                        this._handleInputChange({
                                                            target: {
                                                                name: 'filename',
                                                                value: null
                                                            }
                                                        });
                                                    }}
                                                    uploadAction={async (event) => {
                                                        const file = event.target.files[0];
                                                        let fileForUpload;
                                                        await new Promise((resolve) => {
                                                            const fileReader = new FileReader();
                                                            fileReader.onloadend = async () => {
                                                                fileForUpload = fileReader.result;
                                                                resolve();
                                                            }
                                                            fileReader.readAsText(file);    
                                                        });

                                                        this.setState({
                                                            fileForUpload: fileForUpload,
                                                            filename: file.name
                                                        })
                                                    }}
                                                />)
                                        ]
                                )
                            ]
                        }
                    </Table.Body>
                </Table>
                { 
                    mode === 'edit'
                        ?
                            <Button.Group fluid>
                                <Button 
                                    onClick={async () => {
                                        await apiClient.modifyRoomData(trip.id, user.id, {
                                            isDevbridgeRoom: !!this.state.isDevbridgeRoom,
                                            price: this.state.price,
                                            apartment: this.state.apartment,
                                            filename: this.state.filename,
                                            roomId: this.state.roomId
                                        });

                                        if (this.state.filename === null && this.state.fileForUpload === null) {
                                            await apiClient.deleteCarDataFile(trip.id, user.id);
                                        } else if (this.state.filename !== null && this.state.fileForUpload !== null) {
                                            await apiClient.uploadRoomFile(trip.id, user.id, this.state.fileForUpload, this.state.filename);
                                        }
                                        onUpdate();
                                    }}
                                    disabled={!this._isStateReadyForSaving()} 
                                    positive>Išsaugoti</Button>
                                <Button 
                                    onClick={async () => {
                                        await apiClient.deleteRoomData(user.id, trip.id,  {
                                            isDevbridgeRoom: !!this.state.isDevbridgeRoom,
                                            price: this.state.price,
                                            apartment: this.state.apartment,
                                            filename: this.state.filename,
                                            roomId: this.state.roomId
                                        });
                                        onUpdate();
                                    }}
                                    negative>Ištrinti</Button>
                            </Button.Group>
                        :
                            ''
                }
                { 
                    mode === 'create'
                        ?
                            <Button.Group fluid>
                                <Button 
                                    onClick={async () => {
                                        await apiClient.createRoomData(trip.id, user.id, {
                                            isDevbridgeRoom: !!this.state.isDevbridgeRoom,
                                            price: this.state.price,
                                            apartment: this.state.apartment,
                                            filename: this.state.filename,
                                            roomId: this.state.roomId
                                        });

                                        if (this.state.filename !== null && this.state.fileForUpload !== null) {
                                            await apiClient.uploadRoomFile(trip.id, user.id, this.state.fileForUpload, this.state.filename);
                                        }

                                        onUpdate();
                                    }}
                                    disabled={!this._isStateReadyForSaving()} positive>Sukurti</Button>
                            </Button.Group>
                        :
                            ''
                }
            </div>
        );
    }
}

class RoomDataModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false
        }
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    _getRoomData(user, trip) {
        if (!trip.room) {
            return null;
        }

        return trip.room.find(({ guest }) => guest.id === user.id);
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    openModal = () => {
        this.setState({ showModal: true })
    }

    render() {  
        const { 
            trip,
            user,
            viewOnly
        } = this.props;

        const onUpdate = () => {
            this.closeModal();
            this.props.onUpdate();
        }

        const roomData = this._getRoomData(user, trip);

        const organizerView = trip ? trip.organizer.id === getCurrentUser().id : null;

        return (
            roomData
            ?
                <Modal
                    onClose={this.closeModal}
                    open={this.state.showModal}
                    trigger={<Button 
                        compact 
                        circular 
                        icon='home'
                        onClick={this.openModal}
                    />}
                >
                    <Modal.Header>Vartotojo {user.name} apgyvendinimas</Modal.Header>
                    <Modal.Content>
                        <RoomData onUpdate={onUpdate} trip={trip} user={user} mode={ viewOnly ? 'view' : organizerView ? 'edit' : 'view' } roomData={roomData}/>
                    </Modal.Content>
                </Modal>
            : 
                organizerView && !viewOnly
                    ? <Modal  
                        onClose={this.closeModal}
                        open={this.state.showModal}
                        trigger={<Button 
                            compact 
                            circular 
                            icon='plus'
                            onClick={this.openModal}
                        />}
                    >
                        <Modal.Header>Pridėti apgyvendinimą vartotojui {user.name}</Modal.Header>
                        <Modal.Content>
                            <RoomData onUpdate={onUpdate} trip={trip} user={user} mode='create'/>
                        </Modal.Content>
                    </Modal>
                    : <Button disabled compact circular icon='minus'/>
        )
    }
}

export default RoomDataModal;