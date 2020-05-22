import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');

export default StyleSheet.create({
    headerLayoutStyle: {
        width: width-30,
        marginHorizontal: 15,
        marginTop: 80,
        height: 20,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
    slidingPanelLayoutStyle: {
        width: width -30,
        marginHorizontal: 15,
        height: 300,
        backgroundColor: '#7E52A0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    commonTextStyle: {
        color: 'white',
        fontSize: 18,
    },
    cartIcon: {
        marginTop: 80,
        // height: 20,
        backgroundColor: '#898989',
        padding: 10,
        borderRadius: 50,
        position: 'absolute',
        top: -30,
        left: width -80 
    }
  });