const config = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "password",
      database: process.env.DB_NAME || "youtube_game",
      ssl: false
    },
    migrations: {
      directory: "./migrations"
    }
  },
  production: {
    client: "pg",
    connection: {
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      ssl: { rejectUnauthorized: false } // Railway requires SSL
    },
    migrations: {
      directory: "./migrations"
    }
  }
};

export default config;
