import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { AccessibleForward } from '@material-ui/icons';
import { fetchQuery } from 'react-relay';
import environment from '../../services/RelayEnvironment';

import ModalProductNew from '../../components/ProductNew';

import './styles.scss';

const graphql = require('babel-plugin-relay/macro');

export default function Products() {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medicEditId, setMedicEditId] = useState(0);

  function handleNewProduct() {
    setShowModal(!showModal);
  }

  async function getListMedics() {
    console.log('lista de produtos');

  }

  return (
    <div className="content">

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
        id={medicEditId}
        reloadListFunction={getListMedics} 
      />
    </div>
  )
}