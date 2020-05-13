import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { Edit, Search, Delete } from '@material-ui/icons';
import { fetchQuery, commitMutation } from 'react-relay';
import environment from '../../services/RelayEnvironment';

import ModalSizeEdit from '../../components/SizeNew';
import Load from '../../components/Load';

import swal from '../../services/SweetAlert';

import './styles.scss';
import ruler from '../../assets/images/ruler.png';

const graphql = require('babel-plugin-relay/macro');

export default function Sizes() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sizeList, setSizeList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [editId, setEditId] = useState(0);

  useEffect(() => {
    getSizeList();
  }, [page]);

  async function getSizeList() {
    setLoading(true)
    try {
      const query = graphql`
        query SizessizeIndexAndsizeCountQuery($page: Int) {
          sizeIndex (page: $page)  {
            id
            sizeDescription
          }

          sizeCount
        }
      `

      const variables = { page }
      const response = await fetchQuery(environment, query, variables)

      if (response.sizeIndex) {
        setSizeList(response.sizeIndex);
      }
      if (response.sizeCount) {
        let tmp = ((response.sizeCount / 15) + '').split('.');
        tmp = tmp[1] ? parseInt(tmp[0]) + 1 : tmp[0];

        setTotalPage(tmp);
      }

      setEditId(0);

    } catch (error) {
      console.error(error);
      swal.swalErrorInform(
        null,
        "Parece que algo deu errado na busca por seus tamanhos. Tente novamente"
      );
    }
    setLoading(false)
  }

  function handleEditSize(id) {
    setEditId(id);
    setShowModal(!showModal);
  }

  async function reloadList() {
    setEditId(0);
    getSizeList();
  }

  async function handleDeleteSize(id) {
    const resp = await swal.swalConfirm(
      'Excluir',
      'Gostaria realmente de excluir este tamanho?'
    );

    if (resp) {
      const mutation = graphql`
            mutation SizessizeDeleteMutation(
                $id: ID!
            ) {
              sizeDelete(id: $id )
            }
        `;

      const variables = { id };

      commitMutation(environment, {
        mutation, variables,
        onCompleted: (response, errors) => {
          const { sizeDelete } = response;

          if (sizeDelete > 0) {
            swal.swalInform();
            getSizeList();
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

  function handleNewSize() {
    setShowModal(!showModal);
  }

  return (
    <div className="content">
      <Load id="divLoading" loading={loading} />

      <div className="search-bar">
        <input
          style={{ flex: 1 }}
          placeholder="Procurar tamanho"
          value={filter}
          onChange={event => setFilter(event.target.value)}
        />

        <Button variant="contained" color="primary" onClick={() => console.log('busca')}>
          <Search />
        </Button>

        <Button variant="contained" onClick={handleNewSize}>
          Novo
        </Button>
      </div>

      {sizeList.map(el => {
        return (
          <div key={el.id} className="request-list-content">
            <div className="flex-row">
              <img src={ruler} alt="Marca" />
              <div className="request-list-dsc" style={{ flex: 1 }}>
                <span>Marca: <h3>{el.sizeDescription}</h3></span>
              </div>
            </div>

            <div className="btn-list-conteiner">
              <div className="btn-list-edit" onClick={() => handleEditSize(el.id)}>
                <Edit />
              </div>
              <div className="btn-list-del" onClick={() => handleDeleteSize(el.id)}>
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

      <ModalSizeEdit
        showModal={showModal}
        setShowModal={setShowModal}
        id={editId}
        setId={setEditId}
        reloadListFunction={reloadList}
      />
    </div>
  )
}