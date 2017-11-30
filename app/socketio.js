module.exports = function(io,connection){

    //=================SOCKET FUNCTIONS================
    io.on('connection',function(socket){
        socket.emit('testConnection', {data: "This is test data."});
      })
      
      io.on('myReservations',function(socket){
        //perform queries to pull up user's reservations
      })
      
      io.on('myReviews',function(socket){
        //perform queries to pull up user's reviews
      })
}