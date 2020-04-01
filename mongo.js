var MongoClient = require('mongodb').MongoClient;


  MongoClient.connect('mongodb://localhost:27017', function (err, client) {
  if (err) throw err;

  var db = client.db('communer');

  db.collection('postid').findOne({'community_id':'abc'}, function (findErr, result) {
    if (findErr) throw findErr;
    console.log(result._id);
    client.close();
  });

//   db.collection('users').update(
//     { 'name':'7' },
//     {
//         $push: {
//             communities: 'i'
//         }
//     }
// )
}); 



// const mongoose=require('mongoose');
//                 mongoose.connect('mongodb://localhost/communer');
//                 const UserSchema=new mongoose.Schema({
//                     community_id:
//                     {   type:String,
//                         required: false
//                     },
//                     post_id:
//                     {
//                       type:String,
//                       required:false
//                     }
                    
//                  },
//                  { collection: 'postid' });

                 
//                 const Community_post=mongoose.model('postid',UserSchema);

                
//                 const newCommunity_post = new Community_post({
//                     community_id:'abc'
                    
//                 });
//                 newCommunity_post.save()