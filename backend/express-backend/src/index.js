import dotenv from "dotenv";
dotenv.config({
  path: "./env",
});

import { app } from "./app.js";
import connectDB from "./db/index.js";
import redis from './db/redisClient.js'
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB Connection Failed: ${err}`);
    process.exit(1);
  });
redis.on('connect', () => {
  console.log(`Redis Connection Succesful! `);

}).on('error', (err) => {
  console.log(`Redis Connection Failed: ${err}`);
})
redis.ping().then((result) => console.log(`Redis Ping Result: ${result}`)).catch((err) => console.log(`Redis Connection Failed: ${err}`))

