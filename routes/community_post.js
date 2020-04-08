const express=require('express');
const router=express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');
const { communityURL } = require('../config/ensureURL');
const app=express();


const view_community=function(req,res,next){

    var str='';
    url=req.url;
    for(var i=1;i<url.length;i++)
    {
        str+=url[i];
    }
    
    console.log("This is the name",str);
    var MongoClient = require('mongodb').MongoClient;


    MongoClient.connect('mongodb://localhost:27017').then(function(client)
    {
        
        var db=client.db('community_posts');
        var collection=db.collection(str);
        
        return collection.find().sort({"date": -1}).toArray();
    }).then(function(items){
            var isauthor=false;
            
            if(req.isAuthenticated()){
                console.log("I'm logged in");
                //req.isAuthenticated() will return true if user is logged in
                
                req.user.communities.forEach(element => {
                    if(element==str){
                        isauthor=true;
                    }});
                        if(isauthor)   {   
                            console.log("I'm the author");
                            return res.render('community_post_author',{community:res.locals.community,posts:items,user:req.user});
                        }
                        console.log("I'm just the user");
                        return res.render('community_post_user',{community:res.locals.community,posts:items,user:req.user});
                
            }
            else{
                console.log("I'm just a guest");
                return res.render('community_post_guest',{community:res.locals.community,posts:items});
                
            }
        }).catch(function(err){
            console.log(err);

        });
}

router.get('*',communityURL,view_community);
router.post('*',ensureAuthenticated,function(req,res){
    var str='';
    url=req.url;
    for(var i=1;i<url.length;i++)
    {
        str+=url[i];
    }
    console.log("The content is "+req.body.story);
    const story = req.body.story;
    const isfile=req.files;
    console.log("This is req.files.upfile "+isfile);
    
    const author=req.user.userid;
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017').then(function(client)
    {
        
        var db=client.db('community_posts');
        var collection=db.collection(str);
        collection.insertOne({
            story: story,
            author:author,
            date: new Date(Date.now())
        }).then(function(docInserted){
            
            console.log("The passed value is "+story);
            console.log("The inserted id is "+docInserted.ops[0]._id);
            console.log(file);

            if(isfile){
                console.log("The file is",req.files.upfile);
                var file = req.files.upfile,
                  name = file.name,
                  type = file.mimetype;
                  var ext;
                    if(type=='video/mp4') 
                    {ext='.mp4';
                     }
                    else if(type=='image/png') 
                    {ext='.png'}
                    else if(type=='image/jpeg') 
                    {ext='.jpg';}
                    
                var uploadpath =  './uploads/' +str+'_'+docInserted.ops[0]._id+ext;
                console.log(type);
                file.mv(uploadpath,function(err){
                  if(err){
                    console.log("File Upload Failed",name,err);
                    res.send("Error Occured!")
                  }
                  else {
                    console.log("File Uploaded ",name);
                    
                    collection.update(
                        { '_id':docInserted.ops[0]._id },
                        {
                            $push: {
                                files: str+'_'+docInserted.ops[0]._id+ext
                                 
                            }
                        }
                    );
                    collection.update(
                        { '_id':docInserted.ops[0]._id },
                        {
                            $push: {
                                type: type
                                 
                            }
                        }
                    );

                    res.redirect('/community/'+str);
                  }
                });
              }
              else {
                res.redirect('/community/'+str);
              }

            
        });

    });

});

module.exports=router;
      