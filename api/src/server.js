const { GraphQLServer } = require('graphql-yoga');
const path = require('path');
const resolvers = require('./resolvers/resolver');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const port = 3001;

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

server.start({ port: port }, () => {
    console.log(`Server running in ${port}\n`)
});
