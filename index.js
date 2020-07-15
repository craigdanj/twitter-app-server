const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const sequelize = require('./database');
const twitterRoutes = require('./routes/twitter');

const app = express();

//Body parser middleware.
app.use(bodyParser.json());

//Static folder for public assest.
app.use(express.static(path.join(__dirname, 'public')));

//CORS Headers
app.use((req, res ,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//Routes
app.use('/', twitterRoutes);

//Sync db and start server.
sequelize
    .sync()
    .then(result => {
        app.listen(8000, ()=> {
            console.log("Server up and running at http://localhost:8000");
        });
    })
    .catch(err => {
        console.log(err);
    });
