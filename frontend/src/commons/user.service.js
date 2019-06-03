export function getCurrentUser() {
    const user = localStorage.getItem('user');

    if (!user) {
        return null;
    }

    return JSON.parse(user);
}

export function storeCurrentUser(user) {   
    localStorage.setItem('user', JSON.stringify(user));
}

export function removeCurrentUser() {
    localStorage.removeItem('user');
}

