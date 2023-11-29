import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import DbConnect from './dbConnection/DbConnect.js';
import router from './Routes/AuthRoute.js'
import multer from 'multer';
dotenv.config();

const app = express();




app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(express.static('dist'));



app.use('/api', router)

app.get('/', (req, res) => {
  const { token } = req.cookies
  res.status(201).send(token)
})

DbConnect()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(` app is running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log('Error Message: ', error);
  });
