const express=require('express');
const router=express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');
const { communityURL,postURL } = require('../config/ensureURL');
const app=express();
var ObjectId = require('mongodb').ObjectId; 

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
            var access=res.locals.community.access;
           
            if(req.isAuthenticated()){
                console.log("I'm logged in");
                //req.isAuthenticated() will return true if user is logged in
                
                req.user.communities.forEach(element => {
                    if(element==str){
                        isauthor=true;
                    }});
                    
                        if(isauthor)   {   
                            console.log("I'm the author");
                            return res.render('community_post_author',{community:res.locals.community,posts:items,user:req.user,acess:'true'});
                        }
                        console.log("I'm just the user");
                        if(access=='public')
                        return res.render('community_post_user',{community:res.locals.community,posts:items,user:req.user});
                        else{
                            if(req.user.pending_req.includes(str))
                            {
                                return res.render('private_user_pend',{community:res.locals.community,user:req.user});

                            }
                            else{
                                return res.render('private_user',{community:res.locals.community,user:req.user});

                            }
                        }
            }
            else{
                console.log("I'm just a guest");
                if(access=='public')
                return res.render('community_post_guest',{community:res.locals.community,posts:items});
                else
                return res.render('private_guest',{community:res.locals.community});

            }
        }).catch(function(err){
            console.log(err);

        });
}



router.get('/communer',function(req,res){
    var MongoClient = require('mongodb').MongoClient;
     MongoClient.connect('mongodb://localhost:27017').then(function(client)
    {  var db=client.db('community_posts');
        var collection=db.collection('communer');
        
        return collection.find().sort({"date": -1}).toArray();
    }).then(function(items){
        if(req.isAuthenticated())
        res.render('communer_user',{posts:items,user:req.user})
        else
        res.render('communer_guest',{posts:items})
    });

    
});





router.get('/:comid',communityURL,view_community);

router.get('/:comid/post/:postid',postURL,ensureAuthenticated,function(req,res){
    var comid=req.params.comid;
    var postid=req.params.postid;
    if (ObjectId.isValid(postid)) {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017').then(function(client)
    {  var db=client.db('community_posts');
       var collection=db.collection(comid);
       var oid=new ObjectId(postid);
       return collection.findOne({_id:oid})
    }).then(function(item){
    console.log("New one ",item.author,item.story);
    
    res.render('viewpost',{item:item,user:req.user,community:res.locals.community})
    })
    
}
else{
  
   res.send("not valid");
}
    
    
    });


    router.get('/:comid/like/:postid',communityURL,ensureAuthenticated,function(req,res){
        var comid=req.params.comid;
        var postid=req.params.postid;
        if (ObjectId.isValid(postid)) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://localhost:27017').then(function(client)
        {  var db=client.db('community_posts');
           var collection=db.collection(comid);
           var oid=new ObjectId(postid);
           return collection.update(
            { _id:oid },
            {
                $push: {
                    likes: req.user.userid
                     
                }
            }
        );

        }).then(function(item){
            var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://localhost:27017').then(function(client)
        {  var db=client.db('community_posts');
           var collection=db.collection(comid);
           var oid=new ObjectId(postid);
           return collection.findOne({ _id:oid });
         }).then(function(item){
             var author=item.author;
             console.log("The author notifs is ",author);
             var MongoClient = require('mongodb').MongoClient;
             MongoClient.connect('mongodb://localhost:27017').then(function(client)
             {  var db=client.db('communer');
                var collection=db.collection('users');
                var newstr= req.user.userid+" liked your post";
                return collection.update(
                    { 'userid':author },
                    {
                        $push: {
                            notifs: {
                               
                                description:newstr,
                                comid:comid,
                                postid:postid,
                                date: Date.now()
                               
                            }
                             
                        }
                    }
                );
              }).then(function(item){

         console.log("Likes ");
        var red='/community/'+comid+'/post/'+postid;
        res.redirect(red);
        })
    })
        })
        
    }
    else{
      
       res.send("not valid");
    }
        
        
        });





router.post('/:coid',ensureAuthenticated,function(req,res){
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
            date: new Date(Date.now()),
            likes:[],
            comments:[]
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
                }
            });
          }
        //   else {
        //     res.redirect('/community/'+str);
        //   }

        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://localhost:27017', function (err, client) {
                if (err) throw err;
              
                var db = client.db('communer');
                db.collection('communities').findOne({ community_id: str })
            .then(community => {
                community.members.forEach(function(item){
                    console.log("Hey these are the members "+item);
                var MongoClient = require('mongodb').MongoClient;
                MongoClient.connect('mongodb://localhost:27017', function (err, client) {
                if (err) throw err;
                var db = client.db('communer_home'); 
                console.log("Hey its found man");
                if(isfile){
                    db.collection(item).insertOne({
                        story: story,
                        author:author,
                        date: new Date(Date.now()),
                        files: [str+'_'+docInserted.ops[0]._id+ext],
                        type: [type],
                        community_id:str,
                        postid:''+docInserted.ops[0]._id
                    })
                }
                else{
                    db.collection(item).insertOne({
                        story: story,
                        author:author,
                        date: new Date(Date.now()),
                        community_id:str,
                        postid:''+docInserted.ops[0]._id
                    })  
                }
                
                })

            })
            
        });})


                   
                  
        res.redirect('/community/'+str);
            
        });

    });

});



router.post('/:comid/post/:postid',communityURL,ensureAuthenticated,function(req,res){
    var comid=req.params.comid;
    var postid=req.params.postid;
    const comment=req.body.comment;
    if (ObjectId.isValid(postid)) {
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017').then(function(client)
    {  var db=client.db('community_posts');
       var collection=db.collection(comid);
       var oid=new ObjectId(postid);
       return collection.update(
        { _id:oid },
        {
            $push: {
                comments:{from:req.user.userid,comment:comment,date:Date.now()}
                 
            }
        }
    );




    }).then(function(item){
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://localhost:27017').then(function(client)
        {  var db=client.db('community_posts');
           var collection=db.collection(comid);
           var oid=new ObjectId(postid);
           return collection.findOne({ _id:oid });
         }).then(function(item){
             var author=item.author;
             console.log("The author notifs is ",author);
             var MongoClient = require('mongodb').MongoClient;
             MongoClient.connect('mongodb://localhost:27017').then(function(client)
             {  var db=client.db('communer');
                var collection=db.collection('users');
                var newstr= req.user.userid+" commented on your post";
                return collection.update(
                    { 'userid':author },
                    {
                        $push: {
                            notifs: {
                               
                                description:newstr,
                                comid:comid,
                                postid:postid,
                                date: Date.now()
                               
                            }
                             
                        }
                    }
                );
              }).then(function(item){

         console.log("Likes ");
        var red='/community/'+comid+'/post/'+postid;
        res.redirect(red);
        })
    })
    })
    
}
else{
  
   res.send("not valid");
}
    
    
    });






module.exports=router;
      