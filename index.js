import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoutes from './routes/users.js'
import commentsRoutes from './routes/comments.js'
import videosRoutes from './routes/videos.js'
import authRoutes from './routes/auth.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));
app.use(cookieParser())
dotenv.config()

const connect = () => {
  mongoose.connect(process.env.DB)
  .then(() => {
    console.log("Connected to DB")
  })
  .catch((err) => {
    throw err
  })
}

app.use(express.json())

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/videos', videosRoutes)
app.use('/api/comments', commentsRoutes)

app.listen(5000, () => {
  connect()
  console.log('Server running at http://localhost:5000')
})