// knexfile.js as ESM
const config = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "youtube_game",
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      directory: "./migrations"
    }
  }
};

export default config;
