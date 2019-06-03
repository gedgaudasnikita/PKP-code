import React, { Component } from 'react';

import {
    Button,
    Icon,
    Segment
} from 'semantic-ui-react';

import ParticipationStatuses from '../../../enums/participation.statuses';
import { getCurrentUser } from '../../user.service';
import apiClient from '../../api.client';

class RSVPActions extends Component {
    makeAcceptAction(tripId, minimal = false, onAction) {
        return minimal
            ?
            (
                <Button 
                    positive 
                    compact 
                    data-tooltip='Patvirtinti dalyvavimą'
                    icon='check'
                    onClick={async (e) => {
                        e.stopPropagation();
                        await apiClient.acceptTrip(tripId);
                        await onAction();
                    }}
                />
            )
            :
            (
                <Button 
                    positive 
                    compact 
                    onClick={async (e) => {
                        e.stopPropagation()
                        await apiClient.acceptTrip(tripId);
                        await onAction();
                    }}
                ><Icon name='check'/>Patvirtinti dalyvavimą</Button>
            )
    }

    makeRejectAction(tripId, minimal = false, onAction) {
        return minimal
            ?
                (
                    <Button 
                        negative 
                        compact 
                        icon='remove'
                        data-tooltip='Atšaukti dalyvavimą'
                        onClick={async (e) => {
                            e.stopPropagation()
                            await apiClient.rejectTrip(tripId);
                            await onAction();
                        }}
                    />
                )
            :
                (
                    <Button 
                        negative 
                        compact 
                        onClick={async (e) => {
                            e.stopPropagation()
                            await apiClient.rejectTrip(tripId);
                            await onAction();
                        }}
                    ><Icon name='remove'/>Atšaukti dalyvavimą</Button>
                )
    } 

    render() {
        const { trip, minimal, onAction } = this.props;
        const relevantParticipation = trip.participation.find(({ user }) => user.id === getCurrentUser().id);

        return (
            <Segment compact>
                {
                    [
                        ParticipationStatuses.ACCEPTED,
                        ParticipationStatuses.PENDING
                    ].includes(relevantParticipation.participationStatus)
                        ? this.makeRejectAction(trip.id, minimal, onAction)
                        : ''
                }
                {
                    [
                        ParticipationStatuses.REJECTED,
                        ParticipationStatuses.PENDING
                    ].includes(relevantParticipation.participationStatus)
                        ? this.makeAcceptAction(trip.id, minimal, onAction)
                        : ''
                }
            </Segment>
        );
    }
}

export default RSVPActions;
