import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 1337;
const {
  NODE_ENV = 'development',
  PROTOCOL_PREFIX = 'mongodb+srv://',
  MONGO_SERVER_HOSTNAME = 'cluster0.un3txoo.mongodb.net',
  MONGO_USERNAME = 'username123',
  MONGO_PASSWORD = 'password123',

  ACCESS_TOKEN_SECRET = '6772f10131911ab9119bcfb178e19ada16a3f2f230101bc8dce3747f36e45339aa744b3c0c8d006b83c8ee873bb7f98250676485c9e07fb1e4f2bed497acb375',
  REFRESH_TOKEN_SECRET = '580f57887d32d8ebb6b3b273044328f1ff3294ec6b153ff630bad50b4b1e88d45f81073770516781ccb7f4cf7221af8e1a800c5190f349de54e7302b31889162',
} = process.env;

const MONGO_URI = `${PROTOCOL_PREFIX}${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_SERVER_HOSTNAME}`;

type Config = {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
};

const config: Config = {
  NODE_ENV,
  PORT,
  MONGO_URI,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
};

export { config };
export type { Config };
