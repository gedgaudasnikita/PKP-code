import React, { Component } from 'react';
import { Button, Table, Modal, Input } from 'semantic-ui-react';

import FormattedPrice from '../../../FormattedPrice';
import File from '../../../File';
import CurrencyInput from 'react-currency-input';

import apiClient from '../../../../api.client';

import { getCurrentUser } from '../../../../user.service';

class CarData extends Component {
    constructor(props) {
        super(props);

        const { carData = {} } = this.props;
        this.state = {
            model: carData.model,
            capacity: carData.capacity,
            price: carData.price,
            filename: carData.filename,
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
            model,
            price,
            capacity,
        } = this.state;

        return model && capacity && price;
    }

    render() {
        const { mode, user, trip, onUpdate } = this.props;
        const carData = this.state;

        const editable = [ 'edit', 'create' ].includes(mode);
        
        return (
            <div>
                <Table>
                    <Table.Body>
                        {
                            [
                                this._buildRow('Modelis', 
                                    editable
                                        ?
                                            <Input 
                                                name='model'
                                                transparent
                                                focus
                                                autoComplete="new-password"
                                                defaultValue={carData.model} 
                                                onBlur={
                                                    async (event) => {
                                                        await this._handleInputChange(event);
                                                    }                   
                                                }
                                            />
                                        :
                                            carData.model
                                ),
                                this._buildRow('Talpa', 
                                    editable
                                        ?
                                            <Input 
                                                name='capacity'
                                                transparent
                                                focus
                                                autoComplete="new-password"
                                                defaultValue={carData.capacity} 
                                                type='number'
                                                onBlur={
                                                    async (event) => {
                                                        await this._handleInputChange(event);
                                                    }                   
                                                }
                                            />
                                        :
                                            carData.model
                                ),
                                this._buildRow('Kaina', 
                                    editable
                                        ?
                                            <CurrencyInput name='price' prefix='$' value={carData.price / 100} onChangeEvent={(event, maskedValue, floatValue) => {
                                                const adaptedTarget = {
                                                    name: 'price',
                                                    value: floatValue * 100
                                                }
                                                
                                                this._handleInputChange({ target: adaptedTarget });
                                            }}/>
                                        :
                                            <FormattedPrice priceInCents={carData.price}/>),
                                this._buildRow('Rezervacijos patvirtinimas', 
                                    <File 
                                        editable={editable} 
                                        filename={carData.filename} 
                                        downloadAction={() => apiClient.getCarFile(trip.id, user.id)}
                                        removeAction={async () => {
                                            await apiClient.deleteCarDataFile(trip.id, user.id);

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
                                        await apiClient.modifyCarData(trip.id, user.id, {
                                            price: this.state.price,
                                            filename: this.state.filename,
                                            model: this.state.model,
                                            capacity: this.state.capacity
                                        });
                                        
                                        if (this.state.filename === null && this.state.fileForUpload === null) {
                                            await apiClient.deleteCarDataFile(trip.id, user.id);
                                        } else if (this.state.filename !== null && this.state.fileForUpload !== null) {
                                            await apiClient.uploadCarFile(trip.id, user.id, this.state.fileForUpload, this.state.filename);
                                        }
                                        onUpdate();
                                    }}
                                    disabled={!this._isStateReadyForSaving()} 
                                    positive>Išsaugoti</Button>
                                <Button 
                                    onClick={async () => {
                                        await apiClient.deleteCarData(user.id, trip.id);
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
                                        await apiClient.createCarData(trip.id, user.id, {
                                            price: this.state.price,
                                            filename: this.state.filename,
                                            model: this.state.model,
                                            capacity: this.state.capacity
                                        });
                                        
                                        if (this.state.filename !== null && this.state.fileForUpload !== null) {
                                            await apiClient.uploadCarFile(trip.id, user.id, this.state.fileForUpload, this.state.filename);
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

class CarDataModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false
        }
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    _getCarData(user, trip) {
        if (!trip.car) {
            return null;
        }

        return trip.car.find(({ driver }) => driver.id === user.id);
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

        const carData = this._getCarData(user, trip);

        const organizerView = trip ? trip.organizer.id === getCurrentUser().id : null;

        return (
            carData
            ?
                <Modal
                    onClose={this.closeModal}
                    open={this.state.showModal}
                    trigger={<Button 
                        compact 
                        circular 
                        icon='car'
                        onClick={this.openModal}
                    />}
                >
                    <Modal.Header>Vartotojo {user.name} nuomojamas automobilis</Modal.Header>
                    <Modal.Content>
                        <CarData onUpdate={onUpdate} trip={trip} user={user} mode={ viewOnly ? 'view' : organizerView ? 'edit' : 'view' } carData={carData}/>
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
                        <Modal.Header>Pridėti nuomojamą automobilį vartotojui {user.name}</Modal.Header>
                        <Modal.Content>
                            <CarData onUpdate={onUpdate} trip={trip} user={user} mode='create'/>
                        </Modal.Content>
                    </Modal>
                    : <Button disabled compact circular icon='minus'/>
        )
    }
}

export default CarDataModal;