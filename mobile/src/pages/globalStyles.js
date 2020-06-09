import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: 10,
        backgroundColor: '#fff',
    },
    btnSave1: {
        backgroundColor: '#fff',
        height: 50,
        marginTop: 15,
        marginBottom: 15,
        borderColor: '#F2BB16',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtSave1: {
        fontSize: 20,
        color: '#F2BB16',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    btnSave2: {
        backgroundColor: '#000',
        height: 50,
        marginTop: 15,
        marginBottom: 15,
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
    flexRow: {
        flexDirection: 'row',
    },
    OptionBottomTitle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center'
    },
    OptionBottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 15
    },
    OptionBottomText1: {
        color: '#fff', 
        fontSize: 14,
        textAlign: 'center',
        marginTop: -25
    }
});
