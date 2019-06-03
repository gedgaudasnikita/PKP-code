import React, { Component } from 'react';

import {
    Table, Button
} from 'semantic-ui-react';

import UserAvatar from '../../UserAvatar';
import CarDataModal from './modals/CarDataModal';
import RoomDataModal from './modals/RoomDataModal';
import FlightDataModal from './modals/FlightDataModal';

import apiClient from '../../../api.client';
import ParticipantAddModal from './modals/ParticipantAddModal';

import { getCurrentUser } from '../../../user.service';

class TripParticipantInfo extends Component {
    render() {
        const { trip, onUpdate } = this.props;
        
        const organizerView = trip ? trip.organizer.id === getCurrentUser().id : null;
        
        return (
            <Table>
                <Table.Header>
                    <Table.Row className='action-row'>
                        <Table.HeaderCell>Keliautojas</Table.HeaderCell>
                        <Table.HeaderCell>Automobilis</Table.HeaderCell>
                        <Table.HeaderCell>Apgyvendinimas</Table.HeaderCell>
                        <Table.HeaderCell>Skrydžiai</Table.HeaderCell>
                        <Table.HeaderCell>
                            <ParticipantAddModal trip={trip} onUpdate={onUpdate}/>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        trip.participation.map(
                            ({ user, participationStatus }) => (
                                <Table.Row key={user.id} className='action-row'>
                                    <Table.Cell>
                                        <UserAvatar user={user} status={participationStatus}/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <CarDataModal trip={trip} user={user} onUpdate={onUpdate}/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <RoomDataModal trip={trip} user={user} onUpdate={onUpdate}/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <FlightDataModal trip={trip} user={user} onUpdate={onUpdate}/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            compact
                                            negative
                                            disabled={!organizerView}
                                            icon='remove'
                                            data-tooltip='Pašalinti keliautoją'
                                            onClick={
                                                async () => {
                                                    await apiClient.removeParticipant(trip.id, user.id);
                                                    onUpdate();
                                                }
                                            }
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            )
                        )
                    }
                </Table.Body>
            </Table>
        );
    }
}

export default TripParticipantInfo;
