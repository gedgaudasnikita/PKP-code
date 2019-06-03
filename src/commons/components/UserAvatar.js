import React, { Component } from 'react';
import { Label, Popup, Image } from 'semantic-ui-react';
import { getViewReadyUserRole } from '../../utils/translation/user.role';
import md5 from 'md5';
import axios from 'axios';

import { getCurrentUser } from '../user.service';

import ParticipationStatuses from '../../enums/participation.statuses';

const colors = [
    'red',
    'orange',
    'yellow',
    'olive',
    'green',
    'teal',
    'blue',
    'violet',
    'purple',
    'pink',
    'brown',
    'grey',
    'black'
]

function _getColor(user) {
    return colors[user.id % colors.length];
}

function _getGravatarUrl(email) {
    return 'https://www.gravatar.com/avatar/' + md5(email.toLowerCase());
}

async function _isGravatarEnabled(email) {
    try {
        await axios.get(_getGravatarUrl(email) + '?d=404');
    } catch(e) {
        return false;
    }

    return true;
}

class UserAvatar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gravatarAvailable: false
        };
    }

    _loadGravatarIfAvailable = async () => {
        const gravatarAvailable = await _isGravatarEnabled(this.props.user.email);

        if (gravatarAvailable) {
            this.setState({ gravatarAvailable })
        }
    }

    componentDidMount = () => {
        if (!this.state.gravatarAvailable) {
            this._loadGravatarIfAvailable();
        }
    }

    renderAvatar = () => {
        const { gravatarAvailable } = this.state;
        const { user, status } = this.props;

        return gravatarAvailable
            ?
                (<Image 
                    avatar 
                    label={
                        status === ParticipationStatuses.ACCEPTED 
                            ? <Label className='user-status icon button' circular size='mini' floating color='green' icon='check'/>
                            : status === ParticipationStatuses.REJECTED
                                ? <Label className='user-status icon button' circular size='mini' floating color='red' icon='remove'/>
                                : status === ParticipationStatuses.PENDING
                                    ? <Label className='user-status icon button' circular size='mini' floating color='grey' icon='help'/>
                                    : null
                    }
                    src={_getGravatarUrl(user.email)}
                />)
            :
                (<Label 
                    circular
                    size='large'
                    color={_getColor(user)}
                    className={'user-avatars'}
                >
                    {user.name[0]}
                    {
                        status === ParticipationStatuses.ACCEPTED 
                            ? <Label className='user-status icon button' circular size='mini' floating color='green' icon='check'/>
                            : status === ParticipationStatuses.REJECTED
                                ? <Label className='user-status icon button' circular size='mini' floating color='red' icon='remove'/>
                                : status === ParticipationStatuses.PENDING
                                    ? <Label className='user-status icon button' circular size='mini' floating color='grey' icon='help'/>
                                    : ''
                    }
                </Label>)
    }

    render() {
        const { user, noPopup } = this.props;
        const self = user.id === getCurrentUser().id
        
        return noPopup
            ?
                this.renderAvatar()
            :
                <Popup
                    hoverable
                    hideOnScroll
                    key={user.name}
                    trigger={
                        this.renderAvatar()
                    }
                >
                    <Popup.Header>{user.name + (self ? ' (aš)' : '')}</Popup.Header>
                    <Popup.Content>
                        <div>
                            El. paštas: <a href = {"mailto: " + user.email}>{user.email}</a><br/>
                            Rolė: {getViewReadyUserRole(user.role)}
                        </div>
                    </Popup.Content>
                </Popup>
    }
}

export default UserAvatar;