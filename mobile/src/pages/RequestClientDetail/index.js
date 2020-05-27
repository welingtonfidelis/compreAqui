import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, Image, Linking, ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { graphql, fetchQuery } from 'react-relay';
import { ActivityIndicator } from 'react-native-paper';

import environment from '../../services/createRelayEnvironment';
import alert from '../../services/alert';
import util from '../../services/util';

import globalStyles from '../globalStyles';
import styles from './styles';

import companyLogo from '../../assets/images/store.png';

export default function RequestClientDetail({ navigation, route }) {
  const { id } = route.params;

  const [load, setLoad] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [request, setRequest] = useState({});
  const [productList, setProductList] = useState([]);
  const [provider, setProvider] = useState({});
  const [address, setAddress] = useState({});
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('Aguardando');

  useEffect(() => {
    getInfo();
  }, [page])

  async function getInfo() {
    setLoad(true)
    try {
      const query = graphql`
        query RequestClientDetailrequestShowQuery($id: ID!) {
          requestShow (id: $id)  {
            status
            timeWait
            createdAt
            value
            delivery
            cashBack
            cash
            observation
            reason
            Provider {
              name
              phone1
              phone2
              email
              photoUrl
              Address {
                cep
                street
                complement
                number
                district
                city
                state        
              }
            }
            RequestProducts {
              amount
              price
              Product {
                id
                name
              }
            }
          }
        }
      `

      const variables = { id }
      const { requestShow } = await fetchQuery(environment, query, variables)

      if (requestShow) {
        setRequest(requestShow);
        setProductList(requestShow.RequestProducts);
        setProvider(requestShow.Provider);
        setAddress(requestShow.Provider.Address);
        if(requestShow.status === 'approved') setStatus('Aprovado');
        else if(requestShow.status === 'refused') setStatus('Recusado');
      }

    } catch (error) {
      console.error(error);
      alert.errorInform(
        null,
        'Houve um erro ao carregar sua lista de pedidos. Por favor, tente novamente');
    }
    setLoad(false);
  }

  function ActivityIndicatorShow() {
    const resp = load ? <ActivityIndicator animating={load} /> : null;
    return resp;
  }

  function MountPhoneDiv() {
    const resp = [];

    [provider.phone1, provider.phone2].forEach(el => {
      resp.push(
        <View style={styles.contentPhone}>
          <Text>{el}</Text>

          <TouchableOpacity onPress={() =>
            Linking.canOpenURL("whatsapp://send?text=oi").then(supported => {
              if (supported) {
                return Linking.openURL(
                  `whatsapp://send?phone=55${el}` +
                  `&text=Olá! ${provider.name}`
                );
              } else {
                return Linking.openURL(
                  `https://api.whatsapp.com/send?phone=55` +
                  `${el}&text=Olá! ${provider.name}`
                );
              }
            })
          }
            style={styles.phoneAction}>
            <Icon name='whatsapp' size={30} color='#25d366' />
          </TouchableOpacity>

          <TouchableOpacity onPress={() =>
            Linking.openURL(`tel:${el}`)
          }
            style={styles.phoneAction}>
            <Icon name='phone' size={30} color='#4E95C9' />
          </TouchableOpacity>
        </View>
      )
    });
    return resp;
  }

  return (
    <ScrollView>
      <View style={globalStyles.container}>
        <ActivityIndicatorShow />

        <View style={styles.content}>
          <Text style={styles.text1}>{provider.name}</Text>

          {provider.photoUrl
            ? <Image style={styles.logo} source={{ uri: provider.photoUrl }} />
            : <Image style={styles.logo} source={companyLogo} />}

          <Text style={styles.text2}>
            {address.cep}, {address.street}, {address.number}, {address.complement},
            {address.district}, {address.city}-{address.state}
          </Text>

          <MountPhoneDiv />
        </View>

        <View style={styles.content}>
          {productList.map(el => (
            <View key={el.Product.id} style={styles.contentProduct}>
              <Text>{el.amount}</Text>
              <Text>{el.Product.name}</Text>
              <Text>{util.maskValue(el.price)}</Text>
            </View>
          ))}
          <Text style={[styles.text2, styles.text3]}>Total {util.maskValue(request.value)}</Text>
        </View>

        <View style={[styles.content, {alignItems: 'flex-start'}]}>
          <View style={styles.contentPhone}>
            <Text style={styles.text4}>{request.cash ? 'Dinheiro' : 'Cartão'}</Text>

            <Icon
              name={request.cash ? "cash" : "credit-card"}
              size={35}
              color="#F2BB16"
            />
          </View>

          <View style={styles.contentPhone}>
            <Text style={styles.text4}>{request.delivery ? 'Entrega' : 'Retirada'}</Text>

            <Icon
              name={request.delivery ? "motorbike" : "walk"}
              size={35}
              color="#F2BB16"
            />
          </View>

          {request.delivery ?
            <Text style={styles.text4}>Troco para <Text>{util.maskValue(request.cashBack)}</Text></Text>
            : null}

          <Text style={styles.text4}>Observação do cliente: </Text><Text>{request.observation}</Text>

          <Text style={styles.text4}>Status do pedido: </Text><Text>{status}</Text>

          {request.status === 'refused' ?
            <><Text style={styles.text4}>Motivo da rejeição: </Text><Text>{request.reason}</Text></>
            : null}
        </View>
      </View>
    </ScrollView>
  );
}
