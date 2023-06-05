import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 1337;
const config = {
  PORT,
};

export { config };
