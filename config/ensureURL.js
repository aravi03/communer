var ObjectId = require('mongodb').ObjectId; 
module.exports ={

    communityURL: function(req,res,next){
      var str=req.params.comid;
        console.log("This is the name",str);
        var MongoClient = require('mongodb').MongoClient;
    
    
        MongoClient.connect('mongodb://localhost:27017', function (err, client) {
        if (err) throw err;
      
        var db = client.db('communer');
      
        db.collection('communities').findOne({'community_id':str}, function (findErr, result) {
          if (findErr) throw findErr;
          if(result){
            console.log(result);
            console.log("Hurray! DB found");
            res.locals.community=result;
            return next();}
            else{
                res.sendStatus(404);
            }
          })
        })
        },
        postURL: function(req,res,next){
          var str=req.params.comid;
          var postid=req.params.postid;
            console.log("This is the name",str);
            var MongoClient = require('mongodb').MongoClient;
        
        
            MongoClient.connect('mongodb://localhost:27017', function (err, client) {
            if (err) throw err;
          
            var db = client.db('communer');
          
            db.collection('communities').findOne({'community_id':str}, function (findErr, result) {
              if (findErr) throw findErr;
              if(result){
                console.log(result);
                console.log("Hurray! DB found");
                res.locals.community=result;
                var MongoClient = require('mongodb').MongoClient;
                MongoClient.connect('mongodb://localhost:27017').then(function(client)
                {  var db=client.db('community_posts');
                   var collection=db.collection(str);
                   var oid=new ObjectId(postid);
                   return collection.findOne({_id:oid})
              }).then(function(item){
                if(item){
                  return next();
                }
                else{
                  res.sendStatus(404);
                }
                
              })






                }
                else{
                    res.sendStatus(404);
                }
              })
            })
            }
}