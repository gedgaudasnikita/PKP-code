import React, { Component } from 'react';

import {
    Table,
    Dropdown
} from 'semantic-ui-react';

import {
    DateInput
} from 'semantic-ui-calendar-react';

import moment from 'moment';

import FormattedDate from '../../../../commons/components/FormattedDate';

import { getCurrentUser } from '../../../user.service';
import apiClient from '../../../api.client';

class TripGeneralInfo extends Component {
    constructor(props) {
        super(props);

        this._tripId = this.props.trip.id;
        this._updateParent = this.props.onUpdate;
        this.state = {
            startDate: this.props.trip.startDate,
            endDate: this.props.trip.endDate,
            startOffice: this.props.trip.startOffice,
            endOffice: this.props.trip.endOffice,
            offices: []
        }
    }

    componentDidMount = async () => {
        const offices = await apiClient.getOffices();

        this.setState({ offices });
    }

    buildRow(name, value) {
        return (
            <Table.Row>
                <Table.Cell active><b>{name}</b></Table.Cell>
                <Table.Cell>{value}</Table.Cell>
            </Table.Row>
        )
    }

    updateTrip = async () => {
        try {
            await apiClient.modifyTrip(this._tripId, {
                startDate: moment(this.state.startDate).format('YYYY-MM-DD'),
                endDate: moment(this.state.endDate).format('YYYY-MM-DD'),
                startOfficeId: this.state.startOffice ? this.state.startOffice.id : null,
                endOfficeId: this.state.endOffice ? this.state.endOffice.id : null
            });
            
            this._updateParent();
        } catch (e) {
            if (e.response && e.response.status === 409) {
                alert('Kitas vartotojas pakeitė kelionę! Perkraukite puslapį, kad pamatytumėte pakeitimus.')
            }
        }
    }

    handleInputChange = ({ target: { value, name }}) => {
        this.setState({
            [name]: value
        });
    }

    _buildOfficeDropdown(offices, fieldName, excludeOfficeIds = []) {
        return <Dropdown 
            name={fieldName}
            clearable
            onChange={
                async (event, target) => {
                    const appliedTarget = {
                        ...target,
                        value: offices.find(({ id }) => id === target.value)
                    }
                    await this.handleInputChange({ target: appliedTarget });
                    await this.updateTrip(event);
                }                   
            } 
            defaultValue={this.state[fieldName] ? this.state[fieldName].id : null} 
            selection 
            disabled={offices.length === 0}
            loading={offices.length === 0}
            options={
                offices.filter(({ id }) => !excludeOfficeIds.includes(id)).map((office) => ({
                    key: office.id,
                    text: office.name,
                    value: office.id
                }))
            }
        />;
    }

    _buildDatePicker = (fieldName, minDate, maxDate) => {
        return (
            <DateInput
                name={fieldName}
                value={this.state[fieldName] ? moment.utc(this.state[fieldName]).format('YYYY-MM-DD') : ''}
                dateFormat='YYYY-MM-DD'
                closable
                autoComplete='off'
                minDate={minDate || moment(Date.now())}
                maxDate={maxDate || moment(Date.now()).add(10, 'years')}
                onChange={
                    async (event, target) => {
                        const UTCDate = moment.utc(target.value, 'YYYY-MM-DD').toISOString();
                        const adaptedTarget = {
                            ...target,
                            value: UTCDate
                        };

                        await this.handleInputChange({ target: adaptedTarget });
                        await this.updateTrip(event);
                    }                   
                }

            />
        );
    }

    render() {
        const { trip } = this.props;

        const organizerView = trip ? trip.organizer.id === getCurrentUser().id : null;

        const { offices } = this.state;
        
        return (
            <Table>
                <Table.Body>
                    {this.buildRow('Išvykimo taškas', organizerView 
                        ? this._buildOfficeDropdown(offices, 'startOffice', this.state.endOffice ? [this.state.endOffice.id] : [])
                        : trip.startOffice ? trip.startOffice.name : '-')}
                    {this.buildRow('Tikslas', organizerView 
                        ? this._buildOfficeDropdown(offices, 'endOffice', this.state.startOffice ? [this.state.startOffice.id] : [])
                        : trip.endOffice ? trip.endOffice.name : '-')}
                    {this.buildRow('Išvykimas', organizerView 
                        ? this._buildDatePicker('startDate', null, this.state.endDate)
                        : <FormattedDate ISODate={trip.startDate} showDaysRemaining/>)}
                    {this.buildRow('Grįžimas', organizerView 
                        ? this._buildDatePicker('endDate', this.state.startDate, null)
                        : <FormattedDate ISODate={trip.endDate} showDaysRemaining/>)}
                </Table.Body>
            </Table>
        );
    }
}

export default TripGeneralInfo;
