const mysql = require("mysql");
const util = require("util");

const pool = mysql.createPool({
  connectionLimit: 25,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  charset: "utf8mb4"
});

pool.query = util.promisify(pool.query);

module.exports = pool;
