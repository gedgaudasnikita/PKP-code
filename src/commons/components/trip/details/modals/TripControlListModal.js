import React, { Component } from 'react';

import {
    Table,
    Checkbox,
    Modal,
    Segment,
    Button,
    Icon,
    Popup
} from 'semantic-ui-react';

import apiClient from '../../../../api.client';

import { isControlListComplete } from '../../../../../utils/control.list';

class TripControlList extends Component {
    constructor(props) {
        super(props);

        this.state = this.props.trip.controlList;
    }

    _handleInputChange = ({ target: { value, name }}) => {
        this.setState({
            [name]: value
        });
    }

    _buildRow(controlList, necessityAttrName, completenessAttrName, label) {
        return <Segment>
            <Checkbox 
                name={completenessAttrName}
                disabled={!controlList[necessityAttrName]} 
                checked={controlList[completenessAttrName]} 
                label={label}
                onChange={(event, target) => {
                    const adaptedTarget = {
                        ...target,
                        value: target.checked
                    };

                    this._handleInputChange({ target: adaptedTarget });
                }}
            />
            <Popup 
                content='Ar aktualu kelionei'
                trigger={
                    <Checkbox 
                        name={necessityAttrName}
                        style={{ float: 'right' }} 
                        checked={controlList[necessityAttrName]} 
                        toggle 
                        onChange={(event, target) => {
                            const adaptedTarget = {
                                ...target,
                                value: target.checked
                            };
        
                            this._handleInputChange({ target: adaptedTarget });
                        }}
                    />
                }
            />
        </Segment>
    }

    render() {
        const { onUpdate } = this.props;
        const controlList = this.state;

        return (
            <div>
                <Segment.Group>
                    {this._buildRow(controlList, 'isCarRequired', 'isCarRented', 'Automobiliai išnuomoti')}
                    {this._buildRow(controlList, 'areTicketsRequired', 'areTicketsBought', 'Lėktuvų bilietai nupirkti')}
                    {this._buildRow(controlList, 'isAccommodationRequired', 'isAccommodationRented', 'Apgyvendinimas organizuotas')}
                </Segment.Group>
                <Button 
                    fluid 
                    positive
                    onClick={async () => {
                        await apiClient.modifyTrip(this.props.trip.id, {
                            ...this.props.trip,
                            ...this.state
                        });
                        onUpdate();
                    }}
                >Išsaugoti</Button>
            </div>
        );
    }
}

class TripControlListModal extends Component {
    constructor(props) {
        super(props);

        this._tripId = this.props.trip.id;
        this.state = {
            closeModal: false
        }
    }

    buildRow(name, value) {
        return (
            <Table.Row>
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

    closeModal = () => {
        this.setState({ showModal: false })
    }

    openModal = () => {
        this.setState({ showModal: true })
    }

    render() {
        const { onUpdate } = this.props;
        const { controlList } = this.props.trip;
        const controlListComplete = isControlListComplete(controlList);
        
        return (
            <Modal  
                onClose={this.closeModal}
                open={this.state.showModal}
                trigger={
                    <Popup 
                        content='Peržiūrėti kontrolinį sąrašą'
                        trigger={
                            <Button 
                                style={this.props.style}
                                circular
                                color={
                                    this.props.trip.isCancelled
                                        ? 'red'
                                        :
                                            controlListComplete 
                                                ? 'green'
                                                : 'yellow'
                                }
                                icon
                                onClick={this.openModal}
                                labelPosition='right'
                            >
                                <Icon name={
                                    this.props.trip.isCancelled
                                        ? 'remove'
                                        :
                                            controlListComplete 
                                                ? 'check'
                                                : 'pencil'
                                }/>
                                {
                                    this.props.trip.isCancelled
                                        ? 'Kelionė atšaukta'
                                        :
                                            controlListComplete
                                                ? 'Kelionė pilnai paruošta'
                                                : 'Kelionė ruošiama'
                                }
                            </Button>
                        }
                    />
                }
            >
                <Modal.Header>Kontrolinis sąrašas</Modal.Header>
                <Modal.Content>
                    <TripControlList trip={this.props.trip} onUpdate={async () => {
                        await onUpdate();
                        this.closeModal();
                    }}/>
                </Modal.Content>
            </Modal>
        );
    }
}

export default TripControlListModal;
