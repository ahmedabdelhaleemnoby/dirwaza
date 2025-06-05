import mongoose from 'mongoose';

let isConnected = false;

export async function connectMongo() {
  if (isConnected) return;
  if (mongoose.connections[0].readyState) {
    isConnected = true;
    return;
  }
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
  console.log('MongoDB connected');
}
