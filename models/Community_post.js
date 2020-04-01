
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/community_posts');
const UserSchema=new mongoose.Schema({
    story:
    {   type:String,
        required: false
    },
    files:
    {   type:Array,
        required: false
    },
    author:
    {
        type:String,
        required:false
    },
    date:{
        type: Date,
        default: Date.now
    } 

});
const Community_post=mongoose.model(community_id,UserSchema);
module.exports=Community_post;