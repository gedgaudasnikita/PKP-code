import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import OfficeEditForm from './OfficeEditForm';
import OfficeAddModal from './OfficeAddModal';

import apiClient from '../../../../commons/api.client';
 
class OfficeManagement extends Component {
    static get title() {
        return 'Ofisų valdymas';
    }

    constructor(props) {
        super(props);

        this.state = {
            officeList: []
        };
    }

    updateOffices = async () => {
        const officeList = await apiClient.getOffices();
        this.setState({ officeList });
    }


    componentDidMount = async () => {
        await this.updateOffices();
    }

    _buildRows(offices) {
        return offices.map((office) => (
            <OfficeEditForm updateParent={() => this.updateOffices()} office={office} key={office.id}/>
        ))
    }

    render() {
        return (
            <div>
                <OfficeAddModal updateParent={() => this.updateOffices()}/>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Ofiso pavadinimas</Table.HeaderCell>
                            <Table.HeaderCell>Ofiso adresas</Table.HeaderCell>
                            <Table.HeaderCell/>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this._buildRows(this.state.officeList)}
                    </Table.Body>
                </Table>
            </div> 
        );
    }
}

export default OfficeManagement;
