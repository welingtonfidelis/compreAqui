import { createStore } from 'redux';

const INITIAL_STATE = {
    name: '',
    token: '',
    typeUser: '',
    photoUrl: '',
};

function user(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'UPDATE_USER':
            const { name, token, typeUser, photoUrl } = action.user;
            return { name, token, typeUser, photoUrl };

        case 'UPDATE_USER_PHOTO':
            return { ...state, photoUrl: action.photoUrl };

        default:
            return state;
    }
}

const store = createStore(user);

export default store;
