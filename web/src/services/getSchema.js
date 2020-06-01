var fetch = require('node-fetch');
var fs = require('fs');

const {
  buildClientSchema,
  introspectionQuery,
  printSchema,
} = require('graphql/utilities');

fetch('http://localhost:3001', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ 'query': introspectionQuery }),
})
  .then(res => res.json())
  .then(res => {
    const schemaString = printSchema(buildClientSchema(res.data));
    fs.writeFileSync('src/data/schema.graphql', schemaString);
  });