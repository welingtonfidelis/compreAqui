import React, { useState, useEffect, useCallback } from 'react';

import {
  View, Text, FlatList, RefreshControl,
  TouchableOpacity, Image,
} from 'react-native';
import { graphql, fetchQuery } from 'react-relay';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import environment from '../../services/createRelayEnvironment';

import globalStyles from '../globalStyles';
import styles from './styles';

import alert from '../../services/alert';

import companyLogo from '../../assets/images/store.png';

export default function HomeClient({ navigation }) {
  const [load, setLoad] = useState(false);
  const [categoryId, setCategoryId] = useState(1);
  const [categoryName, setCategoryName] = useState(0);
  const [companyList, setCompanyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadMore, setLoadMore] = useState(true);
  const dispatch = useDispatch();
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
                    CategoryId :id
                    name
                }
            }`;

      const variables = {};
      const response = await fetchQuery(environment, query, variables);

      const { categoryIndex } = response;
      if (categoryIndex) {
        setCategoryList(categoryIndex);
        setCategoryName(categoryIndex[0].name);
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
                  ProviderId: id
                  name
                  photoUrl
                  phone1
                  phone2
                  Address {
                    city
                    state
                  }
                }
            }`;

      const variables = { page, categoryId };
      const response = await fetchQuery(environment, query, variables);

      const { userIndexByCategory } = response;
      if (userIndexByCategory) {
        if (isRefreshing) {
          setIsRefreshing(false);
          setCompanyList(userIndexByCategory);
        }
        else { setCompanyList([...companyList, ...userIndexByCategory]); }
      }
      setLoadMore(userIndexByCategory.length > 0);

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
    await setIsRefreshing(true);

    await setLoadMore(true);
    if (page === 1) { getCompany(); }
    else { setPage(1); }

    setRefreshing(false);
  }, [refreshing]);

  function activityIndicatorShow() {
    const resp = load ? <ActivityIndicator animating={load} /> : null;
    return resp;
  }

  async function handleSelectCategory(id, index) {
    await setLoadMore(true);
    await setIsRefreshing(true);

    setCategoryId(id);
    setCategoryName(categoryList[index].name);
  }

  function handleSelectCompany(item) {
    dispatch({ type: 'UPDATE_COMPANY', company: { name: item.name, id: item.ProviderId } });
    navigation.push('purchaseList');
  }

  return (
    <View style={globalStyles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.categoryTitle}>Categorias</Text>

        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={categoryList}
          keyExtractor={item => `${item.id}`}
          numColumns={1}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onEndReachedThreshold={0.3}
          onEndReached={({ distanceFromEnd }) => { }}
          renderItem={({ item, index }) => {

            return (
              <TouchableOpacity
                onPress={() => handleSelectCategory(item.CategoryId, index)}>
                <View style={styles.containerCategory}>
                  <Image style={styles.categoryImage} source={{ uri: photoTmp }} />

                  <View style={styles.categoryViewText}>
                    <Text style={styles.catetegoryText}>{item.name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={{ flex: 2 }}>
        <Text style={styles.categoryTitle}>{categoryName}</Text>

        <FlatList
          data={companyList}
          keyExtractor={item => `${item.id}`}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          onEndReached={({ distanceFromEnd }) => { if (loadMore) { setPage(page + 1); } }}
          ListFooterComponent={activityIndicatorShow}
          renderItem={({ item }) => {

            const { Address } = item;
            return (
              <TouchableOpacity
                onPress={() => handleSelectCompany(item)}>
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
    </View>
  );
}
