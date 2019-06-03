import React, { Component } from 'react';
import { Button, Modal, Dropdown, Segment, Icon } from 'semantic-ui-react';

import apiClient from '../../../../api.client';

import { getCurrentUser } from '../../../../user.service';

class ParticipantAddModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            users: [],
            selectedUser: null,
            selectedUserAvailability: null
        }
    }

    reload = async () => {
        const users = await apiClient.getUsers();

        this.setState({ 
            users: users.filter(({ id }) => !this.props.trip.participation.find(({ user }) => id === user.id))
        });
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
            [name]: value,
            selectedUserAvailability: null
        });
    }

    render() {  
        const { 
            users, 
            selectedUser, 
            selectedUserAvailability 
        } = this.state;

        const {
            trip,
            onUpdate
        } = this.props;

        const organizerView = trip ? trip.organizer.id === getCurrentUser().id : null;

        return (
            <Modal
                onClose={this.closeModal}
                open={this.state.showModal}
                trigger={
                    <Button
                        compact
                        circular
                        disabled={!organizerView}
                        onClick={this.openModal}
                        icon='plus'
                        data-tooltip='Pridėti keliautoją'
                    />
                }
            >
                <Modal.Header>Pridėti keliautoją</Modal.Header>
                <Modal.Content>
                    <Dropdown 
                        name='selectedUser'
                        onChange={
                            async (event, target) => {
                                if (!target.value) {
                                    return this.setState({
                                        selectedUser: null,
                                        selectedUserAvailability: null
                                    });
                                }

                                const selectedUser = users.find(({ id }) => id === target.value);
                                const selectedUserAvailability = await apiClient.getUserAvailability(selectedUser.id, trip.startDate, trip.endDate);
        
                                this.setState({
                                    selectedUser,
                                    selectedUserAvailability
                                });
                            }                   
                        }
                        fluid
                        defaultValue={this.state.selectedUser ? this.state.selectedUser.id : null} 
                        selection 
                        selectOnBlur={false}
                        placeholder='Pasirinkti keliautoją'
                        clearable
                        disabled={users.length === 0}
                        loading={users.length === 0}
                        options={
                            users.map((user) => ({
                                key: user.id,
                                text: user.name + ' (' + user.email + ')',
                                value: user.id
                            }))
                        }
                    />
                    {
                        selectedUser
                            ?
                                selectedUserAvailability
                                    ?
                                        <div>
                                            <Segment
                                                inverted
                                                color={selectedUserAvailability.length === 0 ? 'green' : 'red'}
                                            >
                                                { 
                                                    selectedUserAvailability.length === 0
                                                        ? 
                                                            <Icon name='check' /> 
                                                        : 
                                                            <Icon name='close' />
                                                }
                                                { 
                                                    selectedUserAvailability.length === 0
                                                        ? 
                                                            'Vartotojas kelionės laikotarpiu yra laisvas.'
                                                        : 
                                                            'Vartotojas yra užimtas šitom datom: ' + selectedUserAvailability.map(({ day }) => day).join(', ')
                                                }
                                            </Segment >
                                            <Button
                                                positive
                                                fluid
                                                onClick={async () => {
                                                    await apiClient.addParticipant(trip.id, this.state.selectedUser.id);
                                                    this.closeModal();
                                                    onUpdate();
                                                }}
                                            >
                                                Pridėti keliautoją
                                            </Button>
                                        </div>
                                    : 
                                        ''
                            : ''
                    }
                </Modal.Content>
            </Modal>
        )
    }
}

export default ParticipantAddModal;