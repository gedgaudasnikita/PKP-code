import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import UserEditForm from './UserEditForm';
import UserAddModal from './UserAddModal';

import apiClient from '../../../../commons/api.client';

class UserManagement extends Component {
    static get title() {
        return 'Vartotojų valdymas';
    }

    constructor(props) {
        super(props);

        this.state = {
            userList: []
        };
    }

    updateUsers = async () => {
        const userList = await apiClient.getUsers();
        this.setState({ userList });
    }

    componentDidMount = async () => {
        await this.updateUsers();
    }

    _buildRows(users) {
        return users.map((user) => (
            <UserEditForm updateParent={() => this.updateUsers()} user={user} key={user.id}/>
        ))
    }

    render() {
        return (
            <div>
                <UserAddModal updateParent={() => this.updateUsers()}/>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Vartotojo vardas</Table.HeaderCell>
                            <Table.HeaderCell>Vartotojo el. paštas</Table.HeaderCell>
                            <Table.HeaderCell>Vartotojo lygis</Table.HeaderCell>
                            <Table.HeaderCell/>
                            <Table.HeaderCell/>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this._buildRows(this.state.userList)}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

export default UserManagement;
