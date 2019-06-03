import React, { Component } from 'react';

import {
    Loader,
    Header,
    Segment,
    Button
} from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import apiClient from '../../../../commons/api.client';
import RSVPActions from '../RSVPActions';
import TripGeneralInfo from './TripGeneralInfo';
import TripParticipantInfo from './TripParticipantInfo';
import TripControlListModal from './modals/TripControlListModal';
import SimilarTripsModal from './modals/SimilarTripsModal';
import { getCurrentUser } from '../../../user.service';

class TripDetailsView extends Component {
    constructor(props) {
        super(props);

        this._tripId = this.props.match.params.tripId;

        this.state = {
            trip: null
        }
    }

    retrieveTrip = async (tripId) => {
        const trip = await apiClient.getTrip(tripId);
        this.setState({ trip });
    }
    
    componentDidMount = async () => {
        await this.retrieveTrip(this._tripId);
    }

    render() {
        if (this.state.navigate) {
            return <Redirect push to={this.state.navigate} />;
        }

        const { trip } = this.state;

        const viewingAsInvited = trip ? trip.participation.find(({ user }) => user.id === getCurrentUser().id) : false;
        const viewingAsOrganizer = trip ? trip.organizer.id === getCurrentUser().id : false;

        return (
            trip
            ?
                <div>
                    <div>
                        <Header style={{display: 'inline-block'}} size='large'>Kelionės detalės</Header>
                        {
                            viewingAsOrganizer
                                ?
                                    <TripControlListModal style={{ float: 'right' }} trip={trip} onUpdate={() => this.retrieveTrip(trip.id)}/>
                                :
                                    ''
                        }
                    </div>
                    
                    <TripGeneralInfo trip={trip} onUpdate={() => this.retrieveTrip(trip.id)}/>      
                    <TripParticipantInfo trip={trip} onUpdate={() => this.retrieveTrip(trip.id)}/>
                    {
                        viewingAsInvited
                            ?
                                <Segment>
                                    Kelionė iš {trip.startOffice ? trip.startOffice.name : '-'} į {trip.endOffice ? trip.endOffice.name : '-'} organizuojama <b>{trip.organizer.name}</b> (<a href={'mailto:'+trip.organizer.email}>{trip.organizer.email}</a>). Jūs galite
                                    <RSVPActions trip={trip} onAction={() => this.retrieveTrip(trip.id)}/>
                                </Segment>
                            :
                                ''
                    }  
                    {
                        viewingAsOrganizer
                            ? <SimilarTripsModal trip={trip} onUpdate={() => this.retrieveTrip(trip.id)}/>
                            : ''
                    }
                    {
                        viewingAsOrganizer
                            ? 
                                trip.isCancelled
                                    ?
                                        <Button positive floated='right' onClick={async () => {
                                            await apiClient.modifyTrip(trip.id, {
                                                ...trip,
                                                isCancelled: false
                                            });

                                            this.setState({
                                                navigate: '/organize'
                                            });
                                        }}>
                                            Atkurti kelionę
                                        </Button>
                                    :
                                        <Button negative floated='right' onClick={async () => {
                                            await apiClient.modifyTrip(trip.id, {
                                                ...trip,
                                                isCancelled: true
                                            });

                                            this.setState({
                                                navigate: '/organize'
                                            });
                                        }}>
                                            Atšaukti kelionę
                                        </Button>
                            : ''
                    }
                </div>
            : 
                <Loader active inline='centered'/>
        )
    }
}

export default TripDetailsView;
