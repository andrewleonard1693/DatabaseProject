

// node package declarations
var mysql      	= 	require('mysql'),
	socket		= 	require('socketio'),
	express		=	require('express'),
	app			=	express();

//create the connection details to the mysql database
var connection = mysql.createConnection({
  host     : 'db-instance.cgs2c9qhx8la.us-east-2.rds.amazonaws.com',
  port	   : '3306',
  user     : 'ajl246',
  password : 'db-master-password'
});
//connect to db
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});


//route for homepage
app.get('/', function (req, res) {
  res.send('Eat ass jack')
})
//node app is listening on port 8080
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})