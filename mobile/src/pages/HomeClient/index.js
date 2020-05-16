import React, { useState, useEffect, useCallback } from 'react';

import {
  View, Text, FlatList, RefreshControl,
  TouchableOpacity, Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { graphql, fetchQuery } from 'react-relay';
import { useSelector, useDispatch } from 'react-redux';

import environment from '../../services/createRelayEnvironment';

import globalStyles from '../globalStyles';
import styles from './styles';

import companyLogo from '../../assets/images/store.png';

export default function HomeClient({ navigation }) {
  const [load, setLoad] = useState(false);
  const [categoryId, setCategoryId] = useState(1);
  const [categoryName, setCategoryName] = useState(0);
  const [companyList, setCompanyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadMore, setLoadMore] = useState(true);
  const store = useSelector(state => state);
  const photoTmp = 'https://compreaqui.s3-sa-east-1.amazonaws.com/images/category/food.png';

  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    if (loadMore) { getCompany(); }
  }, [page, categoryId]);

  async function getInfo() {
    setLoad(true);
    try {
      const query = graphql`
            query HomeClientcategoryIndexQuery {
                categoryIndex {
                    id
                    name
                }
            }`;

      const variables = {};
      const response = await fetchQuery(environment, query, variables);

      const { categoryIndex } = response;
      if (categoryIndex) {
        setCategoryList(categoryIndex);
      }

    } catch (error) {
      console.error(error);
      alert.errorInform(
        null,
        'Houve um erro ao tentar carregar a lista de categorias. Por favor, tente novamente'
      );
    }
    setLoad(false);
  }

  async function getCompany() {
    setLoad(true);
    try {
      const query = graphql`
            query HomeClientuserIndexByCategoryQuery($page: Int, $categoryId: ID!) {
                userIndexByCategory(page: $page, CategoryId: $categoryId) {
                  id
                  name
                  photoUrl
                  phone1
                  phone2
                  Address {
                    cep
                    street
                    number
                    complement
                    city
                    state
                  }
                }
            }`;

      const variables = { page, categoryId };
      const response = await fetchQuery(environment, query, variables);

      const { userIndexByCategory } = response;
      console.log(userIndexByCategory);

      if (userIndexByCategory) {
        setCompanyList(userIndexByCategory);
      }

    } catch (error) {
      console.error(error);
      alert.errorInform(
        null,
        'Houve um erro ao carregar a lista de empresas. Por favor, tente novamente'
      );
    }
    setLoad(false);
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    setLoadMore(true);
    if (page === 1) { getCompany(); }
    else { setPage(1); }

    setRefreshing(false);
  }, [refreshing]);

  return (
    <View style={globalStyles.container}>
      <Text style={styles.categoryTitle}>Categorias</Text>

      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={categoryList}
        keyExtractor={item => `${item.id}`}
        numColumns={1}
        horizontal={true}
        onEndReachedThreshold={0.3}
        onEndReached={({ distanceFromEnd }) => { }}
        renderItem={({ item }) => {

          return (
            <TouchableOpacity
              onPress={() => setCategoryId(item.id)}>
              <View style={styles.containerCategory}>
                <Image style={styles.categoryImage} source={{ uri: photoTmp }} />

                <Text style={styles.catetegoryText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Text style={styles.categoryTitle}>Empresas</Text>

      <FlatList
        data={companyList}
        keyExtractor={item => `${item.id}`}
        numColumns={1}
        onEndReachedThreshold={0.3}
        onEndReached={({ distanceFromEnd }) => { }}
        renderItem={({ item }) => {

          const { Address } = item;
          return (
            <TouchableOpacity
              onPress={() => console.log(item.id)}>
              <View style={styles.containerCompany}>
                {item.photoUrl
                  ? <Image style={styles.companyImage} source={{ uri: item.photoUrl }} />
                  : <Image style={styles.companyImage} source={companyLogo} />}

                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>{item.name}</Text>

                  <Text style={styles.companyInfoAdr}>{Address.city} - {Address.state}</Text>
                  <Text style={styles.companyInfoPhon}>{item.phone1}</Text>
                  <Text style={styles.companyInfoPhon}>{item.phone2}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
