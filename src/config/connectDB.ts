import mongoose from 'mongoose';

import { type Config } from './index';

async function connectDB(config: Config) {
  const { MONGO_URI } = config;
  try {
    await mongoose.connect(MONGO_URI, {
      retryWrites: true,
      w: 'majority',
    });
  } catch (error) {
    console.error(error);
  }
}

export { connectDB };
