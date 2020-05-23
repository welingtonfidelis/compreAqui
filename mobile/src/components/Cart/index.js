import React, { useEffect, useState } from 'react';
import { Text, View, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SlidingPanel from 'react-native-sliding-up-down-panels';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { graphql, fetchQuery } from 'react-relay';
import environment from '../../services/createRelayEnvironment';

import util from '../../services/util';
import alert from '../../services/alert';

import styles from './styles';
import globalStyles from '../../pages/globalStyles';

export default function Cart({ navigation }) {
    const store = useSelector(state => state);
    const dispatch = useDispatch();
    const { width, height } = Dimensions.get('screen');

    async function handleSaveRequest() {
        if(store.cart.length > 0) navigation.push('purchaseSend');
        else alert.errorInform(null, 'Por favor, coloque ao menos um produto em seu carrinho');
    }

    function handleRemoveItem(index) {
        dispatch({ type: 'RM_FROM_CART', product: { index } });
    }

    return (
        <SlidingPanel
            headerLayoutHeight={height / 2 + 100}
            allowDragging={false}
            AnimationSpeed={1000}
            headerLayout={() => (
                <View style={styles.cartIcon}>
                    <Icon name="shopping-cart" size={30} color="#F2BB16" />
                </View>
            )}
            slidingPanelLayout={() => (
                <View style={styles.slidingPanelLayoutStyle}>
                    <Text style={styles.countCartItem}>
                        {store.cart.length} produtos no carrinho
                    </Text>

                    <FlatList
                        data={store.cart}
                        keyExtractor={item => `${item.id}`}
                        numColumns={1}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {

                            return (
                                <View style={styles.cartContent}>
                                    <Text>{item.amount}</Text>
                                    <Text>{item.name}</Text>
                                    <Text>{util.maskValue(item.price)}</Text>

                                    <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                                        <Icon
                                            name="remove-circle"
                                            size={30}
                                            color="#FF0000"
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                    />

                    <Text style={styles.cartTotal}>Total: {util.maskValue(store.cartTotal)}</Text>

                    <TouchableOpacity
                        style={[globalStyles.btnSave2, styles.btnRegister]}
                        onPress={handleSaveRequest}
                    >
                        <Text style={globalStyles.txtSave2}>Finalizar pedido</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
}
