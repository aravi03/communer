var express = require('express');
var router = express.Router();
var path =require('path');
const moment = require('moment');

const mongoose=require('mongoose');




function formatMessage(username, text) {
    return {
      username,
      text,
      time: Date.now()
    };
  }

/* GET home page. */
var returnRouter = function(io) {

    var users = [];
    var userinfo={};
    function userJoin(id, username,room) {
        const user = { id, username,room};
        users.push(user);
        return user;
      }
      
      // Get current user
      function getCurrentUser(id) {
        return users.find(user => user.id === id);
      }
      
      function changeRoom(myid,newroom){
        var index = users.findIndex(item => item.id+'' == myid+'')
        users.find(item => item.id == myid).room = newroom;
        console.log(index);
        console.log("Passed id ",myid);
        users.forEach(function(item){
            console.log("User name and id",item.id,item.username);
        })
      }

      // User leaves chat
      function userLeave(id) {
        const index = users.findIndex(user => user.id === id);
      
        if (index !== -1) {
          return users.splice(index, 1)[0];
        }
      }
      






    router.get('/', function(req, res, next) {
        console.log(req.isAuthenticated())
        if(req.isAuthenticated()){
            userinfo=req.user;
            console.log(req.user.userid);
            res.sendFile(path.join(__dirname, '../public/chat.html'));
        }
        else{
            res.redirect('/login');
        }
        
    });
   
    io.on('connection', function(socket) {
      
      io.to(`${socket.id}`).emit('navbar', {
        user: userinfo
        
      });

        console.log(socket.id)
        if(userinfo.communities)
        var comm = userinfo.communities.filter(function(e) { return e !== 'communer' });
        const user = userJoin(socket.id, userinfo.userid,'room');
        console.log(user.id,user.username,user.room);
        socket.join(user.room);
        console.log('A user connected');
        
         socket.on('clientEvent', function(data) {
            console.log(data);
         });

         io.to(`${socket.id}`).emit('rooms', {
            room: comm
            
          });
         
         





         socket.on('chatMessage', msg => {
            const user = getCurrentUser(socket.id);
            // const user = getCurrentUser(socket.id);
            var MongoClient = require('mongodb').MongoClient;
            MongoClient.connect('mongodb://localhost:27017').then(function(client)
            { var db=client.db('Chat');
                var collection=db.collection(user.room);  
                return collection.insertOne({
                  from:user.username,
                  message:msg,
                  date:Date.now()
                },function(error,response){
                  var item=response.ops[0];
                  console.log("Just checking ",item.from,item.message);
                  var uid=user.username;
                  io.to(user.room).emit('message', {item,uid});
                })


            // const mongoose=require('mongoose');
            // mongoose.connect('mongodb://localhost/Chat');
            // var Chat=require('../models/Chat')(user.room);
              
            //       const newChat = new Chat({
            //       from:user.username,
            //       message:msg,
            //       date:Date.now(),
                  
            //   });
            //   newChat.save().then(function(item){
            //     console.log("Just checking ",item.from,item.message)
            //     io.to(user.room).emit('message', item);

              })
          });

          socket.on('change_room', ({ myid, newroom }) => {
            console.log("1st pass is ",myid,newroom);
            var MongoClient = require('mongodb').MongoClient;
              MongoClient.connect('mongodb://localhost:27017').then(function(client)
              { var db=client.db('Chat');
                  var collection=db.collection(newroom);  
                  return collection.find({}).toArray();

                  }).then(function(items){
                    var uid=user.username;
                    io.to(`${myid}`).emit('chat_backup',{items,uid});

                    changeRoom(myid,newroom);
                    console.log(user.id,user.username,user.room);
                    socket.join(user.room);
                  }) 
          });


          socket.on('disconnect', () => {
            const user = userLeave(socket.id);
          });

    
        


    
    });

    

        

    router.post('/message', function(req, res) {
        console.log("Post request hit.");
        // res.contentType('text/xml');
        console.log(appjs);
        io.sockets.emit("display text", req);
        // res.send('<Response><Sms>'+req.body+'</Sms></Response>');
    });

    return router;
}

module.exports = returnRouter;