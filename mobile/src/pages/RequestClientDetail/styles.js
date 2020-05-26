import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');

export default StyleSheet.create({
    content: {
        marginBottom: 10,
        backgroundColor: '#E5E5E5',
        padding: 5,
        borderRadius: 8,
        alignItems: 'center',
    },
    logo: {
        width: width - 80,
        height: (height / 3) - 50,
        marginRight: 5
    },
    text1: {
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#898989',
        fontSize: 18,
        fontWeight: "bold",
        color: '#F2BB16',
        width: '100%',
        marginBottom: 5
    },
    text2: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: "bold",
        marginVertical: 5,
        borderTopWidth: 1,
        width: '100%',
        borderTopColor: '#898989'
        
    },
    text3: {
        textAlign: 'right'
    },
    text4: {
        fontWeight: 'bold'
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
    },
    contentPhone: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    phoneAction: {
        marginHorizontal: 8
    },
    contentProduct: {
        flexDirection: 'row',
        width: width - 50,
        justifyContent: 'space-between'
    }
});
