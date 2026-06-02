const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize_orm = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,

    logging: false,

    pool: {
      max: 10,
      min: 2,
      acquire: 60000,
      idle: 10000,
      evict: 1000,
    },

    dialectOptions: {
      connectTimeout: 60000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    },

    retry: {
      max: 5,
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /TimeoutError/,
        /Connection lost/,
        /ECONNRESET/,
        /PROTOCOL_CONNECTION_LOST/,
      ],
    },
  }
);

// Test DB connection
const connectDB = async () => {
  try {
    await sequelize_orm.authenticate();
    console.log("Database connected successfully");

    // Automatically update the Orders table status enum in database if it exists
    try {
      await sequelize_orm.query(`
        ALTER TABLE Orders 
        MODIFY COLUMN status ENUM('pending', 'packing', 'shipping', 'delivered', 'completed', 'cancelled') 
        DEFAULT 'pending'
      `);
      console.log("Orders status ENUM updated successfully in database");
    } catch (enumErr) {
      console.log("Note: Could not alter Orders status ENUM (it might not exist yet):", enumErr.message);
    }
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

// Keep connection alive by querying every 4 minutes (240000 ms)
setInterval(async () => {
  try {
    await sequelize_orm.query("SELECT 1");
    console.log("Database keep-alive ping");
  } catch (error) {
    console.error("Keep-alive failed:", error.message);
  }
}, 240000);

module.exports = { connectDB, sequelize_orm };
