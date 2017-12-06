module.exports = function(io,connection){

    //=================SOCKET FUNCTIONS================
      
      io.on('connection',function(socket){
        socket.on('alert',function(){
          console.log("connection hit")
        })
        io.emit('serverside');
      })
}