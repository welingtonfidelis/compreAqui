import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { AccessibleForward } from '@material-ui/icons';
import { fetchQuery } from 'react-relay';
import environment from '../../services/RelayEnvironment';

import ModalProductNew from '../../components/ProductNew';
import Load from '../../components/Load';

import './styles.scss';

const graphql = require('babel-plugin-relay/macro');

export default function Products() {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getProductList();
  }, [page]);

  async function getProductList() {
    setLoading(true)
    try {
      const query = graphql`
        query ProductsproductIndexQuery($page: Int) {
          productIndex (page: $page)  {
            id
            name
            description
            price
            stock
            ProductPhotos {
              photoUrl
            }
          }
        }
      `

      const variables = {page}
      const response = await fetchQuery(environment, query, variables)

      console.log(response);

      if (response.productIndex) {
        setProductList(response.productIndex)
        console.log(response.productIndex);
        
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  function handleNewProduct() {
    setShowModal(!showModal);
  }

  async function reloadList() {
    console.log('lista de produtos');

  }

  return (
    <div className="content">
      <Load id="divLoading" loading={loading} />

      <h1>Dash comercial</h1>
      <h2>teste</h2>
        OOOOI
      <Button variant="contained" color="primary" onClick={handleNewProduct}>
        <AccessibleForward />
          Hello World
        </Button>

      <ModalProductNew
        showModal={showModal}
        setShowModal={setShowModal}
        id={0}
        reloadListFunction={reloadList}
      />
    </div>
  )
}