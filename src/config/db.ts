import sequelize from "sequelize";

export const db = new sequelize.Sequelize(
  process.env.DB_NAME || "postgres",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "postgres",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  }
);

db.authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

db.sync({ alter: true });
