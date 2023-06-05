import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 1337;
const {
  NODE_ENV = 'development',
  PROTOCOL_PREFIX = 'mongodb+srv://',
  MONGO_SERVER_HOSTNAME = 'cluster0.un3txoo.mongodb.net',
  MONGO_USERNAME = 'username123',
  MONGO_PASSWORD = 'password123',
} = process.env;

const MONGO_URI = `${PROTOCOL_PREFIX}${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_SERVER_HOSTNAME}`;

type Config = {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
};

const config: Config = {
  NODE_ENV,
  PORT,
  MONGO_URI,
};

export { config, type Config };
