import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');

export default StyleSheet.create({
    content: {
        flexDirection :'row',
        marginBottom: 10,
        backgroundColor: '#E5E5E5',
        padding: 5,
        borderRadius: 8,
        alignItems: 'center'
    },
    logo: {
        width: 80,
        height: 80,
        marginRight: 5
    },
    text1: {
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#898989',
        fontSize: 16,
        fontWeight: "bold",
        color: '#F2BB16'
    },
    text2: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 5
    },
    contentIfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contentStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 5
    }
});
