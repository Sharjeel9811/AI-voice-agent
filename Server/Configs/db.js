import mongoose from 'mongoose';

let connectionPromise = null;

export const ConnectDB = async () => {
  if (connectionPromise) return connectionPromise;
  connectionPromise = mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('DB connected successfully');
  }).catch((err) => {
    console.log('DB connection failed:', err.message);
    connectionPromise = null;
    throw err;
  });
  return connectionPromise;
};