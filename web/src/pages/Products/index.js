import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { Edit, Delete, Search } from '@material-ui/icons';
import { fetchQuery, commitMutation } from 'react-relay';
import environment from '../../services/RelayEnvironment';

import ModalProductNew from '../../components/ProductNew';
import Load from '../../components/Load';

import util from '../../services/util';
import swal from '../../services/SweetAlert';

import './styles.scss';

const graphql = require('babel-plugin-relay/macro');

export default function Products() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [editId, setEditId] = useState(0);

  useEffect(() => {
    getProductList();
  }, [page]);

  async function getProductList() {
    setLoading(true)
    try {
      const query = graphql`
        query ProductsproductIndexAndproductCountQuery($page: Int) {
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

          productCount
        }
      `

      const variables = { page }
      const response = await fetchQuery(environment, query, variables)

      if (response.productIndex) {
        setProductList(response.productIndex);
      }
      if (response.productCount) {
        let tmp = ((response.productCount / 15) + '').split('.');
        tmp = tmp[1] ? parseInt(tmp[0]) + 1 : tmp[0];

        setTotalPage(tmp);
      }

      setEditId(0);

    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  async function handleDeleteProduct(id) {
    const resp = await swal.swalConfirm(
      'Excluir',
      'Gostaria realmente de excluir este produto?'
    );

    if (resp) {
      const mutation = graphql`
            mutation ProductsproductDeleteMutation(
                $id: ID!
            ) {
              productDelete(id: $id )
            }
        `;

      const variables = { id };

      commitMutation(environment, {
        mutation, variables,
        onCompleted: (response, errors) => {
          const { productDelete } = response;

          if (productDelete > 0) {
            swal.swalInform();
            getProductList();
          }
          else swal.swalErrorInform();
        },
        onError: err => {
          console.error(err);
          swal.swalErrorInform();
        },
      });
    }
  }

  function handleNewProduct() {
    setShowModal(!showModal);
  }

  function handleEditProduct(id) {
    setEditId(id);
    setShowModal(!showModal);
  }

  async function reloadList() {
    setEditId(0);
    getProductList();
  }

  return (
    <div className="content">
      <Load id="divLoading" loading={loading} />

      <div className="search-bar">
        <input
          style={{ flex: 1 }}
          placeholder="Procurar produto"
          value={filter}
          onChange={event => setFilter(event.target.value)}
        />

        <Button variant="contained" color="primary" onClick={() => console.log('busca')}>
          <Search />
        </Button>

        <Button variant="contained" onClick={handleNewProduct}>
          Novo
        </Button>
      </div>

      {productList.map(el => {
        const { ProductPhotos } = el;
        const photoUrl = ProductPhotos[0]
          ? ProductPhotos[0].photoUrl
          : require('../../assets/images/bag.png');
        const colorStock = el.stock > 0 ? {} : { color: 'red' };

        return (
          <div key={el.id} className="product-list-content">
            <div className="flex-row" style={{ flex: 1 }}>
              <img src={photoUrl} alt="Foto do produto" />
              <div className="product-list-dsc">
                <h3>{el.name}</h3>
                <span>Preço atual: {util.maskValue(el.price)}</span>
                <span style={colorStock}>Estoque: {el.stock}</span>
              </div>
            </div>

            <div className="btn-list-conteiner">
              <div className="btn-list-edit" onClick={() => handleEditProduct(el.id)}>
                <Edit />
              </div>
              <div className="btn-list-del" onClick={() => handleDeleteProduct(el.id)}>
                <Delete />
              </div>
            </div>

          </div>
        )
      })}

      <div className="pagination">
        <Pagination
          count={totalPage}
          color="primary"
          value={page}
          onChange={(e, p) => setPage(p)}
        />
      </div>

      <ModalProductNew
        showModal={showModal}
        setShowModal={setShowModal}
        id={editId}
        setId={setEditId}
        reloadListFunction={reloadList}
      />
    </div>
  )
}