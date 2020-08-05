const express = require('express');
const server = express();

const postsRouter = require('./posts/posts-router')

server.use(express.json());

// posts routes
server.use('/api/posts', postsRouter)

server.listen(8000, ()=>{
  console.log('server listening on port 8000');
})