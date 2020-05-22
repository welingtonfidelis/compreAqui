import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');

export default StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        color: '#898989'
    },
    image: {
        width: 300,
        height: 250,
        marginHorizontal: 10
    },
    content: {
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        borderRadius: 8,
        padding: 5,
        marginBottom: 10
    },
    contentHeader: {
        marginBottom: 15
    },
    contentDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    text1: {
        fontSize: 17
    },
    text2: {
        fontSize: 17,
        color: '#F2BB16',
        fontWeight: 'bold'
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        borderRadius: 8,
        padding: 5,
        marginBottom: 10,
        paddingHorizontal: 30,
        justifyContent: 'space-between',
    }
});