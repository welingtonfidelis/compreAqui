import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    iconCamera: {
        flex: 1,
        alignItems: 'center'
    },
    iconChangeType: {
        flex: 1, alignItems: 'flex-end',
        marginBottom: -10
    },
    backButton: {
        position: 'absolute',
        top: 5,
        left: 5,
        borderWidth: 1.5,
        borderColor: '#F2BB16'
    }
});