import React, { useEffect, useState, useRef } from 'react';
import { Button, TextField, Fade, Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Autocomplete } from "@material-ui/lab"
import { fetchQuery, commitMutation } from 'react-relay';
import environment from '../../services/RelayEnvironment';

import './styles.scss';

import swal from '../../services/SweetAlert';
import api from '../../services/api';
import util from '../../services/util';
import Load from '../Load';

import ImageDefault from '../../assets/images/imageDefault.png';

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

export default function RequestEdit({ showModal, setShowModal, id, setId, reloadListFunction }) {
  const classes = useStyles();
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({});
  const [request, setRequest] = useState({});
  const [client, setClient] = useState({});
  const [address, setAddress] = useState({});
  const [products, setProducts] = useState([]);
  const statusList = [
    { value: "pending", label: "Aguardando" },
    { value: "approved", label: "Aprovado" },
    { value: "refused", label: "Recusado" },
  ]

  useEffect(() => {
    async function getProduct() {
      setLoading(true)
      try {
        const query = graphql`
        query RequestEditrequestShowQuery($id: ID!) {
          requestShow (id: $id)  {
            status
            timeWait
            createdAt
            value
            observation
            reason
            delivery
            cashBack
            Client {
              name
              photoUrl
              Address {
                cep
                street
                complement
                number
                city
                state
                district
              }
            }
            RequestProducts {
              amount
              price
              Product {
                name
              }
            }
          }
        }
      `
        const variables = { id }
        const response = await fetchQuery(environment, query, variables)

        if (response.requestShow) {
          const { requestShow } = response;
          const { Client, RequestProducts } = requestShow;

          setRequest(requestShow);
          setClient(Client);
          setAddress(Client.Address);
          setProducts(RequestProducts);
          form.current.timeWait.value = requestShow.timeWait;
          
          for (let el of statusList) {
            if (el.value === requestShow.status) {
              setStatus(el)
              break;
            }
          }

          if(requestShow.status === 'refused') form.current.reason.value = requestShow.reason;
        }

      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    };

    if (id > 0) getProduct();
  }, [id])

  function handleClose() {
    setShowModal(false);
    setStatus({});
    setId(0);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true)

    const reason = form.current.reason ? form.current.reason.value : ''

    try {
      const mutation = graphql`
        mutation RequestEditrequestChangeStatusMutation(
            $id: ID!, $status: String!, $timeWait: Int!, $reason: String
        ) {
            requestChangeStatus(
              id: $id status: $status timeWait: $timeWait reason: $reason
            )
        }
    `;

      const variables = {
        id, status: status.value, timeWait: parseInt(form.current.timeWait.value),
        reason
      };

      commitMutation(environment, {
        mutation, variables,
        onCompleted: (response, errors) => {
          const { requestChangeStatus } = response;

          if (requestChangeStatus > 0) {
            setShowModal(false);
            reloadListFunction();
            swal.swalInform();
          }
          else swal.swalErrorInform();

        },
        onError: err => {
          console.error(err);
          swal.swalErrorInform();
        },
      });

    } catch (error) {
      console.warn(error)
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

            <h2 className="request-edit-separator">Pedito {id}</h2>

            <div className="flex-row request-edit-separator">
              <img
                className="image-profile-large-rounded"
                src={client.photoUrl ? client.photoUrl : require('../../assets/images/user.png')}
                alt="Foto do cliente"
              />
              <div className="request-edit-header">
                <span>{client.name}</span>
                <span>{util.maskDate(request.createdAt)}</span>
              </div>
            </div>

            <div className="request-edit-product request-edit-separator">
              {products.map((el, index) => (
                <div key={index} className="">
                  <span>{el.amount}</span>
                  <span>{el.Product.name}</span>
                  <span>{util.maskValue(el.price)}</span>
                </div>
              ))}
            </div>

            <div className="request-edit-delivery request-edit-separator">
              <span>Total: <span>{util.maskValue(request.value)}</span></span>
              <span>Troco para: <span>{util.maskValue(request.cashBack)}</span></span>
              <span>Etregar: <span>{request.delivery ? 'SIM' : 'NÃO'}</span></span>
              {request.delivery
                ? <span>Entregar em: &nbsp;
                    <span>{address.cep}, {address.street}, {address.number},
                    {address.complement}, {address.district},
                    {address.city} - {address.state}
                  </span></span>
                : null
              }
            </div>

            <div className="request-edit-separator">
              <Autocomplete
                id="status"
                className="request-edit-status"
                options={statusList}
                getOptionLabel={(option) => option.label}
                onChange={(event, opt) => {
                  if (opt) setStatus(opt)
                }}
                value={status}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    id="status"
                    name="status"
                    label="Status"
                    variant="outlined"
                  />
                )}
              />

              <div className="input-separator">
                <TextField
                  fullWidth
                  required
                  name="timeWait"
                  type="number"
                  label={`Tempo estimado para ${request.delivery ? 'entrega' : 'retirada'} (minutos)`}
                  variant="outlined"
                  inputProps={{ min: 0, step: 1 }}
                />
              </div>

              {status.value === 'refused'
                ?
                <div className="input-separator">
                  <TextField
                    fullWidth
                    required
                    name="reason"
                    label="Motivo pela rejeição do pedido"
                    variant="outlined"
                  />
                </div>
                : null}
            </div>

            <Button fullWidth className="btn-save" type="submit">Salvar</Button>
          </form>
        </Fade>
      </Modal>
    </div>
  )
}