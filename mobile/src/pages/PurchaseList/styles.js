import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');

export default StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#F3F3F3',
        marginHorizontal: 5,
        alignItems: 'center',
        padding: 8,
    },
    productName: {
        color: '#F2BB16',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    productPrice: {
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 5
    },
    productImage: {
        width: (width/2) - 36,
        height: 130,
        resizeMode: 'stretch'
    }
});