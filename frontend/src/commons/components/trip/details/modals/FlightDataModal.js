import React, { Component } from 'react';
import { Button, Table, Modal } from 'semantic-ui-react';

import FormattedPrice from '../../../FormattedPrice';
import File from '../../../File';
import CurrencyInput from 'react-currency-input';

import apiClient from '../../../../api.client';

import { getCurrentUser } from '../../../../user.service';

class FlightData extends Component {
    constructor(props) {
        super(props);

        const { flightData = {} } = this.props;
        this.state = {
            price: flightData.price,
            filename: flightData.filename,
            fileForUpload: null
        }
    }

    _buildRow(name, value) {
        return (
            <Table.Row key={name}>
                <Table.Cell active><b>{name}</b></Table.Cell>
                <Table.Cell>{value}</Table.Cell>
            </Table.Row>
        )
    }

    _handleInputChange = ({ target: { value, name }}) => {
        this.setState({
            [name]: value
        });
    }

    _isStateReadyForSaving() {
        const {
            price
        } = this.state;

        return price;
    }

    render() {
        const { mode, user, trip, onUpdate } = this.props;
        const flightData = this.state;

        const editable = [ 'edit', 'create' ].includes(mode);
        
        return (
            <div>
                <Table>
                    <Table.Body>
                        {
                            [
                                this._buildRow('Kaina', 
                                    editable
                                        ?
                                            <CurrencyInput name='price' prefix='$' value={flightData.price / 100} onChangeEvent={(event, maskedValue, floatValue) => {
                                                const adaptedTarget = {
                                                    name: 'price',
                                                    value: floatValue * 100
                                                }
                                                
                                                this._handleInputChange({ target: adaptedTarget });
                                            }}/>
                                        :
                                            <FormattedPrice priceInCents={flightData.price}/>),
                                this._buildRow('Rezervacijos patvirtinimas', 
                                    <File 
                                        editable={editable} 
                                        filename={flightData.filename} 
                                        downloadAction={() => apiClient.getFlightFile(trip.id, user.id)}
                                        removeAction={async () => {
                                            this.setState({
                                                fileForUpload: null,
                                                filename: null
                                            })
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
                                    />
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
                                        await apiClient.modifyFlightData(trip.id, user.id, {
                                            price: this.state.price,
                                            filename: this.state.filename
                                        });

                                        if (this.state.filename === null && this.state.fileForUpload === null) {
                                            await apiClient.deleteFlightDataFile(trip.id, user.id);
                                        } else if (this.state.filename !== null && this.state.fileForUpload !== null) {
                                            await apiClient.uploadFlightFile(trip.id, user.id, this.state.fileForUpload, this.state.filename);
                                        }
                                        onUpdate();
                                    }}
                                    disabled={!this._isStateReadyForSaving()} 
                                    positive>Išsaugoti</Button>
                                <Button 
                                    onClick={async () => {
                                        await apiClient.deleteFlightData(user.id, trip.id);
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
                                        await apiClient.createFlight(trip.id, user.id, {
                                            price: this.state.price,
                                            filename: this.state.filename
                                        });

                                        if (this.state.filename !== null && this.state.fileForUpload !== null) {
                                            await apiClient.uploadFlightFile(trip.id, user.id, this.state.fileForUpload, this.state.filename);
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

class FlightDataModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false
        }
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    _getFlightData(user, trip) {
        if (!trip.flight) {
            return null;
        }

        return trip.flight.find(({ passenger }) => passenger.id === user.id);
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

        const flightData = this._getFlightData(user, trip);

        const organizerView = trip ? trip.organizer.id === getCurrentUser().id : null;

        return (
            flightData
            ?
                <Modal
                    onClose={this.closeModal}
                    open={this.state.showModal}
                    trigger={<Button 
                        compact 
                        circular 
                        icon='plane'
                        onClick={this.openModal}
                    />}
                >
                    <Modal.Header>Vartotojo {user.name} lėktuvų bilietai</Modal.Header>
                    <Modal.Content>
                        <FlightData onUpdate={onUpdate} trip={trip} user={user} mode={ viewOnly ? 'view' : organizerView ? 'edit' : 'view' } flightData={flightData}/>
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
                        <Modal.Header>Pridėti lėktuvų bilietus vartotojui {user.name}</Modal.Header>
                        <Modal.Content>
                            <FlightData onUpdate={onUpdate} trip={trip} user={user} mode='create'/>
                        </Modal.Content>
                    </Modal>
                    : <Button disabled compact circular icon='minus'/>
        )
    }
}

export default FlightDataModal;