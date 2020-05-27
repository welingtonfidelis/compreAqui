import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { graphql, commitMutation } from 'react-relay';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import environment from '../../services/createRelayEnvironment';
import alert from '../../services/alert';
import util from '../../services/util';

import globalStyles from '../globalStyles';
import styles from './styles';

export default function PurhcaseSend({ navigation }) {
    const dispatch = useDispatch();
    const store = useSelector(state => state);

    const [cash, setCash] = useState(true);
    const [cashBack, setCashBack] = useState('0');
    const [delivery, setDelivery] = useState(true);
    const [observation, setObservation] = useState('');
    const [load, setLoad] = useState(false);

    async function handleSubmit() {
        if (store.cart.length > 0) {
            setLoad(true);

            const cart = [];
            store.cart.forEach(el => cart.push(
                { id: el.id, amount: el.amount, price: el.price }
            ));

            try {
                const mutation = graphql`
                    mutation PurchaseSendrequestStoreMutation(
                        $ProviderId: ID!, $delivery: String!, $cash: String!, 
                        $cashBack: Float!, $value: Float!, $observation: String,
                        $products: [RequestListProduct!]
                    ) {
                        requestStore(
                            ProviderId: $ProviderId, delivery: $delivery, cash: $cash, 
                            cashBack: $cashBack, value: $value, products: $products,
                            observation: $observation
                        )
                        {
                            id
                        }
                    }
                `;

                const variables = {
                    ProviderId: store.cartProviderId, delivery: `${delivery}`, cash: `${cash}`,
                    cashBack: cashBack !== '' ? parseFloat(cashBack.replace(',', '.')) : 0,
                    value: store.cartTotal, products: cart, observation
                };

                commitMutation(environment, {
                    mutation, variables,
                    onCompleted: (response, errors) => {
                        console.log(response);
                        const { requestStore } = response;

                        if (requestStore) {
                            alert.successInform(
                                null,
                                'Pedido efetuado com sucesso. Aguarde a resposta do vendedor.'
                            );
                            navigation.goBack();
                            dispatch({ type: 'CLEAR_CART' });
                        }

                    },
                    onError: err => {
                        console.error(err);
                        alert.errorInform(
                            null,
                            'Houve um erro ao salvar seu pedido. Por favor, tente novamente'
                        );
                    },
                });

            } catch (error) {
                console.log(error);
                alert.errorInform(
                    null,
                    'Houve um erro ao salvar seu pedido. Por favor, tente novamente'
                );
            }
            setLoad(false)

        }
        else alert.errorInform(null, 'Por favor, coloque ao menos um produto em seu carrinho');
    }

    function handleRemoveItem(index) {
        dispatch({ type: 'RM_FROM_CART', product: { index } });
    }

    return (
        <View style={globalStyles.container}>
            <View style={styles.cartContainer}>
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
                                        name="minus-circle"
                                        size={30}
                                        color="#FF0000"
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
                <Text style={styles.cartTotal}>{util.maskValue(store.cartTotal)}</Text>
            </View>

            <View style={styles.cartContainer}>
                <View style={styles.cartContent}>
                    <Text>{cash ? 'Dinheiro' : 'Cartão'}</Text>
                    <TouchableOpacity onPress={() => setCash(!cash)}>
                        <Icon
                            name={cash ? "cash" : "credit-card"}
                            size={35}
                            color="#F2BB16"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.cartContent}>
                    <Text>{delivery ? 'Entrega' : 'Retirada'}</Text>
                    <TouchableOpacity onPress={() => setDelivery(!delivery)}>
                        <Icon
                            name={delivery ? 'motorbike' : 'walk'}
                            size={35}
                            color="#F2BB16"
                        />
                    </TouchableOpacity>
                </View>

                {cash ?
                    <View style={styles.cartContent}>
                        <Text>Troco para </Text>
                        <TextInput
                            style={styles.input}
                            value={cashBack}
                            mode="outlined"
                            keyboardType="decimal-pad"
                            onChangeText={text => setCashBack(text)}
                        />
                    </View>
                    : null}

                <View style={styles.cartContent}>
                    <Text>Observação</Text>
                    <TextInput
                        multiline={true}
                        numberOfLines={5}
                        style={styles.inputArea}
                        value={observation}
                        mode="outlined"
                        onChangeText={text => setObservation(text)}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={globalStyles.btnSave1}
                onPress={handleSubmit}
            >
                {load
                    ? <ActivityIndicator animating={load} />
                    : <Text style={globalStyles.txtSave1}>Enviar pedido</Text>
                }
            </TouchableOpacity>
            <TouchableOpacity
                style={[globalStyles.btnSave2, styles.btnRegister]}
                onPress={() => navigation.goBack()}
            >
                <Text style={globalStyles.txtSave2}>Continuar comprando</Text>
            </TouchableOpacity>
        </View>
    )
}