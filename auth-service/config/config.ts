export interface AppConfig {
  port: number;
  url: string
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

export default () => ({
  app: {
    url: `0.0.0.0:${process.env.APP_PORT || 5000}`
  } as AppConfig,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME || 'not_defined'
  } as DatabaseConfig
})