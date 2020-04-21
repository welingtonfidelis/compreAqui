import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';
import { isEmpty } from 'lodash';

const token = 'teste de token';

function fetchQuery(operation, variables, cacheConfig, uploadables) {
  const request = {
      method: 'POST',
      headers: {
          token,
      },
  };

  if (uploadables) {
      if (!window.FormData) {
          throw new Error('Uploading files without `FormData` not supported.');
      }

      const formData = new FormData();
      formData.append('query', operation.text);
      formData.append('variables', JSON.stringify(variables));

      Object.keys(uploadables).forEach(key => {
          if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
              formData.append(key, uploadables[key]);
          }
      });

      request.body = formData;
  } else {
      request.headers['Content-Type'] = 'application/json';
      request.body = JSON.stringify({
          query: operation.text,
          variables,
      });
  }

  return fetch('http://localhost:3001/', request)
      .then(response => {
          if (response.status === 200) {
              return response.json();
          }

          // HTTP errors
          // TODO: NOT sure what to do here yet
          return response.json();
      })
      .catch(error => {
          console.log(error);
      });
}

const source = new RecordSource();
const store = new Store(source);

// singleton Environment
export default new Environment({
  // network: networkLayer,
  // handlerProvider,
  network: Network.create(fetchQuery),
  store,
});

  // function fetchQuery(
  //   operation,
  //   variables,
  // ) {
  //   return fetch('http://localhost:3001/', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       token
  //     },
  //     body: JSON.stringify({
  //       query: operation.text,
  //       variables,
  //     }),
  //   }).then(response => {
  //     return response.json();
  //   });
  // }

  // const environment = new Environment({
  //   network: Network.create(fetchQuery),
  //   store: new Store(new RecordSource()),  
  // });

  // export default environment;