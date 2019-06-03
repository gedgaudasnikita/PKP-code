import Admin from '../views/admin';
import Organize from '../views/organize';
import Travel from '../views/travel';

import UserRoles from '../enums/user.roles';
import {
    getCurrentUser,
    removeCurrentUser,
    storeCurrentUser
} from '../commons/user.service';

import apiClient from '../commons/api.client';

const UserRoleViewsMap = {
    [UserRoles.ADMIN]: [Admin, Organize, Travel],
    [UserRoles.ORGANIZER]: [Organize, Travel],
    [UserRoles.TRAVELLER]: [Travel]
}

class AuthenticationService {
    constructor(setAuthenticated) {
        this._setAuthenticated = setAuthenticated;
    }

    login = async (username, password) => {    
        const { user, session } = await apiClient.loginUser(username, password) || {};

        if (user) {    
            user.authdata = session;
            storeCurrentUser(user);
            this._setAuthenticated(true);

            return true;
        } else {
            this.logout();
            
            return false;
        }
    }
    
    logout = () => {
        removeCurrentUser();
        this._setAuthenticated(false);
    }

    isAuthenticated = () => {
        const user = getCurrentUser();

        return !!user;
    }

    getViewsForCurrentUser = () => {
        const user = getCurrentUser();

        if (!user) {
            return [];
        }

        return UserRoleViewsMap[user.role] || [];
    }
}

export default AuthenticationService;
