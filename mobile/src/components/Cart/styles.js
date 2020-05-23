import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');

export default StyleSheet.create({
  slidingPanelLayoutStyle: {
    width: width - 30,
    marginHorizontal: 15,
    height: height / 2 - 150,
    marginTop: -20,
    marginBottom: 20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#F2BB16',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commonTextStyle: {
    color: 'white',
    fontSize: 18,
  },
  cartIcon: {
    marginTop: height / 2 + 100,
    // height: 20,
    backgroundColor: '#898989',
    padding: 10,
    borderRadius: 50,
    position: 'absolute',
    top: -50,
    left: width - 80,
    zIndex: 99,
  },
  countCartItem: {
    width: width - 50,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3',
  },
  cartContent: {
    flexDirection: 'row',
    width: width - 50,
    marginTop: 5,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cartTotal: {
    marginBottom: 10,
    marginTop: 10,
    width: width - 50,
    borderTopWidth: 1,
    borderTopColor: '#F3F3F3',
    textAlign: 'right',
  },
  btnRegister: {
    marginBottom: 15,
    width: width - 80,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
