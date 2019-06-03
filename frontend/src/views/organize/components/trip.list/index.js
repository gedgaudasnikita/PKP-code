import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';

import {
    Table,
    Header,
    Popup,
    Dropdown,
    Divider,
    Button,
    Icon
} from 'semantic-ui-react';

import apiClient from '../../../../commons/api.client';
import UserAvatar from '../../../../commons/components/UserAvatar';
import FormattedDate from '../../../../commons/components/FormattedDate';

import { getCurrentUser } from '../../../../commons/user.service';
import { isControlListComplete } from '../../../../utils/control.list';

class TripList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tripList: [],
            navigate: null,
            filters: {
                organizerId: getCurrentUser().id
            },
            organizers: []
        };
    }

    componentDidMount = () => {
        this.populate(this.state.filters);
    }

    isActionNeeded = (trip) => {
        return !isControlListComplete(trip.controlList);
    }

    makeParticipationRow(participation) {
        return participation.map(
            ({ user, participationStatus }, i) => 
                <UserAvatar 
                    key={user.id}
                    user={user} 
                    status={participationStatus}
                />
        );      
    }

    navigateToTrip = (tripId) => {
        return () => {
            this.setState({
                navigate: '/trips/' + tripId
            })
        }
    }

    _buildRows(trips) {
        return trips.map((trip) => (
            <Popup
                key={trip.id}
                size='tiny'
                basic
                position='bottom left'
                trigger={
                    <Table.Row 
                        warning={trip.isCancelled}
                        className='action-row' 
                        negative={this.isActionNeeded(trip)} 
                        positive={!this.isActionNeeded(trip)} 
                        onClick={this.navigateToTrip(trip.id)}
                    >
                        <Table.Cell ><FormattedDate showDaysRemaining ISODate={trip.startDate}/></Table.Cell>
                        <Table.Cell><FormattedDate ISODate={trip.endDate}/></Table.Cell>
                        <Table.Cell>{trip.startOffice ? trip.startOffice.name : '-'}</Table.Cell>
                        <Table.Cell>{trip.endOffice? trip.endOffice.name : '-'}</Table.Cell>
                        <Table.Cell><UserAvatar user={trip.organizer} verbose={true}/></Table.Cell>
                        <Table.Cell>{this.makeParticipationRow(trip.participation)}</Table.Cell>
                    </Table.Row>
                }
            >Peržiūrėti detalesnę informaciją
            </Popup>
        ))
    }

    updateFilters = async ({ target: { value, name }}) => {
        const { filters } = this.state;

        const newFilters = {
            ...filters,
            [name]: value
        };

        await this.populate(newFilters);
    }

    populate = async (filters) => {
        const { organizerId } = filters;

        const tripList = await apiClient.getTrips(organizerId);

        const allTrips = await apiClient.getTrips();
        const uniqueOrganizerIds = [
            ...new Set(allTrips.map(({ organizer }) => organizer.id))
        ];

        const organizers = uniqueOrganizerIds.map((id) => {
            const { organizer } = allTrips.find(({ organizer }) => organizer.id === id);

            return organizer;
        })

        this.setState({ 
            organizers,
            tripList,
            filters
        });
    }

    render() {
        if (this.state.navigate) {
            return <Redirect push to={this.state.navigate} />;
        }

        const selectableOrganizers = this.state.organizers.filter(({ id }) => id !== getCurrentUser().id);

        return (
            <div>
                <Header size='large'>Kelionės</Header>
                <Dropdown 
                        name='organizerId'
                        onChange={
                            (event, target) => {
                                this.updateFilters({ target });
                            }                   
                        } 
                        defaultValue={getCurrentUser().id}
                        search
                        selection 
                        placeholder='Filtruoti pagal organizatorių'
                        noResultsMessage='Tokio organizatorio nėra'
                        options={[
                            ...[
                                { 
                                    text: 'Visos kelionės', 
                                    value: null,
                                    key: 0 
                                },
                                { 
                                    text: 'Mano organizuojamos kelionės', 
                                    value: getCurrentUser().id,
                                    key: getCurrentUser().id 
                                }
                            ],
                            ...(
                                selectableOrganizers.length > 0 
                                    ?
                                        [
                                            <Divider key={-1}/>,
                                            ...selectableOrganizers
                                                .map((organizer) => ({
                                                    text: organizer.name + ' organizuojamos kelionės',
                                                    value: organizer.id,
                                                    key: organizer.id
                                                }))
                                        ]
                                    : 
                                        []
                            )
                        ]}
                    />
                    
                <Button 
                    floated='right'
                    labelPosition='right' 
                    icon 
                    onClick={
                        async () => {
                            const newTrip = {
                                organizerId: getCurrentUser().id,
                                participation: [],
                                startOffice: null,
                                endOffice: null,
                                startDate: null,
                                endDate: null,
                                isCarRequired: true,
                                areTicketsRequired: true,
                                isAccommodationRequired: true
                            };

                            const trip = await apiClient.createTrip(newTrip);
                            return this.navigateToTrip(trip.id)();
                        }
                    } >
                    <Icon name='plus'/>
                    Sukurti kelionę
                </Button>
                <Table selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Kelionės pradžia</Table.HeaderCell>
                            <Table.HeaderCell>Kelionės pabaiga</Table.HeaderCell>
                            <Table.HeaderCell>Kelionės pradžios taškas</Table.HeaderCell>
                            <Table.HeaderCell>Kelionės tikslas</Table.HeaderCell>
                            <Table.HeaderCell>Organizatorius</Table.HeaderCell>
                            <Table.HeaderCell>Dalyviai</Table.HeaderCell>
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
