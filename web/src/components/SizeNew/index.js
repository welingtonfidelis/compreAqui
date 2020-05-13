import React, { useEffect, useState, useRef } from 'react';
import { Button, TextField, Fade, Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { fetchQuery, commitMutation } from 'react-relay';
import environment from '../../services/RelayEnvironment';

import './styles.scss';

import swal from '../../services/SweetAlert';
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

export default function SizeNew({ showModal, setShowModal, id, setId, reloadListFunction }) {
  const classes = useStyles();
  const form = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getSize() {
      setLoading(true)
      try {
        const query = graphql`
        query SizeNewsizeShowQuery($id: ID!) {
          sizeShow (id: $id)  {
            sizeDescription
          }
        }
      `
        const variables = { id }
        const response = await fetchQuery(environment, query, variables)

        if (response.sizeShow) {
          const { sizeShow } = response;

          form.current.sizeDescription.value = sizeShow.sizeDescription;
        }

      } catch (error) {
        console.error(error);
        swal.swalErrorInform(
          null,
          'Houve um erro ao trazer as informações deste tamanho. Tente novamente.'
        )
      }
      setLoading(false)
    };

    if (id > 0) getSize();
  }, [id])

  function handleClose() {
    setShowModal(false);
    setId(0);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true)

    try {
      const sizeDescription = form.current.sizeDescription.value;

      let mutation = graphql`
            mutation SizeNewsizeStoreMutation(
                $sizeDescription: String!
            ) {
              sizeStore(sizeDescription: $sizeDescription ){
                id
              }
            }
        `;

      if (id > 0) {
        mutation = graphql`
            mutation SizeNewsizeUpdateMutation(
              $id: ID! 
              $sizeDescription: String!
            ) {
              sizeUpdate( 
                id: $id
                sizeDescription: $sizeDescription 
              )
            }
        `;
      }
      const variables = { id, sizeDescription };

      commitMutation(environment, {
        mutation, variables,
        onCompleted: (response, errors) => {
          
          if(id > 0) {
            const { sizeUpdate } = response;
            if (sizeUpdate > 0) {
              setShowModal(false);
              reloadListFunction();
              swal.swalInform();
            }
            else swal.swalErrorInform();
          }
          else {
            const { sizeStore } = response;
            if (sizeStore.id > 0) {
              setShowModal(false);
              reloadListFunction();
              swal.swalInform();
            }
            else swal.swalErrorInform();
          }
        },
        onError: err => {
          console.error(err);
          swal.swalErrorInform();
        },
      });

    } catch (error) {
      console.log(error)
      swal.swalErrorInform()
    }
    setLoading(false)
  }

  return (
    <div>
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
          <form ref={form} id="form-modal" onSubmit={handleSubmit} className={classes.paper}>
            <Load id="divLoading" loading={loading} />

            <h2>{id > 0 ? "Editar marca" : "Cadastrar marca"}</h2>

            <div className="input-separator">
              <TextField
                fullWidth
                required
                name="sizeDescription"
                label="Tamanho"
                variant="outlined"
              />
            </div>

            <Button fullWidth className="btn-save" type="submit">Salvar</Button>
          </form>
        </Fade>
      </Modal>
    </div>
  )
}