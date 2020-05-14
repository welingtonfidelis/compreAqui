import { createStore } from 'redux';
// import AsyncStorage from '@react-native-community/async-storage';

const INITIAL_STATE = {
    data: {
        "coords": {
            "accuracy": 15.593999862670898,
            "altitude": 742.2999877929688,
            "heading": 0,
            "latitude": -20.7213389,
            "longitude": -46.6112146,
            "speed": 0
        },
        "mocked": false,
        "timestamp": 1585835958439
    },

    // userImage: AsyncStorage.getItem('ranor@usrImage')
};

function positions(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'UPDATE_POSITION':
            return { state, data: action.position };
            break;

        case 'UPDATE_USER_IMAGE':
            return { state, userImage: action.url };
            break;

        default:
            return state
            break;
    }
}

const store = createStore(positions);

export default store;