const express=require('express');
const router=express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../../config/auth');
const { communityURL } = require('../../config/ensureURL');

router.get('*',communityURL,function(req,res,done){
        var str='';  
        url=req.url;
        for(var i=1;i<url.length;i++)
        {
            str+=url[i];
        }
        console.log("This is the URL",str);
            if(!req.isAuthenticated()){
            
                res.redirect('/community/guest/'+str);
            
            }   
            else{
                req.user.communities.forEach(element => {
                    if(element!=str){
                        res.redirect('/community/user/'+str);
                    }
                });
                                    
                        var MongoClient = require('mongodb').MongoClient;
                        MongoClient.connect('mongodb://localhost:27017', function (err, client) {
                            if (err) throw err;
                            var db = client.db('community_posts');
                            db.collection(str).find({}, function (findErr, resultnew){
                                res.render('community_post_author',{commid:str,posts:resultnew,user:req.user});  
                            });
            
                        });
                    
                
            }
        });




module.exports=router;