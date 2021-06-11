const express = require('express');
const https = require('https');
const axios = require('axios');
const qs = require('qs'); 

const router = express.Router();

// DO NOT DO THIS IN PRODUCTION
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// http://localhost:3000/auth/register
// http://localhost:3000/auth/login
// http://localhost:3000/auth/logout
// http://localhost:3000/auth/refresh-token


// router.post('/register', async(req, res, next)=>{
//
// });

router.post('/login', async(req, res, next)=>{
    const { code } = req.body;

    //Request token from code
    axios.post(process.env.TOKEN_REQUEST_URL, 
        qs.stringify({
            grant_type: "authorization_code",
            response_type: "token",
            client_id: process.env.TOKEN_CLIENT_ID,
            redirect_uri: process.env.TOKEN_REDIRECT_URI,
            code: code
        }), {
            auth:{
                username: process.env.TOKEN_USER,
                password: process.env.TOKEN_PASS
            },
            httpsAgent: httpsAgent,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        },

    ).then((response)=>{
        //console.log(response);
        res.json(response.data);
    }).catch((err)=>{
        //console.log(err);
        res.status(400).json(err.response.data);
    });

});
// router.post('/logout', async(req, res, next)={
//
// });
// router.post('/refresh-token', async(req, res, next)={
//
// });

module.exports = router;