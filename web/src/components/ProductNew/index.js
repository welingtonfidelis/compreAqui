import React, { useEffect, useState, useRef } from 'react';
import { Button, TextField, Fade, Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Autocomplete } from "@material-ui/lab"
import { fetchQuery } from 'react-relay';
import environment from '../../services/RelayEnvironment';

import './styles.scss';

import swal from '../../services/SweetAlert';
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

export default function ProductNew({ showModal, setShowModal, id, setId, reloadListFunction }) {
  const classes = useStyles();
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [brandList, setBrandList] = useState([]);
  const [sizeList, setSizeList] = useState([]);
  const [subCategoryList, SetSubcategoryList] = useState([]);
  const [brand, setBrand] = useState(null);
  const [size, setSize] = useState(null);
  const [subcategory, setSubcategory] = useState({});
  const [file, setFile] = useState([]);
  const [fileDefault, setFileDefault] = useState(mountDefaultFile());

  useEffect(() => {
    async function getProduct() {
      setLoading(true)
      try {
        const query = graphql`
        query ProductNewproductShowQuery($id: ID!) {
          productShow (id: $id)  {
            ProviderId
            BrandId
            SizeId
            SubcategoryId
            description
            name
            price
            stock
            ProductPhotos {
              photoUrl
            }
          }
        }
      `
        const variables = { id }
        const response = await fetchQuery(environment, query, variables)

        if(response.productShow) {
          const { productShow } = response;

          for(let el of brandList){
            if (el.id === productShow.BrandId) {
              setBrand(el)
              break;
            }
          }
          for(let el of sizeList){
            if (el.id === productShow.SizeId) {
              setSize(el)
              break;
            }
          }
          for(let el of subCategoryList){
            if (el.id === productShow.SubcategoryId) {
              setSubcategory(el);
              break;
            }
          }

          form.current.name.value = productShow.name;
          form.current.description.value = productShow.description;
          form.current.stock.value = productShow.stock;
          form.current.price.value = productShow.price;

          let tmp = fileDefault;
          (productShow.ProductPhotos).forEach((el, index) => {
            tmp[index] = el.photoUrl;
          })
          setFileDefault(tmp);
        }

      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    };

    if (id > 0) getProduct();
  }, [id])

  useEffect(() => {
    async function getInfo() {
      setLoading(true)
      try {
        const query = graphql`
          query ProductNewbrandIndexAndsizeIndexAndsubcategoryIndexByUserQuery {
            brandIndex{
              id
              brandDescription
            }
          
            sizeIndex{
              id
              sizeDescription
            }

            subcategoryIndexByUser {
              id
              name
            }
          }
        `

        const variables = {}
        const response = await fetchQuery(environment, query, variables)

        if (response.brandIndex) {
          setBrandList(response.brandIndex);
        }
        if (response.sizeIndex) {
          setSizeList(response.sizeIndex);
        }
        if (response.subcategoryIndexByUser) {
          SetSubcategoryList(response.subcategoryIndexByUser);
        }

      } catch (error) {
        console.error(error);
      }
      setLoading(false)
    }

    getInfo();
  }, []);

  function handleClose() {
    setShowModal(false);
    setFileDefault(mountDefaultFile());
    setBrand(null);
    setSize(null);
    setId(0);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true)

    try {
      const { name, description, price, stock } = form.current;

      const data = new FormData();
      data.append("name", name.value);
      data.append("description", description.value);
      data.append("price", price.value);
      data.append("stock", stock.value);
      data.append("BrandId", brand.id);
      data.append("SizeId", size.id);
      data.append("SubcategoryId", subcategory.id);

      const companyName = (localStorage.getItem('compreAqui@name')).replace(' ', '_');
      file.forEach((el, index) => {
        const ext = (el.type).split('/');
        data.append("files", el, `${companyName}_${name.value}_${index}.${ext[1]}`);        
      });

      let query = null 
      if(id > 0) {
        query = await api.put(`product/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      else {
        query = await api.post("product", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const { status } = query.data
      if (status) {
        setShowModal(false);
        reloadListFunction(data);
        swal.swalInform();
      }
      else swal.swalErrorInform();

    } catch (error) {
      console.warn(error)
      swal.swalErrorInform()
    }
    setLoading(false)
  }

  function handleSetImage(index, photo) {
    let tmp = file;
    tmp[index] = photo;

    document.getElementById(`img_${index}`).src = URL.createObjectURL(photo);
    setFile(tmp);
  }

  function mountDefaultFile() {
    const tmp = [];
    for(let i = 0; i < 3; i++) {
      tmp.push(require('../../assets/images/imageDefault.png'));
    }
    return tmp;
  }

  function MountImageDiv() {
    let html = [];
    for (let i = 0; i < 3; i++) {
      html.push(
        <div key={i}>
          <label htmlFor={`file_${i}`}>
            <img
              id={`img_${i}`}
              className="image-profile-large"
              src={ fileDefault[i] }
              alt="Foto produto"
            />
          </label>

          <input
            type="file"
            id={`file_${i}`}
            onChange={(e) => handleSetImage(i, e.target.files[0])}
            style={{ display: "none" }}
          />
        </div>
      )
    }
    return html;
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

            <h2>{id > 0 ? "Editar produto" : "Cadastrar produto"}</h2>

            <Autocomplete
              id="subcategory"
              className="input-separator"
              options={subCategoryList}
              getOptionLabel={(option) => option.name}
              onChange={(event, opt) => {
                if (opt) setSubcategory(opt)
              }}
              value={subcategory}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  id="subcategory"
                  name="subcategory"
                  label="Subcategoria"
                  variant="outlined"
                />
              )}
            />

            <Autocomplete
              id="brand"
              className="input-separator"
              options={brandList}
              getOptionLabel={(option) => option.brandDescription}
              onChange={(event, opt) => {
                if (opt) setBrand(opt)
              }}
              value={brand}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  id="brand"
                  name="brand"
                  label="Marca"
                  variant="outlined"
                />
              )}
            />

            <Autocomplete
              id="size"
              className="input-separator"
              options={sizeList}
              getOptionLabel={(option) => option.sizeDescription}
              onChange={(event, opt) => {
                if (opt) setSize(opt)
              }}
              value={size}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  required
                  id="size"
                  name="size"
                  label="Tamanho"
                  variant="outlined"
                />
              )}
            />

            <div className="input-separator">
              <TextField
                fullWidth
                required
                name="name"
                label="Nome"
                variant="outlined"
              />
            </div>

            <div className="input-separator">
              <TextField
                fullWidth
                required
                name="description"
                label="Descrição"
                variant="outlined"
              />
            </div>

            <div className="input-separator">
              <TextField
                fullWidth
                required
                name="price"
                label="Preço"
                type="number"
                inputProps={{step: "any"}}
                variant="outlined"
              />
            </div>

            <div className="input-separator">
              <TextField
                fullWidth
                required
                name="stock"
                label="Estoque"
                type="number"
                variant="outlined"
              />
            </div>

            <div className="product-image-select">
              <MountImageDiv />
            </div>

            <Button fullWidth className="btn-save" type="submit">Salvar</Button>
          </form>
        </Fade>
      </Modal>
    </div>
  )
}