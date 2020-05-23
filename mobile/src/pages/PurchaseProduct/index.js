import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Button, Text, RefreshControl,
    FlatList, TouchableOpacity, Image
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { graphql, fetchQuery } from 'react-relay';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

import environment from '../../services/createRelayEnvironment';
import alert from '../../services/alert';
import util from '../../services/util';

import globalStyles from '../globalStyles';
import styles from './styles';

import productLogo from '../../assets/images/product.png';

export default function PurhcaseProduct({ route }) {
    const dispatch = useDispatch();
    const { id } = route.params;

    const [load, setLoad] = useState(false);
    const [product, setProduct] = useState({});
    const [photos, setPhotos] = useState([]);
    const [brand, setBrand] = useState({});
    const [size, setSize] = useState({});
    const [amount, setAmount] = useState(0);
    const [showSnack, setShowSnack] = useState(false);

    useEffect(() => {
        async function getInfo() {
            setLoad(true);
            try {
                const query = graphql`
            query PurchaseProductproductShowQuery($id: ID!) {
                productShow(id: $id) {
                    id
                    name
                    description
                    price
                    ProductPhotos {
                        photoUrl
                    }
                    Brand {
                        brandDescription
                    }
                    Size {
                        sizeDescription
                    }
                }
            }`;

                const variables = { id };
                const response = await fetchQuery(environment, query, variables);

                const { productShow } = response;
                if (productShow) {
                    setProduct(productShow);
                    setPhotos(productShow.ProductPhotos);
                    setBrand(productShow.Brand);
                    setSize(productShow.Size);
                }

            } catch (error) {
                console.log(error);
                alert.errorInform(
                    null,
                    'Houve um erro ao tentar carregar este produto. Por favor, tente novamente'
                );
            }
            setLoad(false);
        };

        getInfo();
    }, []);

    function saveProduct() {
        if (amount > 0) {
            const { name, price, id } = product;
            dispatch({ type: 'ADD_TO_CART', product: { name, price, id, amount, total: price * amount } });

            setShowSnack(true);
            setTimeout(() => {
                setShowSnack(false);
            }, 4000);
        }
        else alert.errorInform(null, 'Coloque ao menos um item no seu carrinho, por favor');
    }

    return (
        <View style={globalStyles.container}>
            <Text style={styles.title}>{product.name}</Text>

            <FlatList
                data={photos}
                keyExtractor={(item, index) => `${index}`}
                numColumns={1}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                    return (
                        <Image
                            source={{ uri: item.photoUrl }}
                            style={styles.image} />
                    );
                }}
            />

            <View style={styles.content}>
                <View style={styles.contentHeader}>
                    <Text style={styles.text1}>{product.description}</Text>
                </View>

                <View style={styles.contentDetail}>
                    <View>
                        <Text style={styles.text1}>{brand.brandDescription}</Text>
                        <Text style={styles.text1}>{size.sizeDescription}</Text>
                    </View>

                    <Text style={styles.text2}>{util.maskValue(product.price)}</Text>
                </View>
            </View>

            <View style={styles.action}>
                <TouchableOpacity onPress={() => { if (amount > 0) setAmount(amount - 1) }}>
                    <Icon
                        name="remove-circle"
                        size={45}
                        color="#FF0000"
                    />
                </TouchableOpacity>

                <Text style={styles.text1}>{amount}</Text>

                <TouchableOpacity onPress={() => setAmount(amount + 1)}>
                    <Icon
                        name="add-circle"
                        size={45}
                        color="#0EB000"
                    />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={globalStyles.btnSave1}
                onPress={saveProduct}
            >
                {load
                    ? <ActivityIndicator animating={load} />
                    : <Text style={globalStyles.txtSave1}>Colocar no carrinho</Text>
                }
            </TouchableOpacity>

            <Snackbar visible={showSnack} style={{ width: '100%' }}>
                Item salvo no carrinho
            </Snackbar>
        </View>
    )
}