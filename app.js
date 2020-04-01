const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const path=require('path');
require('./config/passport')(passport);

const app=express();

app.listen(50);
app.use(expressLayouts);
app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static(__dirname+'/public'));

//Connect to DB
mongoose.connect('mongodb://localhost/communer');

//BodyParser
app.use(express.urlencoded({extended:false}));

// Express session
app.use(
    session({
      secret: 'Aravinth_R',
      resave: true,
      saveUninitialized: true
    })
  );
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

  // Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  
app.use('/community',express.static(__dirname+'/uploads'));
app.use(fileUpload());

app.use('/',require('./routes/home'));
app.use('/login',require('./routes/login'));
app.use('/register',require('./routes/register'));
app.use('/community',require('./routes/community'));
// app.use('/community/guest',require('./routes/community_post/guest'));
// app.use('/community/user',require('./routes/community_post/user'));
// app.use('/community/author',require('./routes/community_post/author'));
app.use('/community',require('./routes/community_post'));
