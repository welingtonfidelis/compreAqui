require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const express = require('express');
const cors = require('cors');
const path = require('path');
const resolvers = require('./resolvers/resolver');
const jwt = require('jsonwebtoken');
const routes = require('./routes');
const app = express();

const port1 = 3001; //rotas em graphql
const port2 = 3002; //rotas em API REST (upload de arquivos)

app.use(cors());
app.use(express.json());
app.use(routes);

const autheticate = async (resolve, root, args, context, info) => {
    const token = context.request.get("token");

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) { }
        else {
            args.UserId = decoded.id,
            args.typeUser = decoded.typeUser
        }
    });

    const result = await resolve(root, args, context, info);
    return result;
};

const server = new GraphQLServer({
    typeDefs: path.resolve(__dirname, './schema/schema.graphql'),
    resolvers: [resolvers],
    context: req => ({ ...req }),
    middlewares: [autheticate]
});

server.start({ port: port1 }, () => {
    console.warn(`Server GRAPHQL running in ${port1}`)
});

app.listen(port2, () => {
    console.warn(`Server API running in ${port2}\n`);
})