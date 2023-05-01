const express = require('express');
const { connection } = require('./db');
const { userRouter } = require('./routes/User.route');
const { auth } = require('./middleware/auth');
const { postRouter } = require('./routes/Post.route');
const {PORT} = process.env;

const app = express()
app.use(express.json());

app.use('/users', userRouter)

app.use(auth);
app.use('/posts', postRouter)


app.listen(PORT, async()=>{
  try {
    await connection;
    console.log("Connected");
  } catch (error) {
    console.log("Unable to Connect");
  }
  console.log(`Server is at port ${PORT}`);
})