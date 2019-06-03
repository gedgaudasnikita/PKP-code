import UserRoles from '../../enums/user.roles';

const ViewReadyUserRoles = {
    [UserRoles.ADMIN]: 'Administratorius 🛠️',
    [UserRoles.ORGANIZER]: 'Organizatorius ☎️',
    [UserRoles.TRAVELLER]: 'Keliautojas 💼',
}

export function getViewReadyUserRole(UserRole) {
    return ViewReadyUserRoles[UserRole];
}