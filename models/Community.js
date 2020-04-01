const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    name:
    {   type:String,
        required: true
    },
    access:
    {   type:String,
        required: true
    },
    community_id:{
        type:String,
        required:true
    },
    author:
    {   type:String,
        required: true
    },
    members:{
        type:Array,
        required:false
    }
  

});
const Community=mongoose.model('Communities',UserSchema);
module.exports=Community;