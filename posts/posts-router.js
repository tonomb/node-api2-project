const express = require('express');


//require db model
const db = require('../data/db');

const router  = express()

// ======== /api/posts====== 

router.post('/', (req, res)=>{
  if(!req.body.title || !req.body.contents){
    res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  } else{
    db.insert(req.body)
    .then(ids =>{
      db.findById(ids.id)
      .then( post =>{
        res.status(201).json(post)
      })
    })
    .catch(err =>{
      res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
  }
})

router.post('/:id/comments', (req, res) =>{
  //search the posts for existing post id
  db.findById(req.params.id)
    .then(post=>{
      //if no post with that id is found it will return an empty array
      if(post.length < 1){
        res.status(404).json({ message: "The post with the specified ID does not exist." })
        //checks to see if the body has a text field
      } else if(!req.body.text){
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
      } else {
        //inserts comment into db
        db.insertComment(req.body)
        .then(newComment=>{
          //returns the new comment id
          db.findCommentById(newComment.id)
            .then(comment=>{
              //returns the comment 
              res.status(201).json(comment)
            })
        })
        .catch(err=>{
          res.status(500).json({ error: "There was an error while saving the comment to the database" })
        })
      }
    })
})

router.get('/', (req, res) =>{
  try{
    db.find()
  .then(db =>{
    res.status(200).json(db)
  })
  .catch(err=>{

  })
  } catch{
    res.status(500).json({ error: "The posts information could not be retrieved." })
  }
})


router.get('/:id', (req, res) =>{
  try{
    db.findById(req.params.id)
      .then(post =>{
        if(post.length < 1 ){
          res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else{
          res.status(200).json(post)
        }
      })
    } catch{
      res.status(500).json({ error: "The post information could not be retrieved." })
    }
})


router.get('/:id/comments', (req, res) =>{
  try{
    db.findById(req.params.id)
      .then( post =>{
        if(post.length < 1){
          res.status(404),json({ message: "The post with the specified ID does not exist." })
        } else {
          db.findPostComments(req.params.id)
          .then( comments =>{
            res.status(200).json(comments)
          })
        }
      })
  } catch {
    res.status(500).json({ error: "The comments information could not be retrieved." })
  }
})

router.delete('/:id', (req, res) =>{
  try{
    db.findById(req.params.id)
      .then( post =>{
        if(post.length < 1){
          res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
          db.remove(req.params.id)
          .then( recordsDeleted =>{
            //returns post id
            res.status(200).json({Records_Deleted: recordsDeleted})
          })
        }
      })
  } catch {
    res.status(500).json({ error: "The post could not be removed" })
  }
})


router.put('/:id', (req, res)=>{
  try{
    db.findById(req.params.id)
      .then( post =>{
        if(post.length < 1){
          res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else if(!req.body.title || !req.body.contents){
          res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        } else {
          db.update(req.params.id, req.body)
            .then( count =>{
              if(count === 1 ){
                db.findById(req.params.id)
                  .then( post =>{
                    res.status(200).json(post)
                  })
              }
            })
            .catch(err =>{
              res.status(500).json({ error: "The post information could not be modified."})
            } )
        }
      })
  } catch {
    res.status(500).json({ error: "The post information could not be modified. 2"})
  }
})


module.exports = router;