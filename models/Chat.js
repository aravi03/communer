
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/chats');
var fn=function(name){
   const UserSchema=new mongoose.Schema({
    from:
    {   type:String,
        required: true
    },
    message:
    {   type:String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    } 

 },
 { collection:name  });
  return mongoose.model(name,UserSchema);
}

module.exports=fn;