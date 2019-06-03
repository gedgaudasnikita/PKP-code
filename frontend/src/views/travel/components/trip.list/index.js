import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import {
    Table,
    Header,
    Popup
} from 'semantic-ui-react';

import apiClient from '../../../../commons/api.client';
import UserAvatar from '../../../../commons/components/UserAvatar';
import FormattedDate from '../../../../commons/components/FormattedDate';

import { getCurrentUser } from '../../../../commons/user.service';
import ParticipationStatuses from '../../../../enums/participation.statuses';

import RSVPActions from '../../../../commons/components/trip/RSVPActions';

class TripList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tripList: [],
            navigate: null
        };
    }

    updateTrips = async () => {
        const tripList = await apiClient.getTrips(null, getCurrentUser().id);
        this.setState({ tripList });
    }

    componentDidMount = async () => {
        await this.updateTrips();
    }

    isActionNeeded = (trip) => {
        console.log(trip)
        const relevantParticipation = trip.participation.find(({ user }) => user.id === getCurrentUser().id);

        return relevantParticipation && relevantParticipation.participationStatus === ParticipationStatuses.PENDING;
    }

    makeParticipationRow(participation, currentUser) {
        //avoid modification of the original array
        const localParticipation = [...participation];

        const personalParticipationIndex = localParticipation.findIndex(({ user: { id }}) => id === currentUser.id);

        const [ personalParticipationEntry ] = localParticipation.splice(personalParticipationIndex, 1);

        return [
            <UserAvatar 
                user={personalParticipationEntry.user} 
                status={personalParticipationEntry.participationStatus}
                key={personalParticipationEntry.user.id} 
            />,
            ...localParticipation.map(
                ({ user, participationStatus }, i) => 
                    <UserAvatar 
                        key={user.id}
                        user={user} 
                        status={participationStatus}
                    />
            )
        ];        
    }

    navigateToTrip = (tripId) => {
        return () => {
            this.setState({
                navigate: '/trips/' + tripId
            })
        }
    }

    _buildRows(trips) {
        const currentUser = getCurrentUser();
        return trips.map((trip, i) => (
            <Popup
                key={i}
                size='tiny'
                basic
                position='bottom left'
                trigger={
                    <Table.Row className='action-row' warning={this.isActionNeeded(trip)} onClick={this.navigateToTrip(trip.id)}>
                        <Table.Cell ><FormattedDate showDaysRemaining ISODate={trip.startDate}/></Table.Cell>
                        <Table.Cell><FormattedDate ISODate={trip.endDate}/></Table.Cell>
                        <Table.Cell>{trip.startOffice ? trip.startOffice.name : '-'}</Table.Cell>
                        <Table.Cell>{trip.endOffice? trip.endOffice.name : '-'}</Table.Cell>
                        <Table.Cell><UserAvatar user={trip.organizer} verbose={true}/></Table.Cell>
                        <Table.Cell>{this.makeParticipationRow(trip.participation, currentUser)}</Table.Cell>
                        <Table.Cell><RSVPActions trip={trip} minimal={true} onAction={() => this.updateTrips()}/></Table.Cell>
                    </Table.Row>
                }
            >Peržiūrėti detalesnę informaciją
            </Popup>
        ))
    }

    render() {
        if (this.state.navigate) {
            return <Redirect push to={this.state.navigate} />;
        }

        return (
            <div>
                <Header size='large'>Mano kelionės</Header>
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Kelionės pradžia</Table.HeaderCell>
                            <Table.HeaderCell>Kelionės pabaiga</Table.HeaderCell>
                            <Table.HeaderCell>Kelionės pradžios taškas</Table.HeaderCell>
                            <Table.HeaderCell>Kelionės tikslas</Table.HeaderCell>
                            <Table.HeaderCell>Organizatorius</Table.HeaderCell>
                            <Table.HeaderCell>Dalyviai</Table.HeaderCell>
                            <Table.HeaderCell/>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this._buildRows(this.state.tripList)}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

export default TripList;
