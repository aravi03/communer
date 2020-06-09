const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/communer');
const UserSchema=new mongoose.Schema({
    name:
    {   type:String,
        required: true
    },
    email:
    {   type:String,
        required: true
    },
    userid:{
        type:String,
        required: true
    },
    password:
    {   type:String,
        required: true
    },
    communities:{
        type:Array,
        required:true
    },
    pending_req:{
        type:Array,
        required:false
    },
    notifs:{
        type:Array,
        required:false
    }


});
const User=mongoose.model('User',UserSchema);
module.exports=User;