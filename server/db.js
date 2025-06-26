const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  user: "leoyang",
  password: "",
  host: "localhost",
  port: 5432,
  database: "javis",
});

module.exports = pool;
