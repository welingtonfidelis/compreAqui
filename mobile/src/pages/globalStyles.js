import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 50,
        backgroundColor: 'red',
    },
    btnSave1: {
        backgroundColor: '#F2BB16',
        height: 50,
        marginTop: 15,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtSave1: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    btnSave2: {
        backgroundColor: '#000',
        height: 50,
        marginTop: 15,
        borderColor: '#F2BB16',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtSave2: {
        fontSize: 20,
        color: '#F2BB16',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});
