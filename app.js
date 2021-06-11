const express = require('express');
const morgan = require('morgan');
const https = require('https');
//const createError = require('http-errors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const AuthRoute = require('./Routes/Auth.route');
const app = express();


app.use(morgan('dev'));

// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json())
app.use(express.json());


//Auth Route
app.use('/auth', AuthRoute);


//Check Authorization
app.use('/api/', (req, res, next) => {
    if (req.headers.authorization) {
        next();
    } else {
        //next(createError.Unauthorized());
        res.sendStatus(403);
    }
});

// DO NOT DO THIS IN PRODUCTION
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

function onProxyReq(proxyReq, req, res) {
    proxyReq.setHeader('sap-client', 500);
}

//function onProxyRes(proxyRes, req, res) {
    //proxyRes.headers['x-added'] = 'foobar'; // add new header to response
    //delete proxyRes.headers['x-removed']; // remove header from response
//}

const options = {
    target: process.env.ODATA_HOST,
    changeOrigin: true,
    pathRewrite: {'^/api' : ''},
    // router:
    agent: httpsAgent,
    // logLevel: 'debug',
    onProxyReq: onProxyReq
    // onProxyRes: onProxyRes
};

 //API Proxy
app.use('/api', createProxyMiddleware(options));


//Default 404
app.use(async (req, res, next)=>{
    res.sendStatus(404);
    //res.status(404).send("Not Found");
    //next(createError.NotFound());
})

app.listen(3000, (req, res) => {
    console.log("Listening on http://localhost:3000");
});