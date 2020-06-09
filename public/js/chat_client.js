const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const roomList = document.getElementById('room-name');
const nav_name = document.getElementById('nav_name');
const nav_notifs = document.getElementById('nav_notifs');
const nav_notifscount = document.getElementById('nav_notifscount');

const myroom=document.getElementById('room_head');
const msg=document.getElementById('msg');
const btn=document.getElementById('btn');
let socket = io.connect('http://localhost:50'); 
 console.log(socket.id); // undefined
 var myid=socket.id;


 socket.on('connect', () => {
    console.log(socket.id); // an alphanumeric id...

    roomList.addEventListener('click',function(e) {
        e.preventDefault();
        if(e.target && e.target.nodeName == "LI") {
            console.log(e.target.id + " was clicked "+e.target.innerHTML);
            var newroom=e.target.innerHTML;
            var myid=socket.id;
            console.log("Original value is ",socket.id);
            socket.emit('change_room', { myid, newroom });
            myroom.innerHTML=""+newroom;
            msg.style.display = "block";
            btn.style.display = "block";
            document.querySelector('.chat-messages').innerHTML='';
        }
        })
 });


 


 chatForm.addEventListener('submit', e => {
    e.preventDefault();
  
    // Get message text
    const msg = e.target.elements.msg.value;
  
    // Emit message to server
    socket.emit('chatMessage', msg);
  
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
  });


  



  function outputMessage(item,uid) {
    date= new Date(item.date) 
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var today = dd + '/' + mm + '/' + yyyy;
    var dt=today+','+date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const div = document.createElement('div');
    div.classList.add('message');
    if(item.from==uid){
      div.style.backgroundColor='#dcf5e7';
      div.style.color='darkgreen'
    }
    div.innerHTML = `<p class="meta">${item.from} <span class="datetime">${dt}</span></p>
  <p class="text">
    ${item.message}
  </p>`;
    document.querySelector('.chat-messages').appendChild(div);
  }
  socket.on('rooms', ({ room }) => {
    roomName.innerHTML = `
    ${room.map(comm => `<li style="cursor:pointer" class='room_item' id='a'>${comm}</li>`).join('')}
  `;
    
  });


  socket.on('navbar', ({ user }) => {

    nav_name.innerHTML= `${user.userid}`;
     var count=0; 
    user.notifs.forEach(function (item){  
       count++; 
      nav_notifs.innerHTML+=`<a id="nav_notifs" class="dropdown-item" href="/notifs">
      ${item.description}
        </a>`
      }); 
       if(count!=0){ 
      nav_notifscount.innerHTML= `${count}`;
         } 
    
  });

//   $('.room_list').click(function(e){
//     e.preventDefault();
//     console.log('clicked');
// })

// $('ul#room-name li').click( function() {
   
//     console.log('clicked');
//     console.log($(this).value);
// });


socket.on('chat_backup', ({ items,uid }) => {
console.log("Recieved backup");
if(items){
  items.forEach(element => {
    outputMessage(element,uid);
  });
}
chatMessages.scrollTop = chatMessages.scrollHeight;
console.log(items);
})


  socket.on('message', ({item,uid}) => {
    console.log(item);
    outputMessage(item,uid);
  
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  // Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}
