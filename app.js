

// node package declarations
var mysql      	= 	require('mysql'),
  socket		= 	require('socketio'),
  bodyParser	=	require('body-parser'),
  cookieParser = require('cookie-parser'),
	express		=	require('express'),
	app			=	express();

//create the connection details to the mysql database
var connection = mysql.createConnection({
  host     : 'db-instance.cgs2c9qhx8la.us-east-2.rds.amazonaws.com',
  port	   : '3306',
  user     : 'ajl246',
  password : 'db-master-password',
  database: 'PristineHotels'
});
//connect to db
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
//set the view engine to ejs
app.set('view engine','ejs');

//allow the express app to render the static files in the public folder
app.use(express.static('public'));

//route for homepage
app.get('/', function (req, res) {
  res.render('homepage');
});
// app.post('/',function(req,res){
//   console.log("testing");
// });
app.post('/', function(req,res){
  console.log("test");
})
//route for post request for login/registration
app.post('/register',function(req,res){
  console.log("hello");
  console.log(req.body);
});
app.post('/login',function(req,res){
  console.log("login");
  console.log(req.body);
})
//node app is listening on port
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})