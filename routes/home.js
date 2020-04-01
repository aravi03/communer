const express = require('express');
const router = express.Router();
const app=express();
const { ensureAuthenticated } = require('../config/auth');

// Dashboard
router.get('/', ensureAuthenticated, (req, res) =>
  res.render('home', {
    user: req.user
  })
);
router.get('/abc/upload',  (req, res) =>
  res.render('upload', {
    // user: req.user
  })
);
router.post('/abc/upload',function(req,res){
  
  console.log("The contents are "+req.body.name);
  
  if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    var uploadpath =  './uploads/' + name;
    file.mv(uploadpath,function(err){
      if(err){
        console.log("File Upload Failed",name,err);
        res.send("Error Occured!")
      }
      else {
        console.log("File Uploaded",name);
        res.send('Done! Uploading files')
      }
    });
  }
  else {
    res.send("No File selected !");
    res.end();
  };
});
router.get('/mycommunities', ensureAuthenticated, (req, res) =>
  res.render('mycommunities', {
    user: req.user
  })
);

router.get('/searchcommunities',function(req,res){
  if(req.isAuthenticated()){
    console.log("This is the user "+req.user);
  res.render('search_communities',{
      user:req.user,
      results:null
    });}
    else{
      res.render('search_communities_guest',{
        
        results:null
      });
    }
    
});
router.post('/searchcommunities',function(req,res){
    const search=req.body.search_communities;
    console.log(search);
  var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017').then(function(client)
    {
        var db=client.db('communer');
        var collection=db.collection('communities');
        return collection.find({"name" : {$regex : ".*"+search+".*"}}).toArray();
    }).then(function(items){
           console.log("Here's the search results",items);
           if(req.isAuthenticated())
           {
          res.render('search_communities',{
            user:req.user,
            results:items
          });}
          else{
            res.render('search_communities_guest',{
              results:items
            });

          }
        }).catch(function(err){
          throw err;
        });     
    });


module.exports = router;