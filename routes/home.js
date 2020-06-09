const express = require('express');
const router = express.Router();
const app=express();
const { ensureAuthenticated } = require('../config/auth');

// Dashboard
router.get('/', ensureAuthenticated, (req, res) =>
{
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017').then(function(client)
{
    
    var db=client.db('communer_home');
    var collection=db.collection(req.user.userid);
    
    return collection.find().sort({"date": -1}).toArray();
}).then(function(items){
  res.render('home', {user: req.user,posts:items});
});
 
});

router.get('/help',function(req,res){
  res.render('help',{user: req.user})
})

// router.get('/abc/upload',  (req, res) =>
//   res.render('upload', {
//     // user: req.user
//   })
// );
// router.post('/abc/upload',function(req,res){
  
//   console.log("The contents are "+req.body.name);
  
//   if(req.files.upfile){
//     var file = req.files.upfile,
//       name = file.name,
//       type = file.mimetype;
//     var uploadpath =  './uploads/' + name;
//     file.mv(uploadpath,function(err){
//       if(err){
//         console.log("File Upload Failed",name,err);
//         res.send("Error Occured!")
//       }
//       else {
//         console.log("File Uploaded",name);
//         res.send('Done! Uploading files')
//       }
//     });
//   }
//   else {
//     res.send("No File selected !");
//     res.end();
//   };
// });


router.get('/mycommunities', ensureAuthenticated, (req, res) =>
  res.render('mycommunities', {
    user: req.user
  })
);



router.get('/notifs',ensureAuthenticated, (req, res) =>
res.render('notifs', {
  user: req.user,
  notifs_list:req.user.notifs
})
);

router.get('/notif/clear/:desc',ensureAuthenticated, (req, res) =>{
  var desc=req.params.desc.replace(/\+/g,' ');
  console.log("This is the desc "+desc);
  
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect('mongodb://localhost:27017').then(function(client)
{   var db=client.db('communer');
    var collection=db.collection('users');
    collection.update(
      {'userid': req.user.userid}, 
      { $pull: { "notifs" : { description: desc } } }
   
    ).then(function(){
      res.redirect('/notifs');
    })
  //   res.render('notifs', {
  //   user: req.user
  // })
});
});

router.get('/notif/accept/:userid/:comm_id',ensureAuthenticated, (req, res) =>{
var userid=req.params.userid;
var comm_id=req.params.comm_id;
var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect('mongodb://localhost:27017').then(function(client)
{   var db=client.db('communer');
    var collection=db.collection('users');
    collection.update(
      {'userid': req.user.userid}, 
      { $pull: { "notifs" : { userid: userid,community_id:comm_id } } }
   
    ).then(function(){
      return collection.update(
        {'userid': userid}, 
        { $pull: { "pending_req" : comm_id  } }
     
      )
     
    }).then(function(){
      return collection.update(
        {'userid': userid}, 
        { $push: { "communities" : comm_id  } }
     
      )
    }).then(function(){
      var newstr="Your request to join "+comm_id+" was accepted"
      return collection.update(
        {'userid': userid}, 
        { $push: {notifs: {
                               
          description:newstr,
          date: Date.now()
         
         
      } }}
     
      )
    }).then(function(){
      var collection=db.collection('communities');
      return collection.update(
        {'community_id': comm_id}, 
        { $push: { "members" : userid  } }
     
      )
    }).then(function(){
       res.redirect('/notifs');
    });
  //   res.render('notifs', {
  //   user: req.user
  // })
});
});



router.get('/notif/reject/:userid/:comm_id',ensureAuthenticated, (req, res) =>{
  var userid=req.params.userid;
  var comm_id=req.params.comm_id;
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect('mongodb://localhost:27017').then(function(client)
{   var db=client.db('communer');
    var collection=db.collection('users');
    collection.update(
      {'userid': req.user.userid}, 
      { $pull: { "notifs" : { userid: userid,community_id:comm_id } } }
   
    ).then(function(){
      return collection.update(
        {'userid': userid}, 
        { $pull: { "pending_req" : comm_id  } }
     
      )
     
    }).then(function(){
      res.redirect('/notifs');
    })
  });
});
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