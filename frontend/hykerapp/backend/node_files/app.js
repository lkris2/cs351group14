import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './router.js';

dotenv.config();

const app = express();
const port = 3000;

console.log(process.env.MONGO_DB);
const mongoUri = process.env.MONGO_DB;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    return res.sendStatus(200);
  }
  next();
});
app.use('/api/users', userRoutes);

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('haiii Hello, MongoDB!')
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});


