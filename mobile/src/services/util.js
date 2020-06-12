import axios from 'axios';

export default {
  async getCep(cep) {
    if (cep && cep !== '') {
      cep = (cep.replace(/\D/g, ''));

      if (cep.length === 8) {
        try {
          const query = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

          const { erro } = query.data;
          if (erro) return null;
          else return query.data;

        } catch (error) {
          console.warn(error);
        }
      }
    }

    return null;
  },
  getStates() {
    return states;
  },
  maskValue(value) {
    return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  },
  maskDate(date) {
    return Intl.DateTimeFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(date);
  },
  stringToDate(date, ctrl = 1) {
    let tmp = date.split('/'), resp = null;

    switch (ctrl) {
      case 1:
        resp = new Date(`${tmp[2]}-${tmp[1]}-${tmp[0]}`);
        break;
      case 2:
        resp = `${tmp[2]}-${tmp[1]}-${tmp[0]} 12:00:00`;
        break;
      case 3:
        resp = `${tmp[2]}-${tmp[1]}-${tmp[0]}`;
        break;
      default:
        resp = resp = new Date(`${tmp[2]}-${tmp[1]}-${tmp[0]}`);
        break;
    }
    return resp;
  },
  dateToString(date) {
    date = date ? new Date(date) : new Date();
    return format(date, 'dd/MM/yyyy');
  },
  dateTimeToString(date) {
    date = date ? new Date(date) : new Date();
    return format(date, 'dd/MM/yyyy HH:mm');
  },
}