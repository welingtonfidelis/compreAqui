import { createStore } from 'redux';

const INITIAL_STATE = {
    name: '',
    token: '',
    typeUser: '',
    photoUrl: '',
    company: {
        'name': '',
        'id': '',
    },
};

function user(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'UPDATE_USER':
            const { name, token, typeUser, photoUrl } = action.user;
            return { name, token, typeUser, photoUrl, company: {name: '', id: ''} };

        case 'UPDATE_USER_PHOTO':
            return { ...state, photoUrl: action.photoUrl };

        case 'UPDATE_COMPANY':
            return { ...state, company: action.company };

        default:
            return state;
    }
}

const store = createStore(user);

export default store;
