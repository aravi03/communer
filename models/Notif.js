
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/communer_notifs');
var fn=function(name){
   const UserSchema=new mongoose.Schema({
    description:
    {   type:String,
        required: false
    },
    userid:
    {   type:String,
        required: false
    },
    community_id:
    {   type:String,
        required: false

    }

 },
 { collection:name  });
  return mongoose.model(name,UserSchema);
}

module.exports=fn;