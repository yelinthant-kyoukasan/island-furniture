var mysql = require('mysql');
var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "root1234",
            database: "islandfurniture-it07",
            multipleStatements: true
        });
        return conn;
    }
};

const setting = {
    connectionLimit : 10, //set limit to 10 connection
    host     : 'localhost', 
    user     : 'root', 
    password : 'root1234', 
    database : 'islandfurniture-it07',
    multipleStatements: true, //allow multiple sql statements
    dateStrings: true, //return date as string instead of Date object
}

const callback = (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
    process.exit();
  } else {
    console.log("Tables created successfully");
  }
}

    const SQL_STATEMENT = `
                        DROP TABLE IF EXISTS Favourites;
                        DROP TABLE IF EXISTS Reviews;
                        CREATE TABLE Favourites (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                username TEXT NOT NULL,
                                product_id INT NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        );
                        CREATE TABLE Reviews (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                username TEXT NOT NULL,
                                product_sku TEXT NOT NULL,
                                rating INT NOT NULL,
                                review_text TEXT NOT NULL,
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        );
    `;

const conn = dbconnect.getConnection();
conn.connect(err => {
    if (err) {
        console.log(err);
        conn.end();
    }
    conn.query(SQL_STATEMENT, callback)
})


module.exports = dbconnect