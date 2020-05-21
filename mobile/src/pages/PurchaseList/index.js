import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Button, Modal, Text, RefreshControl,
    FlatList, TouchableOpacity, Image
} from 'react-native';
import { useSelector } from 'react-redux';
import { graphql, fetchQuery } from 'react-relay';
import { ActivityIndicator } from 'react-native-paper';

import environment from '../../services/createRelayEnvironment';

import alert from '../../services/alert';
import util from '../../services/util';

import globalStyles from '../globalStyles';
import styles from './styles';

import productLogo from '../../assets/images/product.png';

export default function PurhcaseList() {
    const store = useSelector(state => state.company);
    const ProviderId = store.id;

    const [load, setLoad] = useState(false);
    const [productList, setProductList] = useState([]);
    const [page, setPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loadMore, setLoadMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getInfo();
    }, [page]);

    async function getInfo() {
        setLoad(true);
        try {
            const query = graphql`
            query PurchaseListproductIndexQuery($ProviderId: ID, $page: Int) {
                productIndex(ProviderId: $ProviderId, page: $page) {
                    id
                    name
                    price
                    ProductPhotos {
                        photoUrl
                    }
                }
            }`;

            const variables = { ProviderId, page };
            const response = await fetchQuery(environment, query, variables);


            const { productIndex } = response;
            if (productIndex) {
                console.log(productIndex);
                if (isRefreshing) {
                    setIsRefreshing(false);
                    setProductList(productIndex);
                }
                else { setProductList([...productList, ...productIndex]); }

                setLoadMore(productIndex.length > 0);
            }

        } catch (error) {
            console.log(error);
            alert.errorInform(
                null,
                'Houve um erro ao tentar carregar a lista de produtos. Por favor, tente novamente'
            );
        }
        setLoad(false);
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await setIsRefreshing(true);

        await setLoadMore(true);
        if (page === 1) { getInfo(); }
        else { setPage(1); }

        setRefreshing(false);
    }, [refreshing]);

    function activityIndicatorShow() {
        const resp = load ? <ActivityIndicator animating={load} /> : null;
        return resp;
    }

    return (
        <View style={globalStyles.container}>
            <View style={styles.container}>
                <FlatList
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    data={productList}
                    keyExtractor={item => `${item.id}`}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={0.5}
                    onEndReached={({ distanceFromEnd }) => { if (loadMore) { setPage(page + 1); } }}
                    ListFooterComponent={activityIndicatorShow}
                    renderItem={({ item }) => {
                        const { ProductPhotos } = item;
                        const photoUrl = ProductPhotos[0] ? ProductPhotos[0].photoUrl : null

                        return (
                            <TouchableOpacity
                                onPress={() => console.log(item.id)}>
                                <View style={styles.content}>
                                    <Text style={styles.productName}>{item.name}</Text>

                                    {photoUrl
                                        ? <Image style={styles.productImage} source={{ uri: photoUrl }} />
                                        : <Image style={styles.productImage} source={productLogo} />}

                                    <Text style={styles.productPrice}>{util.maskValue(item.price)}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </View>
    );
}
