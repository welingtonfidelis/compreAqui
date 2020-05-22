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
    cart: [],
    cartProviderId: 0
};

function user(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'UPDATE_USER':
            const { name, token, typeUser, photoUrl } = action.user;
            return { 
                name, token, typeUser, photoUrl, company: { name: '', id: '' }, 
                cart: [], cartProviderId: 0
            };

        case 'UPDATE_USER_PHOTO':
            return { ...state, photoUrl: action.photoUrl };

        case 'UPDATE_COMPANY':
            return { ...state, company: action.company };

        case 'ADD_TO_CART':
            if(state.company.id != state.cartProviderId) {
                return { ...state, cart: [action.product], cartProviderId: state.company.id};
            }
            else return { ...state, cart: [...state.cart, action.product] };

        default:
            return state;
    }
}

const store = createStore(user);

export default store;
