

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
  //render the homepage template
  res.render('homepage');
});
//This route is activated when the user clicks the create account button
app.post('/register',function(req,res){
  console.log("hello");
  var username = req.body.username,
      password = req.body.password,
      email    = req.body.email;
  //req.body holds json formatted information from the input text field that the user has submitted
  //we can parse req.body to grab the inputted info and check the infor agains the database
  console.log(req.body);
});
//This route is activated when the user clicks to login
app.post('/login',function(req,res){
  console.log("login");
  var username = req.body.username,
      password = req.body.password;
  console.log(req.body);
})

//Starts up the node server listening on port 8080
app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})