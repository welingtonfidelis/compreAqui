import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        marginHorizontal: 20,
    },
    logo: {
        width: width - 40,
        height: 110,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    containerWelcome: {
        marginBottom: 20,
    },
    txtWelcome: {
        textAlign: 'center',
        color: '#646464',
        fontSize: 16,
    },
    btnReset: {
        alignItems: 'flex-end',
        paddingTop: 5,
    },
    txtReset: {
        fontSize: 15,
        color: '#646464',
    },
    btnRegister: {
        marginTop: 40,
    },
    txtInvalid: {
        marginTop: 5,
        fontSize: 15,
        color: 'red',
        textAlign: 'center',
    },
});
