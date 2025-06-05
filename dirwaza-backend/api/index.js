import serverless from 'serverless-http';
import app from '../src/app.js';
import { connectMongo } from '../src/mongo.js'; // You might need to export this from a separate file

let serverlessHandler = null;

export default async function handler(req, res) {
  await connectMongo(); // Make sure MongoDB is connected
  if (!serverlessHandler) {
    serverlessHandler = serverless(app);
  }
  return serverlessHandler(req, res);
}
