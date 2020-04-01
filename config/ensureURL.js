module.exports ={

    communityURL: function(req,res,next){
        var str='';  
        url=req.url;
        for(var i=1;i<url.length;i++)
        {
            str+=url[i];
        }
        
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
        }
}