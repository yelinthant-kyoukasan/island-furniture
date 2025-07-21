var express = require('express');
var app = express();
let middleware = require('./middleware');
var favourites = require('../model/favouriteModel.js');

app.get('/api/getFavouriteItems', middleware.checkToken, function (req, res) {
    // console.log(req.decoded)
    favourites.getFavouriteItems(req.decoded.username)
        .then((result) => {
            console.log(result)
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get all favourite items");
        });
});

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
app.post('/api/addFavouriteItem', [middleware.checkToken,jsonParser] , function (req, res) {
    var username = req.decoded.username;
    var product_id = req.body.product_id;
    favourites.addItemFavourite(username, product_id)
    .then((result) => {
            console.log(result)
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to add a new favourite item");
        });
    
});

app.post('/api/removeFavouriteItem', [middleware.checkToken, jsonParser], function (req, res) {
    // console.log(req.body.id)
    favourites.removeItemFavourite(req.decoded.username, req.body.product_id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to remove from Favourites");
        });
});

app.post('/api/checkItemExist', [middleware.checkToken, jsonParser], function (req, res) {
    favourites.checkItemExistInFavourite(req.decoded.username, req.body.product_id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to remove from Favourites");
        });
});

module.exports = app;