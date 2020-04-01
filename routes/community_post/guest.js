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
    if(req.isAuthenticated()){
        req.user.communities.forEach(element => {
            if(element===str){
                res.redirect('/author/user/'+str);
            }
            else{
                res.redirect('/community/user/'+str);
            }
            
        })
    }   
    else{
        var MongoClient = require('mongodb').MongoClient;


        MongoClient.connect('mongodb://localhost:27017', function (err, client) {
            if (err) throw err;
            var db = client.db('community_posts');
            db.collection(str).find({}, function (findErr, resultnew){
                res.render('community_post_guest',{commid:str,posts:resultnew});

            });
        });
    }

});






module.exports=router;


// //Function to check if the logged in user is a member or public 

// const check_user_guest=function(req,res,next){
   
    
//     var str='';
//     url=req.url;
    
//     for(var i=1;i<url.length;i++)
//     {
//         str+=url[i];
//     }
//     console.log("This is the name",str);
//     var MongoClient = require('mongodb').MongoClient;


//     MongoClient.connect('mongodb://localhost:27017', function (err, client) {
//         if (err) throw err;
//     var db = client.db('community_posts');
//     db.collection(str).find({}, function (findErr, resultnew1){
        
   
//     if(req.isAuthenticated()){
//         // req.user.communities.forEach(element => {
//         //     if(element===str){
//         //         console.log("I'm the rightful author");
//         //         res.render('community_post_member',{commid:str,posts:resultnew1,user:req.user});
//         //         return next();
//         //     }else{
//                 // res.render('community_post',{commid:str,posts:resultnew1,user:req.user});
//                return next();
//         //     }
//         // });

//     }
//     else{
//         console.log("I'm just a guest");
//         res.render('community_post_guest',{commid:str,posts:resultnew1});
        
        
//     }
//     });
// });
// }

// const check_user=function(req,res,next){
   
    
//     var str='';
//     url=req.url;
    
//     for(var i=1;i<url.length;i++)
//     {
//         str+=url[i];
//     }
//     console.log("This is the name",str);
//     var MongoClient = require('mongodb').MongoClient;


//     MongoClient.connect('mongodb://localhost:27017', function (err, client) {
//         if (err) throw err;
//     var db = client.db('community_posts');
//     db.collection(str).find({}, function (findErr, resultnew1){
        
   
//     if(req.isAuthenticated()){
//         req.user.communities.forEach(element => {
//             if(element===str){
//                 // console.log("I'm the rightful author");
//                 // res.render('community_post_member',{commid:str,posts:resultnew1,user:req.user});
//                 return next();
//             }else{
//                 res.render('community_post',{commid:str,posts:resultnew1,user:req.user});
               
//             }
//         });

//     }
//     else{
//         // console.log("I'm just a guest");
//         // res.render('community_post_guest',{commid:str,posts:resultnew1});
//         // return next();
        
//     }
//     });
// });
// }

// const check_user_member=function(req,res,next){
   
    
//     var str='';
//     url=req.url;
    
//     for(var i=1;i<url.length;i++)
//     {
//         str+=url[i];
//     }
//     console.log("This is the name",str);
//     var MongoClient = require('mongodb').MongoClient;


//     MongoClient.connect('mongodb://localhost:27017', function (err, client) {
//         if (err) throw err;
//     var db = client.db('community_posts');
//     db.collection(str).find({}, function (findErr, resultnew1){
        
   
//     if(req.isAuthenticated()){
//         req.user.communities.forEach(element => {
//             if(element===str){
//                 console.log("I'm the rightful author");
//                 res.render('community_post_member',{commid:str,posts:resultnew1,user:req.user});
                
//             }else{
//             //     res.render('community_post',{commid:str,posts:resultnew1,user:req.user});
//             //    return next();
//             }
//         });

//     }
//     // else{
//     //     console.log("I'm just a guest");
//     //     res.render('community_post_guest',{commid:str,posts:resultnew1});
//     //     return next();
        
//     // }
//     }
    
//     );
// });
// }





// //Function to process the get request
// const process_get=function(req,res,next){
//     var str='';
//     url=req.url;
    
//     for(var i=1;i<url.length;i++)
//     {
//         str+=url[i];
//     }
    
//     console.log("This is the name",str);
//     var MongoClient = require('mongodb').MongoClient;


//     MongoClient.connect('mongodb://localhost:27017', function (err, client) {
//     if (err) throw err;
  
//     var db = client.db('communer');
  
//     db.collection('communities').findOne({'community_id':str}, function (findErr, result) {
//       if (findErr) throw findErr;
//       if(result){
//         console.log(result);
//         console.log("Hurray! DB found");

//             var db = client.db('community_posts');
    
//             db.collection(str).find({}, function (findErr, resultnew)  {

//                 if(req.isAuthenticated()){
//                     console.log("I'm logged in");
//                     //req.isAuthenticated() will return true if user is logged in
                    
//                     req.user.communities.forEach(element => {
//                         if(element===str){
//                             console.log("I'm the rightful author");
//                             res.render('community_post_member',{commid:str,posts:resultnew,user:req.user});
//                             return;
//                         }else{
//                             res.render('community_post',{commid:str,posts:resultnew,user:req.user});
//                            return;
//                         }
//                     });
//                 }
//                 else{
//                     console.log("I'm just a guest");
//                     res.render('community_post_guest',{commid:str,posts:resultnew});
//                     return;
                    
//                 }
                
               
//                 client.close();

//                 //    resultnew.forEach(element => {
//                 //        console.log("Here's the date",element.date);
//                 //    });
                

//             });





         
//       }
      
//       client.close();
//     });
    
  
    
// //     db.collection(req.url).update(
// //       { 'name':'7' },
// //       {
// //           $push: {
// //               communities: 'i'
// //           }
// //       }
// //   )
//   });




    // res.render('create_community',{
    //     user: req.user
    //   });

   


//     });
// }




//Route for normal user
