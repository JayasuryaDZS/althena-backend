import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const db = process.env.DB_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

mongoose.connect(db).then(() => console.log("Mongodb connected"))
  .catch((err) => console.error("Error connecting to Mongodb:", err));

  app.use('/api', userRoutes);

  app.get('/', (req, res) => {
    res.json({ msg: "Testing" })
  })
  
app.listen(PORT, () => {
    console.log("Port listening on PORT"+ PORT)
})