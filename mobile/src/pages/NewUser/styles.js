import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        marginHorizontal: 20,
    },
    typeUserContainer: {
        height: height - 140,
        justifyContent: 'center'
    },
    containerUserLogo: {
        backgroundColor: '#F2BB16',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: 100,
        height: 100,
        marginTop: 15
    },
    userLogo: {
        width: 95,
        height: 95,
        borderRadius: 100,
    },
    cardButtonTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 25,
        color: '#646464',
        textAlign: 'center'
    },
    cardButtonContainer: {
        flexDirection: 'row',
    },
    cardButton: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#898989',
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 3,
    },
    cardButtonText: {
        fontSize: 18,
        color: '#646464',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    txtHaveUser: {
        fontSize: 16,
        color: '#646464',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 15
    }
});
