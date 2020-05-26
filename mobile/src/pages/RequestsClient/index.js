import React, { useState, useEffect, useCallback } from 'react';

import {
  View, Text, TouchableOpacity, Image,
  FlatList, RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { graphql, fetchQuery } from 'react-relay';
import { ActivityIndicator } from 'react-native-paper';

import environment from '../../services/createRelayEnvironment';
import alert from '../../services/alert';
import util from '../../services/util';

import globalStyles from '../globalStyles';
import styles from './styles';

import companyLogo from '../../assets/images/store.png';

export default function RequestsClient({ navigation }) {
  const dispatch = useDispatch();

  const [load, setLoad] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getInfo();
  }, [page])

  async function getInfo() {
    setLoad(true)
    try {
      const query = graphql`
        query RequestsClientrequestIndexQuery($page: Int) {
          requestIndex (page: $page)  {
            id
            status
            value
            createdAt
            Provider {
              name
              photoUrl
            }
          }
        }
      `

      const variables = { page }
      const { requestIndex } = await fetchQuery(environment, query, variables)

      if (requestIndex) {
        if (isRefreshing) {
          setIsRefreshing(false);
          setRequestList(requestIndex);
        }
        else { setRequestList([...requestList, ...requestIndex]); }
      }
      setLoadMore(requestIndex.length > 0);

    } catch (error) {
      console.error(error);
      alert.errorInform(
        null,
        'Houve um erro ao carregar sua lista de pedidos. Por favor, tente novamente');
    }
    setLoad(false)
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

  function handleRequest(id) {
    dispatch({ type: 'UPDATE_COMPANY', company: { name: `Pedido ${id}`, id: 0 } });
    navigation.push('requestClientDetail', id={id});
  }

  return (
    <View style={globalStyles.container}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={requestList}
        keyExtractor={item => `${item.id}`}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={({ distanceFromEnd }) => { if (loadMore) { setPage(page + 1); } }}
        ListFooterComponent={activityIndicatorShow}
        renderItem={({ item }) => {
          const { Provider } = item;
          const { photoUrl } = Provider;
          let status = {
            name: "emoticon-neutral-outline",
            color: "#898989",
            title: "Aguardando"
          }

          if (item.status === 'approved') {
            status = {
              name: "emoticon-happy-outline",
              color: "#0EB000",
              title: "Aprovado"
            }
          }
          else if (item.status === 'refused') {
            status = {
              name: "emoticon-sad-outline",
              color: "#FF0000",
              title: "Recusado"
            }
          }

          return (
            <TouchableOpacity
              onPress={() => handleRequest(item.id)}>
              <View style={styles.content}>
                {photoUrl
                  ? <Image style={styles.logo} source={{ uri: photoUrl }} />
                  : <Image style={styles.logo} source={companyLogo} />}

                <View style={{ flex: 1 }}>
                  <Text style={styles.text1}>Pedido {item.id}</Text>
                  <Text style={styles.text2}>{Provider.name}</Text>

                  <View style={styles.contentIfo}>
                    <Text style={styles.productPrice}>{util.maskValue(item.value)}</Text>
                    <Text style={styles.productName}>{util.maskDate(item.createdAt)}</Text>
                  </View>

                  <View style={styles.contentStatus}>
                    <Text>{status.title}</Text>
                    <Icon
                      name={status.name}
                      size={25}
                      color={status.color}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
