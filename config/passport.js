// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');

// var connection = mysql.createConnection(dbconfig.connection);

// connection.query('USE ' + dbconfig.database);
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
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log("serializing")
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM Customer WHERE cid = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'createAccountUsername',
            passwordField : 'createAccountPassword',
            // emailField : 'createAccountEmail',
            passReqToCallback : true // allows us to pass back the entire request to the callback
            // session:false
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            console.log(username);
            console.log(password);
            connection.query("SELECT * FROM Customer WHERE username = ?",[username], function(err, rows) {
                console.log(rows);
                if (err){
                    return done(err);
                }
                if (rows.length) {
                    console.log("length = 0")
                    // return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    return done(null, false);
                } else {
                    console.log("got into the insertion part")
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: password,  // use the generateHash function in our user model
                        email: req.createAccountEmail
                    };

                    var insertQuery = "INSERT INTO Customer ( username, password, email ) values (?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password,newUserMysql.email],function(err, rows) {
                        newUserMysql.id = rows.insertId;
                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'loginUsername',
            passwordField : 'loginPassword',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM Customer WHERE username = ?",[username], function(err, rows){
               
                if (err){
                    return done(err);
                }
                if (!rows.length) {
                    return done(null, false); // req.flash is the way to set flashdata using connect-flash
                    // return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                // if the user is found but the password is wrong
                if (!(rows[0].password==password))
                    return done(null, false); // create the loginMessage and save it to session as flashdata
                    // return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};
