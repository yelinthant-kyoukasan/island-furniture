var db = require('./databaseConfig.js');

var reviewDB = {
    addReview: function (username, product_sku, rating, review_text) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect(err => {
                if (err) {
                    conn.end();
                    return reject(err);
                }
                var sql = 'INSERT INTO Reviews(username, product_sku, rating, review_text) VALUES (?, ?, ?, ?)';
                conn.query(sql, [username, product_sku, rating, review_text], (err, result) => {
                    conn.end();
                    if (err) return reject(err);
                    return resolve(result);
                });
            });
        });
    },

    deleteReview: function (username, reviewId) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect(err => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                // Ensure review is not older than 24 hours
                var sql = `
                    DELETE FROM Reviews 
                    WHERE username = ? AND id = ? 
                    AND created_at >= NOW() - INTERVAL 1 DAY
                `;

                conn.query(sql, [username, reviewId], (err, result) => {
                    conn.end();
                    if (err) return reject(err);
                    return resolve(result);
                });
            });
        });
    },

    getReviewsByProductSku: function (product_sku) {
        return new Promise((resolve, reject) => {
            var conn = db.getConnection();
            conn.connect(err => {
                if (err) {
                    conn.end();
                    return reject(err);
                }

                var sql = 'SELECT * FROM Reviews WHERE product_sku = ? ORDER BY created_at DESC';
                conn.query(sql, [product_sku], (err, result) => {
                    conn.end();
                    if (err) return reject(err);
                    return resolve(result);
                });
            });
        });
    }
};

module.exports = reviewDB;
