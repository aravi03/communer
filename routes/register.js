const express=require('express');
const bcrypt = require('bcrypt');

const passport = require('passport');
// Load User model
const User = require('../models/User');

const  communities=["communer"];


const { forwardAuthenticated } = require('../config/auth');

const router=express.Router();

router.get('/',forwardAuthenticated,function(req,res){
    res.render('register');

});

router.post('/', (req, res) => {
    const { name, email,userid, password, password2 } = req.body;
    let errors = [];
   
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        userid,
        password,
        password2
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email id already exists' });
            res.render('register', {
            errors,
            name,
            email,
            userid,
            password,
            password2
          });
        
        
      } else {
        User.findOne({ userid: userid }).then(user =>{
          if(user){
            errors.push({ msg: 'User ID already exists' });
            res.render('register', {
            errors,
            name,
            email,
            userid,
            password,
            password2
          });

          }
          else{
            const newUser = new User({
            name,
            email,
            userid,
            password,
            communities
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'Registered succesfully'
                  );
                   const Homepost=require('../models/Home')(userid);
                    const newHomepost = new Homepost({
                      story:"Welcome to the Communer",
                      author:"communer",
                      date:Date.now(),
                      files:["communer.png"],
                      type:["image/png"],
                      community_id:"communer",
                      postid:"1234"
                  });
                  newHomepost.save().then(user=>{

                  //   const Notif=require('../models/Notif')(userid);
                  //   const newNotif = new Notif({
                  //   description:"Welcome to the Communer. You can view all your notifications here"
                  // });
                  // newNotif.save()
                  var mongoose=require('mongoose')
                  mongoose.connect('mongodb://localhost/communer').then(function(client){
                  
                    res.redirect('/login');
                  });
                  
                  });
                  
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
        }
      });
    }
  });

module.exports=router;