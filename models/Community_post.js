
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/community_posts');
var fn=function(name){
   const UserSchema=new mongoose.Schema({
                    story:
                    {   type:String,
                        required: false
                    },
                    files:
                    {   type:Array,
                        required: false
                    },
                    type:
                    {   type:Array,
                        required: false

                    },
                    author:
                    {
                        type:String,
                        required:false
                    },
                    post_id:
                    {
                        type:String,
                        required:false
                    },
                    likes:
                    {
                        type:Array,
                        required:false
                    },
                    comments:
                    {
                        type:Array,
                        required:false
                    },
                    
                    date:{
                        type: Date,
                        default: Date.now
                    } 
                 },
                 { collection: name});
            return mongoose.model(name,UserSchema);
}

module.exports=fn;