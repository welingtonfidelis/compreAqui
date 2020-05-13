import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { Edit, Search, Delete } from '@material-ui/icons';
import { fetchQuery, commitMutation } from 'react-relay';
import environment from '../../services/RelayEnvironment';

import ModalBrandEdit from '../../components/BrandNew';
import Load from '../../components/Load';

import swal from '../../services/SweetAlert';

import './styles.scss';
import tag from '../../assets/images/tag.png';

const graphql = require('babel-plugin-relay/macro');

export default function Brands() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brandList, setBrandList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [editId, setEditId] = useState(0);

  useEffect(() => {
    getBrandList();
  }, [page]);

  async function getBrandList() {
    setLoading(true)
    try {
      const query = graphql`
        query BrandsrbrandIndexAndbrandCountQuery($page: Int) {
          brandIndex (page: $page)  {
            id
            brandDescription
          }

          brandCount
        }
      `

      const variables = { page }
      const response = await fetchQuery(environment, query, variables)

      if (response.brandIndex) {
        setBrandList(response.brandIndex);
      }
      if (response.brandCount) {
        let tmp = ((response.brandCount / 15) + '').split('.');
        tmp = tmp[1] ? parseInt(tmp[0]) + 1 : tmp[0];

        setTotalPage(tmp);
      }

      setEditId(0);

    } catch (error) {
      console.error(error);
      swal.swalErrorInform(
        null,
        "Parece que algo deu errado na busca por suas marcas. Tente novamente"
      );
    }
    setLoading(false)
  }

  function handleEditBrand(id) {
    setEditId(id);
    setShowModal(!showModal);
  }

  async function reloadList() {
    setEditId(0);
    getBrandList();
  }

  async function handleDeleteBrand(id) {
    const resp = await swal.swalConfirm(
      'Excluir',
      'Gostaria realmente de excluir esta marca?'
    );

    if (resp) {
      const mutation = graphql`
            mutation BrandsbrandDeleteMutation(
                $id: ID!
            ) {
              brandDelete(id: $id )
            }
        `;

      const variables = { id };

      commitMutation(environment, {
        mutation, variables,
        onCompleted: (response, errors) => {
          const { brandDelete } = response;

          if (brandDelete > 0) {
            swal.swalInform();
            getBrandList();
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

  return (
    <div className="content">
      <Load id="divLoading" loading={loading} />

      <div className="search-bar">
        <input
          style={{ flex: 1 }}
          placeholder="Procurar marca"
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

      {brandList.map(el => {
        return (
          <div key={el.id} className="request-list-content">
            <div className="flex-row">
              <img src={tag} alt="Marca" />
              <div className="request-list-dsc" style={{ flex: 1 }}>
                <span>Marca: <h3>{el.brandDescription}</h3></span>
              </div>
            </div>

            <div className="btn-list-conteiner">
              <div className="btn-list-edit" onClick={() => handleEditBrand(el.id)}>
                <Edit />
              </div>
              <div className="btn-list-del" onClick={() => handleDeleteBrand(el.id)}>
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

      <ModalBrandEdit
        showModal={showModal}
        setShowModal={setShowModal}
        id={editId}
        setId={setEditId}
        reloadListFunction={reloadList}
      />
    </div>
  )
}