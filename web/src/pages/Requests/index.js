import React, { useEffect, useState } from 'react';
import { Button, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { Edit, Search, SentimentDissatisfied, Mood, MoodBad } from '@material-ui/icons';
import { fetchQuery } from 'react-relay';
import environment from '../../services/RelayEnvironment';

import ModalRequestEdit from '../../components/RequestEdit';
import Load from '../../components/Load';

import util from '../../services/util';
import swal from '../../services/SweetAlert';

import './styles.scss';

const graphql = require('babel-plugin-relay/macro');

export default function Requests() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestList, setRequestList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [editId, setEditId] = useState(0);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    getRequestList();
  }, [page, status]);

  async function getRequestList() {
    setLoading(true)
    try {
      const query = graphql`
        query RequestsrequestIndexAndrequestCountQuery($page: Int, $status: String) {
          requestIndex (page: $page, status: $status)  {
            id
            ClientId
            value
            status
            createdAt
            Client {
              name
              photoUrl
            }
          }

          requestCount (status: $status)
        }
      `

      const variables = { page, status }
      const response = await fetchQuery(environment, query, variables)

      if (response.requestIndex) {
        setRequestList(response.requestIndex);
      }
      if (response.productCount) {
        let tmp = ((response.productCount / 15) + '').split('.');
        tmp = tmp[1] ? parseInt(tmp[0]) + 1 : tmp[0];

        setTotalPage(tmp);
      }

      setEditId(0);

    } catch (error) {
      console.error(error);
      swal.swalErrorInform(
        null,
        "Parece que algo deu errado na busca por seus pedidos. Tente novamente"
      );
    }
    setLoading(false)
  }

  function handleEditRequest(id) {
    setEditId(id);
    setShowModal(!showModal);
  }

  async function reloadList() {
    setEditId(0);
    getRequestList();
  }

  function handleChangeStatus(event, newValue) {
    setStatus(newValue);
  };

  return (
    <div className="content">
      <Load id="divLoading" loading={loading} />

      <BottomNavigation value={status} onChange={handleChangeStatus} className="headerNavigationRequest">
        <BottomNavigationAction label="Aguardando" value="pending" icon={<SentimentDissatisfied />} />
        <BottomNavigationAction label="Aprovado" value="approved" icon={<Mood />} />
        <BottomNavigationAction label="Recusado" value="refused" icon={<MoodBad />} />
      </BottomNavigation>

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
      </div>

      {requestList.map(el => {
        const { Client } = el;
        const photoUrl = Client.photoUrl
          ? Client.photoUrl
          : require('../../assets/images/user.png');
        let colorStatus = { color: "#3f51b5" }, status = 'Aguardando';
        if (el.status === 'approved') {
          colorStatus = { color: "#4caf50" };
          status = "Aprovado";
        }
        else if (el.status === 'refused') {
          colorStatus = { color: "red" };
          status = "Recusado";
        }

        return (
          <div key={el.id} className="request-list-content">
            <div className="flex-row">
              <img src={photoUrl} alt="Foto do produto" />
              <div className="request-list-dsc" style={{ flex: 1 }}>
                <h3>{el.name}</h3>
                <span>Cliente: {Client.name}</span>
                <span>Status do pedido: <span style={colorStatus}>{status}</span></span>
              </div>

              <div className="flex-col">
                <span>{util.maskDate(el.createdAt)}</span>
                <span>{util.maskValue(el.value)}</span>
              </div>
            </div>

            <div className="btn-list-conteiner">
              <div className="btn-list-edit" onClick={() => handleEditRequest(el.id)}>
                <Edit />
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

      <ModalRequestEdit
        showModal={showModal}
        setShowModal={setShowModal}
        id={editId}
        setId={setEditId}
        reloadListFunction={reloadList}
      />
    </div>
  )
}