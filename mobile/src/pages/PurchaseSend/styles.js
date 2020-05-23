import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');

export default StyleSheet.create({
    cartContainer: {
        backgroundColor: '#F3F3F3',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10
    },
    cartContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cartTotal: {
        borderTopWidth: 1,
        borderTopColor: '#898989',
        textAlign: 'right',
        marginTop: 10,
        paddingTop: 5
    },
    input: {
        width: 150,
        height: 40
    },
    inputArea: {
        width: 200
    }
});