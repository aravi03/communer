const express=require('express');
const router=express.Router();
const { ensureAuthenticated } = require('../config/auth');

const Community = require('../models/Community');


    //Get for Creating Community
router.get('/create',ensureAuthenticated,function(req,res){
    res.render('create_community',{
        user: req.user
      });
  });
  

  router.get('/join/*',ensureAuthenticated,function(req,res){
    var str='';  
    url=req.url;
    for(var i=6;i<url.length;i++)
    {
        str+=url[i];
    }
       
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017').then(function(client)
        {
             var db=client.db('communer');
             var collection=db.collection("communities");
             return collection.findOne({community_id:str}).then(function(community){
                if(community.access=='private')
                {
                    const Notif=require('../models/Notif')(community.author);
                    const newNotif = new Notif({
                    description:"A user wants to join your group",
                    userid:req.user.userid,
                    community_id:str
                    });
                     newNotif.save();
             var db=client.db('communer');
             var collection=db.collection("users");
             collection.update(
                { 'userid':req.user.userid },
                {
                    $push: {
                        pending_req: str
                         
                    }
                }
            );
            var db=client.db('communer');
             var collection=db.collection("users");
             var desc=req.user.userid+" wants to join your "+str+" group";
             collection.update(
                { 'userid':community.author},
                {
                    $push: {
                        notifs: {
                            description:desc,
                            userid:req.user.userid,
                            community_id:str,
                            date: new Date(Date.now()) 
                        }
                         
                    }
                }
            ).then(function(){
                var mongoose=require('mongoose')
                mongoose.connect('mongodb://localhost/communer').then(function(client){
                res.redirect('/community/'+str);
               });
            })
                }
                else
                {
                   req.user.communities.forEach(element => {
          if(element==str) {res.redirect('/community/'+str);}
          else{
              req.user.communities.push(str);
              var MongoClient = require('mongodb').MongoClient;
              MongoClient.connect('mongodb://localhost:27017').then(function(client)
              {
                  
                  var db=client.db('communer');
                  var collection=db.collection("communities");  
                  return collection.update(
                    { 'community_id':str },
                    {
                        $push: {
                            members: req.user.userid
                        }
                        
                    }
                ).then(function(){
                    var db=client.db('communer');
                    var collection=db.collection("users");  
                    return collection.update( { 'userid':req.user.userid },
                    {
                        $push: {
                            communities: str
                        }
                        
                    });
                   }).then(function(){
                    var mongoose=require('mongoose')
                    mongoose.connect('mongodb://localhost/communer').then(function(client){
                    res.redirect('/community/'+str);
                   });
                })
            
            });
          }
        });  
                }
                
             })
            })
                // var db=client.db('communer_notif');
    //             var collection=db.collection(community.author);
                
    //          })
    //         })
             
    //  req.user.communities.forEach(element => {
    //       if(element==str) {res.redirect('/community/'+str);}
    //       else{
    //           req.user.communities.push(str);
    //           var MongoClient = require('mongodb').MongoClient;
    //           MongoClient.connect('mongodb://localhost:27017').then(function(client)
    //           {
                  
    //               var db=client.db('communer');
    //               var collection=db.collection("communities");  
    //               return collection.update(
    //                 { 'community_id':str },
    //                 {
    //                     $push: {
    //                         members: req.user.userid
    //                     }
                        
    //                 }
    //             ).then(function(){
    //                 var db=client.db('communer');
    //                 var collection=db.collection("users");  
    //                 collection.update( { 'userid':req.user.userid },
    //                 {
    //                     $push: {
    //                         communities: str
    //                     }
                        
    //                 });
    //                 res.redirect('/community/'+str);

    //             });
            
    //         });
    //       }
    //     });
    });
   
    //Post for Creating Community
    router.post('/create', (req, res) => {
        let errors = [];
    const { name, access,community_id } = req.body;
    console.log(name,access,community_id);

    Community.findOne({ community_id: community_id }).then(community => {
        if (community) {
          errors.push({ msg: 'Group id already exists' });
            res.render('create_community', {
            errors,
            name,
            access,
            community_id,
            user: req.user
          });
        } 
        else{
            const newCommunity = new Community({
                name,
                access,
                community_id,
                author: req.user.userid,
                members: [req.user.userid]
              });
        
              
              newCommunity.save().then(user =>{
                var MongoClient = require('mongodb').MongoClient;


                MongoClient.connect('mongodb://localhost:27017', function (err, client) {
                if (err) throw err;
              
                var db = client.db('communer');
                           
                db.collection('users').update(
                  { 'userid':req.user.userid },
                  {
                      $push: {
                          communities: community_id
                      }
                  }
              )
              }); 
              const mongoose=require('mongoose');
              mongoose.connect('mongodb://localhost/community_posts');
            var Community_post_Model=require('../models/Community_post')(community_id);
                
                    const newCommunity_post = new Community_post_Model({
                    story:"Welcome to the community",
                    author:"communer",
                    date:Date.now(),
                    files:["communer.png"],
                    type:["image/png"]
                });
                newCommunity_post.save().then(user=>{
                    
                    var mongoose=require('mongoose')
                    mongoose.connect('mongodb://localhost/communer').then(function(client){
                        req.flash(
                            'success_msg',
                            'Community Created Succesfully'
                          );
                        res.redirect('/community/'+community_id);
                    });
                    
                })
              }).catch(err => console.log(err));
        }
    
});
    });

module.exports=router;