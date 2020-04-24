import React, { useEffect, useState } from 'react';
import { Button, TextField, Fade, Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { AccessibleForward } from '@material-ui/icons';
import { fetchQuery } from 'react-relay';
import environment from '../../services/RelayEnvironment';

import './styles.scss';

import swal from '../../services/SweetAlert';
import util from '../../services/util';
import api from '../../services/api';
import Load from '../Load';

const graphql = require('babel-plugin-relay/macro');

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function ProductNew({ showModal, setShowModal, id, reloadListFunction }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');

  function handleClose() {
    setShowModal(false);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    console.log('salvar');
    reloadListFunction();
  }

  return (
    <div className="content">
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={showModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showModal}>
          <form id="form-modal" onSubmit={handleSubmit} className={classes.paper}>
            <Load id="divLoading" loading={loading} />
            
            <h2>{id > 0 ? "Editar médico" : "Cadastrar médico"}</h2>

            <div >
              <TextField
                fullWidth
                required
                id="description"
                label="Nome"
                variant="outlined"
                value={description}
                onChange={event => setDescription(event.target.value)}
              />
            </div>

            <Button fullWidth className="btn-action" type="submit">Salvar</Button>
          </form>
        </Fade>
      </Modal>
    </div>
  )
}