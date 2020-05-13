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

export default function BrandNew({ showModal, setShowModal, id, setId, reloadListFunction }) {
  const classes = useStyles();
  const form = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getBrand() {
      setLoading(true)
      try {
        const query = graphql`
        query BrandNewbrandShowQuery($id: ID!) {
          brandShow (id: $id)  {
            brandDescription
          }
        }
      `
        const variables = { id }
        const response = await fetchQuery(environment, query, variables)

        if (response.brandShow) {
          const { brandShow } = response;

          form.current.brandDescription.value = brandShow.brandDescription;
        }

      } catch (error) {
        console.error(error);
        swal.swalErrorInform(
          null,
          'Houve um erro ao trazer as informações desta marca. Tente novamente.'
        )
      }
      setLoading(false)
    };

    if (id > 0) getBrand();
  }, [id])

  function handleClose() {
    setShowModal(false);
    setId(0);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true)

    try {
      const brandDescription = form.current.brandDescription.value;

      let mutation = graphql`
            mutation BrandNewbrandStoreMutation(
                $brandDescription: String!
            ) {
              brandStore(brandDescription: $brandDescription ){
                id
              }
            }
        `;

      if (id > 0) {
        mutation = graphql`
            mutation BrandNewbrandUpdateMutation(
              $id: ID! 
              $brandDescription: String!
            ) {
              brandUpdate( 
                id: $id
                brandDescription: $brandDescription 
              )
            }
        `;
      }
      const variables = { id, brandDescription };

      commitMutation(environment, {
        mutation, variables,
        onCompleted: (response, errors) => {
          
          if(id > 0) {
            const { brandUpdate } = response;
            if (brandUpdate > 0) {
              setShowModal(false);
              reloadListFunction();
              swal.swalInform();
            }
            else swal.swalErrorInform();
          }
          else {
            const { brandStore } = response;
            if (brandStore.id > 0) {
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
                name="brandDescription"
                label="Nome da marca"
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