import axios from 'axios';

const states = [
  { Name: 'Acre', Value: 'AC' },
  { Name: 'Alagoas', Value: 'AL' },
  { Name: 'Amapá', Value: 'AP' },
  { Name: 'Amazonas', Value: 'AM' },
  { Name: 'Bahia', Value: 'BA' },
  { Name: 'Ceará', Value: 'CE' },
  { Name: 'Distrito Federal', Value: 'DF' },
  { Name: 'Espírito Santo', Value: 'ES' },
  { Name: 'Goiás', Value: 'GO' },
  { Name: 'Maranhão', Value: 'MA' },
  { Name: 'Mato Grosso', Value: 'MT' },
  { Name: 'Mato Grosso do Sul', Value: 'MS' },
  { Name: 'Minas Gerais', Value: 'MG' },
  { Name: 'Pará', Value: 'PA' },
  { Name: 'Paraíba', Value: 'PB' },
  { Name: 'Paraná', Value: 'PR' },
  { Name: 'Pernambuco', Value: 'PE' },
  { Name: 'Piauí', Value: 'PI' },
  { Name: 'Rio de Janeiro', Value: 'RJ' },
  { Name: 'Rio Grande do Norte', Value: 'RN' },
  { Name: 'Rio Grande do Sul', Value: 'RS' },
  { Name: 'Rondônia', Value: 'RO' },
  { Name: 'Roraima', Value: 'RR' },
  { Name: 'Santa Catarina', Value: 'SC' },
  { Name: 'São Paulo', Value: 'SP' },
  { Name: 'Sergipe', Value: 'SE' },
  { Name: 'Tocantins', Value: 'TO' }
];

export default {
  async getCep(cep) {
    if(cep && cep !== ''){
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
}