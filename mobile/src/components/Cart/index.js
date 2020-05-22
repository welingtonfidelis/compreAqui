import React, { useEffect } from 'react';
import {
    Text,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SlidingPanel from 'react-native-sliding-up-down-panels';
import Icon from 'react-native-vector-icons/MaterialIcons';

import styles from './styles';

export default function Cart() {
    const store = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(store);

    }, [])

    return (
        <SlidingPanel
            headerLayoutHeight={100}
            headerLayout={() =>
                <View style={styles.cartIcon}>
                    <Icon name="shopping-cart" size={30} color="#F2BB16" />
                </View>
            }
            slidingPanelLayout={() =>
                <View style={styles.slidingPanelLayoutStyle}>
                    {store.cart.map(el => 
                    <Text>{el.name} {el.amount}</Text>
                    )}
                </View>
            }
        />
    );
}