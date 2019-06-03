import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import ApartmentEditForm from './ApartmentEditForm';
import ApartmentAddModal from './ApartmentAddModal';

import apiClient from '../../../../commons/api.client';
 
class ApartmentManagement extends Component {
    static get title() {
        return 'Apartamentų valdymas';
    }

    constructor(props) {
        super(props);

        this.state = {
            apartmentList: []
        };
    }

    updateApartments = async () => {
        const apartmentList = await apiClient.getApartments();
        this.setState({ apartmentList });
    }

    componentDidMount = async () => {
        await this.updateApartments();
    }

    _buildRows(apartments) {
        return apartments.map((apartment) => (
            <ApartmentEditForm updateParent={() => this.updateApartments()} apartment={apartment} key={apartment.id}/>
        ))
    }

    render() {
        return (
            <div>
                <ApartmentAddModal updateParent={() => this.updateApartments()}/>
                <Table>
                    <Table.Header>
                        <Table.Row className='action-row'>
                            <Table.HeaderCell>Apartamentų pavadinimas</Table.HeaderCell>
                            <Table.HeaderCell>Apartamentų adresas</Table.HeaderCell>
                            <Table.HeaderCell>Ofisas</Table.HeaderCell>
                            <Table.HeaderCell>Kambarių skaičius</Table.HeaderCell>
                            <Table.HeaderCell/>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this._buildRows(this.state.apartmentList)}
                    </Table.Body>
                </Table>
            </div> 
        );
    }
}

export default ApartmentManagement;
