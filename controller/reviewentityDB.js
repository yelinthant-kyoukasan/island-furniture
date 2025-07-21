var express = require('express');
var app = express();
let middleware = require('./middleware.js');
var reviewDB = require('../model/reviewModel.js');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
var memberDB = require('../model/memberModel'); // import memberModel if not already

// Add Review
app.post('/api/addReview', [middleware.checkToken, jsonParser], function (req, res) {
    const username = req.decoded.username;
    const { sku, rating, review_text, member_id } = req.body;
    // console.log(sku, rating, review_text, member_id, username)
    // Step 1: Verify user has purchased this item
    memberDB.getBoughtItem(member_id)
        .then(boughtItems => {
            // console.log(boughtItems)
            const hasBought = boughtItems.some(item => item.sku == sku); // match by SKU/product_id
            console.log(hasBought)
            if (!hasBought) {
                return res.status(403).send("You can only review items you have purchased.");
            }

            // Step 2: Proceed to add review
            return reviewDB.addReview(username, sku, rating, review_text)
                .then(result => {
                    if (result.affectedRows > 0) {
                        res.status(200).send("Review Created!")
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send("Failed to add review");
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Error verifying purchase history");
        });
});

// Delete review (within 24 hours)
app.post('/api/deleteReview/:reviewId', [middleware.checkToken, jsonParser], function (req, res) {
    const username = req.decoded.username;
    const { reviewId } = req.params;

    reviewDB.deleteReview(username, reviewId)
        .then(result => { 
            if (result.affectedRows > 0) {
                res.status(200).send("Review Deleted!")
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send("Failed to delete review");
        });
});

// Get reviews by product sku
app.get('/api/getReviewsBySku/:sku', middleware.checkToken, function (req, res) {
    const product_sku = req.params.sku;

    reviewDB.getReviewsByProductSku(product_sku)
        .then(result => res.send(result))
        .catch(err => {
            console.log(err);
            res.status(500).send("Failed to get reviews");
        });
});

module.exports = app;
