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
    cartProviderId: 0,
    cartTotal: 0
};

function user(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'UPDATE_USER':
            const { name, token, typeUser, photoUrl } = action.user;
            return {
                name, token, typeUser, photoUrl, company: { name: '', id: '' },
                cart: [], cartProviderId: 0, cartTotal: 0
            };

        case 'UPDATE_USER_PHOTO':
            return { ...state, photoUrl: action.photoUrl };

        case 'UPDATE_COMPANY':
            return { ...state, company: action.company };

        case 'ADD_TO_CART':
            const prod = action.product;

            if (state.company.id != state.cartProviderId) {
                return {
                    ...state,
                    cart: [{
                        name: prod.name, price: prod.price,
                        id: prod.id, amount: prod.amount, total: prod.total
                    }],
                    cartProviderId: state.company.id,
                    cartTotal: prod.total
                };
            }
            else return {
                ...state, cart: [...state.cart, prod],
                cartTotal: state.cartTotal + prod.total
            };

        case 'RM_FROM_CART':
            const { index } = action.product;
            state.cartTotal = state.cartTotal - state.cart[index].total;
            state.cart.splice(index, 1);

            return { ...state };
        
        case 'CLEAR_CART':
            state.cart = [];
            state.cartTotal = 0;

            return { ...state };
            
        default:
            return state;
    }
}

const store = createStore(user);

export default store;
