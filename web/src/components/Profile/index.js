import React, { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { format } from "date-fns"
import { Button, TextField } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab"
import NumberFormat from "react-number-format"
import { fetchQuery } from "react-relay"
import environment from "../../services/RelayEnvironment"

import swal from "../../services/SweetAlert"
import util from "../../services/util"
import api from "../../services/api"
import Load from "../Load"

import ImageProfile from "../../assets/images/user.png"
import "./styles.scss"
import "../../global.scss"

const graphql = require("babel-plugin-relay/macro")

export default function Profile(props) {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [doc, setDoc] = useState("")
  const [docFormat, setDocFormat] = useState({
    dsc: "CPF",
    mask: "###.###.###-##",
  })
  const [email, setEmail] = useState("")
  const [phone1, setPhone1] = useState("")
  const [phone2, setPhone2] = useState("")
  const [user, setUser] = useState("")
  const [birth, setBirth] = useState(format(new Date(), "yyyy-MM-dd"))
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [type, setType] = useState("")
  const [cep, setCep] = useState("")
  const [state, setState] = useState(null)
  const [stateList, setStateList] = useState([])
  const [category, setCategory] = useState(null)
  const [categoryList, setCategoryList] = useState([])
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [street, setStreet] = useState("")
  const [complement, setComplement] = useState("")
  const [number, setNumber] = useState("")
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (props.type) {
      getInfo()
      setType(props.type)
      if (props.type !== "client") {
        setDocFormat({ dsc: "CNPJ", mask: "##.###.###/####-##" })
      }
    }
  }, [])

  async function getInfo() {
    setLoading(true)
    try {
      const query = graphql`
        query ProfilestateIndexAndcategoryIndexQuery {
          stateIndex {
            stateId: id
            description
            code
          }
          categoryIndex {
            id
            name
          }
        }
      `

      const variables = {}
      const response = await fetchQuery(environment, query, variables)

      if (response.stateIndex) {
        setStateList(response.stateIndex)
      }
      if (response.categoryIndex) {
        setCategoryList(response.categoryIndex)
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append("name", name)
      data.append("doc", doc)
      data.append("email", email)
      data.append("phone1", phone1)
      data.append("phone2", phone2)
      data.append("user", user)
      data.append("birth", birth)
      data.append("password", password)
      data.append("type", type)
      data.append("cep", cep)
      data.append("state", state.code)
      data.append("city", city)
      data.append("district", district)
      data.append("street", street)
      data.append("number", number)
      data.append("complement", complement)

      if (category) {
        data.append("CategoryId", category.value)
      }

      if (file) {
        data.append("file", file)
      }

      const query = await api.post("user", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const { status } = query.data
      if (status) {
        swal.swalInform()
        setLoading(false)
        history.push("/")
        return
      } else swal.swalErrorInform()
    } catch (error) {
      console.log(error)
      swal.swalErrorInform()
    }
   
    setLoading(false)
  }

  async function handleCheckEmail() {
    if (email !== "") {
      setLoading(true)
      try {
        const query = graphql`
          query ProfileuserShowByEmailQuery($email: String!) {
            userShowByEmail(email: $email) {
              id
            }
          }
        `

        const variables = { email }
        const response = await fetchQuery(environment, query, variables)
        const div = document.getElementById("email")
        if (response.userShowByEmail) {
          div.setCustomValidity("E-mail já em uso.")
          div.reportValidity()
        } else div.setCustomValidity("")
      } catch (error) {
        console.error(error)
      }

      setLoading(false)
    }
  }

  async function handleCheckUser() {
    if (user !== "") {
      setLoading(true)
      try {
        const query = graphql`
          query ProfileuserShowByUserQuery($user: String!) {
            userShowByUser(user: $user) {
              id
            }
          }
        `

        const variables = { user }
        const response = await fetchQuery(environment, query, variables)
        const div = document.getElementById("user")
        if (response.userShowByUser) {
          div.setCustomValidity("Usuário já em uso.")
          div.reportValidity()
        } else div.setCustomValidity("")
      } catch (error) {
        console.error(error)
      }

      setLoading(false)
    }
  }

  async function handleCheckDoc() {
    if (doc !== "") {
      setLoading(true)
      try {
        const query = graphql`
          query ProfileuserShowByDocQuery($doc: String!) {
            userShowByDoc(doc: $doc) {
              id
            }
          }
        `

        const variables = { doc }
        const response = await fetchQuery(environment, query, variables)
        const div = document.getElementById("doc")
        if (response.userShowByDoc) {
          div.setCustomValidity(`${docFormat.dsc} já em uso.`)
          div.reportValidity()
        } else div.setCustomValidity("")
      } catch (error) {
        console.error(error)
      }

      setLoading(false)
    }
  }

  async function handleCheckConfirmPassword() {
    const div = document.getElementById("passwordConfirm")

    if (password !== passwordConfirm) {
      div.setCustomValidity("As senhas não conferem.")
    } else div.setCustomValidity("")
  }

  async function handleCep() {
    setLoading(true)
    const response = await util.getCep(cep)

    if (response) {
      setStreet(response.logradouro)
      setComplement(response.complemento)
      setDistrict(response.bairro)
      setCity(response.localidade)
      setState({ name: response.uf, value: response.uf })
    }

    setLoading(false)
  }

  return (
    <form
      className="flex-col profile-form"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <Load loading={loading} />
      <h1 className="title-modal">
        {type === "client" ? "Cliente" : "Empresa"}
      </h1>

      <div>
        <label htmlFor="file">
          <img
            className="image-profile-large"
            src={file ? URL.createObjectURL(file) : ImageProfile}
            alt="Foto perfil"
          />
        </label>
      </div>

      <input
        type="file"
        id="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ display: "none" }}
      />

      {type === "comercial" ? (
        <div className="input-separator">
          <Autocomplete
            id="combo-box-demo"
            options={categoryList}
            getOptionLabel={(option) => option.name}
            onChange={(event, opt) => {
              if (opt) setCategory(opt)
            }}
            value={category}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                required
                id="category"
                label="Categoria"
                variant="outlined"
              />
            )}
          />
        </div>
      ) : null}

      <div className="flex-row-w">
        <div className="input-separator">
          <NumberFormat
            required
            id="doc"
            value={doc}
            onChange={(event) => setDoc(event.target.value)}
            onBlur={handleCheckDoc}
            format={docFormat.mask}
            label="teste"
            placeholder={docFormat.dsc}
            mask="_"
          />
        </div>

        <div className="input-separator">
          <TextField
            fullWidth
            required
            type="date"
            id="birth"
            label="Data de nascimento"
            variant="outlined"
            value={birth}
            onChange={(event) => setBirth(event.target.value)}
          />
        </div>
      </div>

      <div className="input-separator">
        <TextField
          fullWidth
          required
          id="name"
          label="Nome do usuário"
          variant="outlined"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="input-separator">
        <TextField
          fullWidth
          required
          type="email"
          id="email"
          label="E-mail do usuário"
          variant="outlined"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={handleCheckEmail}
        />
      </div>

      <div className="flex-row-w">
        <div className="input-separator">
          <NumberFormat
            required
            id="phone1"
            value={phone1}
            onChange={(event) => setPhone1(event.target.value)}
            format="(##) # ####-####"
            placeholder="Telefone 1 do usuário"
            mask="_"
          />
        </div>

        <div className="input-separator">
          <NumberFormat
            id="phone2"
            value={phone2}
            onChange={(event) => setPhone2(event.target.value)}
            format="(##) # ####-####"
            placeholder="Telefone 2 do usuário"
            mask="_"
          />
        </div>
      </div>

      <div className="input-separator">
        <TextField
          fullWidth
          required
          id="user"
          label="Usuário"
          variant="outlined"
          value={user}
          onChange={(event) => setUser(event.target.value)}
          onBlur={handleCheckUser}
        />
      </div>

      <div className="flex-row-w">
        <div className="input-separator">
          <TextField
            autoComplete="on"
            fullWidth
            required
            type="password"
            id="password"
            label="Senha"
            variant="outlined"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div className="input-separator">
          <TextField
            autoComplete="on"
            fullWidth
            required
            type="password"
            id="passwordConfirm"
            label="Confirmar senha"
            variant="outlined"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            onBlur={handleCheckConfirmPassword}
          />
        </div>
      </div>

      <div className="input-separator">
        <NumberFormat
          required
          id="cep"
          value={cep}
          onChange={(event) => setCep(event.target.value)}
          format="########"
          placeholder="Cep"
          mask="_"
          onBlur={handleCep}
        />
      </div>

      <div className="input-separator">
        <TextField
          fullWidth
          required
          id="street"
          label="Rua"
          variant="outlined"
          value={street}
          onChange={(event) => setStreet(event.target.value)}
        />
      </div>

      <div className="input-separator">
        <TextField
          type="number"
          fullWidth
          required
          id="number"
          label="Número"
          variant="outlined"
          value={number}
          onChange={(event) => setNumber(event.target.value)}
        />
      </div>

      <div className="input-separator">
        <TextField
          fullWidth
          id="complement"
          label="Complemento"
          variant="outlined"
          value={complement}
          onChange={(event) => setComplement(event.target.value)}
        />
      </div>

      <div className="input-separator">
        <TextField
          fullWidth
          required
          id="district"
          label="Bairro"
          variant="outlined"
          value={district}
          onChange={(event) => setDistrict(event.target.value)}
        />
      </div>

      <div className="input-separator">
        <Autocomplete
          id="combo-box-demo"
          options={stateList}
          getOptionLabel={(option) => option.description}
          onChange={(event, opt) => {
            if (opt) setState(opt)
          }}
          value={state}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              required
              id="state"
              label="Estado"
              variant="outlined"
            />
          )}
        />
      </div>

      <div className="input-separator">
        <TextField
          fullWidth
          required
          id="city"
          label="Cidade"
          variant="outlined"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
      </div>

      <Button type="submit" variant="contained" color="primary">
        Salvar
      </Button>
    </form>
  )
}
