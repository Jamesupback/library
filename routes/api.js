/*
*
*
*       Complete the API routing below
*       
*       
*/
require("dotenv").config();
'use strict';
const mongoose=require("mongoose");
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("database connected"))

const bookschema=new mongoose.Schema({
  comments:[String],
  title:String,
  commentcount:Number
})
const book=mongoose.model('book',bookschema)

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      book.find().then((data)=>res.json(data))
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title)
      return res.send("missing required field title")
      
      const newbook=new book({
        title:title,
        commentcount:0
      })
      newbook.save().then((data)=>{
        return res.json({_id:data._id,title:data.title})
      })
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      book.deleteMany({}).then(()=>{
        return(res.send("complete delete successful"))
      })
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      book.findById(bookid).then((data)=>{
        res.json({comments:data.comments,_id:data._id,title:data.title,commentcount:data.commentcount,__v:data.__v})
      }).catch((err)=>res.send("no book exists"))
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(!comment)
      return res.send("missing required field comment");
      book.findById(bookid).then((data)=>{
        data.comments.push(comment);
        data.save().then(()=>console.log(data))
        return res.json({comments:data.comments,_id:data._id,title:data.title,commentcount:data.commentcount,__v:data.__v})
      }).catch((err)=>{
        return(res.send("no book exists"))
      })
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;      
      book.findById(bookid).then((data)=>{
        if(!data)
        return(res.send("no book exists"))
      book.findOneAndDelete({_id:data._id}).then(()=>{
        return(res.send("delete successful"))
      })
      })
      //if successful response will be 'delete successful'
    });
  
};
