const fs = require('fs');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const util = require('./Util');

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
});

module.exports = {
    async uploadImage (file, fileName, token) {  
        const { originalname, path } = file;
        let folder = 'default';

        if(token){
            folder = util.decodeToken(token).UsuarioId;
        }
        
        //altera tamanho da imagem
        const fileResized = await sharp(fs.readFileSync(path)).resize(768, 1024, {fit: "contain"});
        await unlinkAsync(path);
    
        const params = {
            Bucket: `${BUCKET_NAME}/images/${folder}/${fileName}`,
            Key: originalname,
            Body: fileResized,
            ACL: "public-read",
        };
    
        return s3.upload(params).promise()
        .then(data => {
            return data;
        })
        .catch(err =>{
            console.log('ERRO NO UPLOAD DE IMAGEM', err);
            throw err;
        });
    },
    async uploadFile (file, fileName, token) {  
        const { originalname, path } = file;
        let folder = 'default';

        if(token){
            folder = util.decodeToken(token).UsuarioId;
        }
        const fileResized = fs.readFileSync(path)
    
        const params = {
            Bucket: `${BUCKET_NAME}/files/${folder}/${fileName}`,
            Key: originalname,
            Body: fileResized,
            ACL: "public-read",
        };
    
        return s3.upload(params).promise()
        .then(data => {
            return data;
        })
        .catch(err =>{
            console.log('ERRO NO UPLOAD DE ARQUIVO', err);
            throw err;
        });
    },
}