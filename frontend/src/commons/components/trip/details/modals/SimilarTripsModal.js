import React, { Component } from 'react';
import { Button, Modal, Dropdown, Icon, Table } from 'semantic-ui-react';

import _ from 'lodash';
import moment from 'moment';
import apiClient from '../../../../api.client';

import CarDataModal from './CarDataModal';
import RoomDataModal from './RoomDataModal';
import FlightDataModal from './FlightDataModal';
import UserAvatar from '../../../UserAvatar';

class SimilarTripsModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            similarTrips: [],
            tripToMerge: null,
            conflicts: []
        }
    }

    reload = async () => {
        const { trip } = this.props;
        const allTrips = await apiClient.getTrips();

        const similarTrips = allTrips.filter((tripToCompare) => {
            return tripToCompare.id !== trip.id && tripToCompare.endOffice && tripToCompare.startOffice && trip.endOffice && trip.startOffice &&
                    tripToCompare.endOffice.id === trip.endOffice.id &&
                    tripToCompare.startOffice.id === trip.startOffice.id &&
                    moment(tripToCompare.startDate).diff(trip.startDate, 'days') <= 1 &&
                    moment(tripToCompare.endDate).diff(trip.endDate, 'days') <= 1 
        })

        this.setState({ 
            similarTrips
        });
    }

    getConflicts = (trip, tripToMerge) => {
        const commonParticipation = tripToMerge.participation.filter(({ user }) => trip.participation.find(({ user: { id }}) => id === user.id));

        if (commonParticipation.length === 0) {
            return [];
        }

        const conflicts = commonParticipation.map(({ user }) => ({
            user,
            localCar: (trip.car || []).find(({ driver }) => driver.id === user.id),
            remoteCar: (tripToMerge.car || []).find(({ driver }) => driver.id === user.id),
            mergedCar: null,
            localFlight: (trip.flight || []).find(({ passenger }) => passenger.id === user.id),
            remoteFlight: (tripToMerge.flight || []).find(({ passenger }) => passenger.id === user.id),
            mergedFlight: null,
            localRoom: (trip.room || []).find(({ guest }) => guest.id === user.id),
            remoteRoom: (tripToMerge.room || []).find(({ guest }) => guest.id === user.id),
            mergedRoom: null
        }));

        const autoResolvedConflicts = conflicts.map((conflict) => ({
            ...conflict,
            mergedCar: (conflict.localCar && conflict.remoteCar) ? null : (conflict.localCar || conflict.remoteCar || null),
            mergedFlight: (conflict.localFlight && conflict.remoteFlight) ? null : (conflict.localFlight || conflict.remoteFlight || null),
            mergedRoom: (conflict.localRoom && conflict.remoteRoom) ? null : (conflict.localRoom || conflict.remoteRoom || null)
        }));

        return autoResolvedConflicts;
    }

    getUnresolvedConflicts = () => {
        const { conflicts } = this.state;

        return conflicts.filter(
            ({ 
                mergedCar, mergedFlight, mergedRoom,
                localCar, remoteCar, 
                localFlight, remoteFlight,
                localRoom, remoteRoom 
            }) => 
                (!mergedCar && !(!localCar && !remoteCar)) || 
                (!mergedFlight && !(!localFlight && !remoteFlight)) || 
                (!mergedRoom && !(!localRoom && !remoteRoom))
        );
    }

    _buildConflictRow = (conflict) => {
        const { trip } = this.props;
        const { tripToMerge } = this.state;

        return <Table.Row key={conflict.user.id}>
            <Table.Cell><UserAvatar user={conflict.user}/></Table.Cell>
            <Table.Cell><CarDataModal viewOnly={true} trip={trip} user={conflict.user}/></Table.Cell>
            <Table.Cell>
                {
                    <Button.Group>
                        <Button 
                            compact
                            icon='chevron left' 
                            active={_.isEqual(conflict.mergedCar, conflict.localCar)}
                            onClick={() => {
                                const { conflicts } = this.state;
                                
                                const conflictIndex = conflicts.findIndex(({ user }) => user.id === conflicts[0].user.id)

                                conflicts[conflictIndex].mergedCar = conflict.localCar;

                                this.setState({ conflicts });
                            }
                        }/>
                        <Button 
                            active={_.isEqual(conflict.mergedCar, conflict.remoteCar)}
                            icon='chevron right' 
                            compact
                            onClick={() => {
                                const { conflicts } = this.state;
                                    
                                const conflictIndex = conflicts.findIndex(({ user }) => user.id === conflicts[0].user.id)

                                conflicts[conflictIndex].mergedCar = conflict.remoteCar;

                                this.setState({ conflicts });
                        }}/>
                    </Button.Group>
                }
            </Table.Cell>
            <Table.Cell><CarDataModal viewOnly={true} trip={tripToMerge} user={conflict.user}/></Table.Cell>
            
            <Table.Cell><RoomDataModal viewOnly={true} trip={trip} user={conflict.user}/></Table.Cell>
            <Table.Cell>
                {
                    <Button.Group>
                        <Button 
                            icon='chevron left' 
                            compact
                            active={_.isEqual(conflict.mergedRoom, conflict.localRoom)}
                            onClick={() => {
                                const { conflicts } = this.state;
                                
                                const conflictIndex = conflicts.findIndex(({ user }) => user.id === conflicts[0].user.id)

                                conflicts[conflictIndex].mergedRoom = conflict.localRoom;

                                this.setState({ conflicts });
                            }
                        }/>
                        <Button 
                            active={_.isEqual(conflict.mergedRoom, conflict.remoteRoom)}
                            icon='chevron right' 
                            compact
                            onClick={() => {
                                const { conflicts } = this.state;
                                    
                                const conflictIndex = conflicts.findIndex(({ user }) => user.id === conflicts[0].user.id)

                                conflicts[conflictIndex].mergedRoom = conflict.remoteRoom;

                                this.setState({ conflicts });
                        }}/>
                    </Button.Group>
                }
            </Table.Cell>
            <Table.Cell><RoomDataModal viewOnly={true} trip={tripToMerge} user={conflict.user}/></Table.Cell>
        
            <Table.Cell><FlightDataModal viewOnly={true} trip={trip} user={conflict.user}/></Table.Cell>
            <Table.Cell>
                {
                    <Button.Group>
                        <Button 
                            compact
                            icon='chevron left' 
                            active={_.isEqual(conflict.mergedFlight, conflict.localFlight)}
                            onClick={() => {
                                const { conflicts } = this.state;
                                
                                const conflictIndex = conflicts.findIndex(({ user }) => user.id === conflicts[0].user.id)

                                conflicts[conflictIndex].mergedFlight = conflict.localFlight;

                                this.setState({ conflicts });
                            }
                        }/>
                        <Button 
                            compact
                            active={_.isEqual(conflict.mergedFlight, conflict.remoteFlight)}
                            icon='chevron right' 
                            onClick={() => {
                                const { conflicts } = this.state;
                                    
                                const conflictIndex = conflicts.findIndex(({ user }) => user.id === conflicts[0].user.id)

                                conflicts[conflictIndex].mergedFlight = conflict.remoteFlight;

                                this.setState({ conflicts });
                        }}/>
                    </Button.Group>
                }
            </Table.Cell>
            <Table.Cell><FlightDataModal viewOnly={true} trip={tripToMerge} user={conflict.user}/></Table.Cell>
        </Table.Row>
    }

    componentDidMount = async () => {
        this.reload();
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    closeModal = () => {
        this.setState({ showModal: false })
    }

    openModal = () => {
        this.setState({ showModal: true })
    }

    _handleInputChange = ({ target: { value, name }}) => {
        this.setState({
            [name]: value
        });
    }

    render = () => {  
        const { 
            similarTrips, 
            tripToMerge,
            conflicts
        } = this.state;

        const {
            trip,
            onUpdate
        } = this.props;

        const unresolvedConflicts = this.getUnresolvedConflicts();

        return (
            similarTrips.length === 0
                ? ''
                :
                    <Modal
                        onClose={this.closeModal}
                        open={this.state.showModal}
                        trigger={
                            <Button
                                onClick={this.openModal}
                                data-tooltip='Peržiūrėti ir sujungti panašias kelionės'
                            >Rasta {similarTrips.length} panašių kelionių</Button>
                        }
                    >
                        <Modal.Header>Sujungti kelionės</Modal.Header>
                        <Modal.Content>
                            <Dropdown 
                                name='tripToMerge'
                                onChange={
                                    async (event, target) => {
                                        if (!target.value) {
                                            return this.setState({
                                                tripToMerge: null
                                            });
                                        }

                                        const tripToMerge = similarTrips.find(({ id }) => id === target.value);
                                        const conflicts = this.getConflicts(trip, tripToMerge);
                                        
                                        this.setState({
                                            tripToMerge,
                                            conflicts
                                        });
                                    }                   
                                }
                                fluid
                                defaultValue={this.state.selectedUser ? this.state.selectedUser.id : null} 
                                selection 
                                placeholder='Pasirinkti kelionę'
                                clearable
                                selectOnBlur={false}
                                disabled={similarTrips.length === 0}
                                loading={similarTrips.length === 0}
                                options={
                                    similarTrips.map((trip) => ({
                                        key: trip.id,
                                        text: 'Vartotojo ' + trip.organizer.name + ' organizuojama kelionė',
                                        content: <div>
                                            {'Vartotojo ' + trip.organizer.name + ' organizuojama kelionė'}
                                            <Icon style={{ float: 'right' }} link name='external' onClick={
                                                async (e) => {
                                                    e.stopPropagation();
                                                    window.open('/trips/' + trip.id, '_blank').focus();
                                                }
                                            }/>
                                        </div>,
                                        value: trip.id
                                    }))
                                }
                    />
                    {
                        conflicts.length > 0
                            ?
                                <Table>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell colSpan={10}>
                                                Pasikartojantys keleiviai
                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {conflicts.map(this._buildConflictRow)}
                                    </Table.Body>
                                </Table>
                            : ''
                    }
                    {
                        tripToMerge
                            ?
                                <Button
                                    disabled={unresolvedConflicts.length > 0}
                                    positive
                                    fluid
                                    onClick={async () => {
                                        await apiClient.mergeTrips(trip.id, tripToMerge.id, conflicts);

                                        this.closeModal();
                                        onUpdate();
                                        this.reload();
                                    }}
                                >
                                    Sujungti keliones
                                </Button>
                            : ''
                    }
                </Modal.Content>
            </Modal>
        )
    }
}

export default SimilarTripsModal;