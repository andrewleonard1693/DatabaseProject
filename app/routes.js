

// app/routes.js
module.exports = function(app, passport,io,connection) {
    
        // =====================================
        // HOME PAGE (with login links) ========
        // =====================================
        var addedReservation = false;
        var invalidLogin = false;
        app.io = io;
        app.get('/', function(req, res) {
            res.render('homepage');
            io.on('connection',function(socket){
                if(invalidLogin){
                    socket.emit('invalidLogin');
                    invalidLogin=false;
                }
            })
            //{ message: req.flash('signupMessage') }); // load the index.ejs file
        });
    
        // =====================================
        // LOGIN ===============================
        // =====================================

        // process the login form
        // app.post('/login', passport.authenticate('local-login', {
        //         successRedirect : '/profile', // redirect to the secure profile section
        //         failureRedirect : '/', // redirect back to the signup page if there is an error
        //         failureFlash : true // allow flash messages
        //     }),function(req, res) {
        //         if (req.body.remember) {
        //             req.session.cookie.maxAge = 1000 * 60 * 3;
        //         } else {
        //             req.session.cookie.expires = false;
        //         }
        //         res.redirect('/');
        // });
        app.post('/login', function(req,res,next){
            passport.authenticate('local-login',function(err,user,info){
                if(err){
                    return next(err);
                }
                if (!user) 
                { 
                    invalidLogin = true;
                    return res.redirect('/'); 
                }


                req.logIn(user,function(err){
                    if(err){ return next(err); }
                    return res.redirect('/profile/' + user.username);
                });
              })(req, res, next);
            });
        // =====================================
        // SIGNUP ==============================
        // =====================================
        // show the signup form
    
        // process the signup form
        app.post('/register', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),function(req,res){
            console.log("register request route hit")
        });
        // =====================================
        // PROFILE SECTION =========================
        // =====================================
        // we will want this protected so you have to be logged in to visit
        // we will use route middleware to verify this (the isLoggedIn function)
        app.get('/profile', function(req, res) {
            res.redirect('/profile/'+req.user.username);
        });


        //User's main profile page showing all of the hotels
        app.get('/profile/:username',isLoggedIn,function(req,res){
            //original url
            console.log("Original url "+req.originalUrl);
            var query = "select h.Hotel_Id, h.imagePath, l.Street, l.City, l.State, l.Country, l.ZIP, p.Phone from Hotel h left join Location l on h.Hotel_Id=l.Hotel_Id left join Phones p on p.Hotel_Id = l.Hotel_Id;"
            var hotels = null;
            connection.query(query, function(err,rows){
                if(err){
                    console.log(err);
                    return;
                }
            hotels=rows;
            res.render('profile', {
                user : req.user.username,
                originalUrl: req.originalUrl,
                hotelTitle: "All Hotels", // get the user out of session and pass to template
                myReservations: req.originalUrl+"/myreservations",
                searchRoute: req.originalUrl+"/search", 
                hotels: hotels,
                myRoomReviews: "/profile/"+req.params.username+"/myroomreviews/reviews",
                myBreakfastReviews: "/profile/"+req.params.username+"/mybreakfastreviews/reviews",
                myServiceReviews: "/profile/"+req.params.username+"/myservicereviews/reviews"
            });
            })
        })

        //route to display the current user's reservations
        app.get("/profile/:username/myreservations",function(req,res){
            //TODO: perform query logic to find the current user's reservations and pass them back to the view
            //NOTE: remember to add an edit and delete button to the user's reservation with text inputs set to not editable
            //at first and a delete button with maybe a prompt saying are you sure
            //get the reservation information
            var userHasReservations = false;
            var getUsersReservations ="select h.Hotel_Id, h.imagePath, l.Street, l.City, l.State, l.Country, l.ZIP, p.Phone, r.Room_no, r.invoiceNo, r.inDate, r.outDate, res.totalAmount, b.bType, s.sType from Hotel h left join Location l on h.Hotel_Id=l.Hotel_Id left join Phones p on p.Hotel_Id = l.Hotel_Id left join RoomReservation r on r.Hotel_ID=p.Hotel_Id, Reservation res, ReservationBreakfast b, ReservationServices s, Customer c where res.invoiceNo=r.invoiceNo and r.invoiceNo=b.invoiceNo and r.invoiceNo=s.invoiceNo and c.cid=res.cid and c.username=?;"
            connection.query(getUsersReservations,[req.params.username],function(err,rows){
                if(err){console.log(err);}
                else{
                    if(rows.length>0){
                        userHasReservations=true;  
                    }
                    var reservations = rows;
                    res.render('myreservations',
                    {
                        originalUrl: "/profile/"+req.params.username,
                        myReservations: "/profile/"+req.params.username+"/myreservations",
                        myReviews: "/profile/"+req.params.username+"/myreviews",
                        hotelTitle: "My Reservations",
                        user: req.params.username,
                        searchRoute: "/profile/"+req.params.username+"/search",
                        reservations: reservations,
                        myRoomReviews: "/profile/"+req.params.username+"/myroomreviews/reviews",
                        myBreakfastReviews: "/profile/"+req.params.username+"/mybreakfastreviews/reviews",
                        myServiceReviews: "/profile/"+req.params.username+"/myservicereviews/reviews"
                    });
                }
            })
            io.on('connection',function(socket){
                if(addedReservation){
                    socket.emit('reservationAdded');
                    addedReservation=false;
                }
                if(!userHasReservations){
                    socket.emit('userHasNoReservations');
                }
            });
        });
            
        
        //route to render all of the hotels with the user searched state
        app.get("/profile/:username/:state",function(req,res){
            console.log("state is "+req.params.state);
            //perform query logic to get the hotel information from the user inputted states
            // var hotels = getSearchedStates(req.params.state);
            var query = "select h.Hotel_Id, h.imagePath, l.Street, l.City, l.State, l.Country, l.ZIP, p.Phone from Hotel h left join Location l on h.Hotel_Id=l.Hotel_Id left join Phones p on p.Hotel_Id = l.Hotel_Id where l.State = ?;"
            connection.query(query, [req.params.state],function(err,rows){
                if(err){
                    console.log(err);
                }else{
                    var hotels = rows;
                    if(rows.length>0){
                        res.render('profile',{
                            user: req.params.username,
                            originalUrl: "/profile/"+req.params.username,
                            hotelTitle: req.params.state,
                            myReservations: "/profile/"+req.params.username+"/myreservations",
                            myReviews: "/profile/"+req.params.username+"/myreviews",
                            searchRoute: "/profile/"+req.params.username+"/search",
                            hotels: hotels,
                            myRoomReviews: "/profile/"+req.params.username+"/myroomreviews/reviews",
                            myBreakfastReviews: "/profile/"+req.params.username+"/mybreakfastreviews/reviews",
                            myServiceReviews: "/profile/"+req.params.username+"/myservicereviews/reviews"
                        })
                    }else{
                        //if the db doesnt return anything then just redirect to the main profile page
                        res.redirect('/profile/'+req.params.username);
                    }
                }
            })
            })

        //route for the write a review page
        app.get("/profile/:username/:hotelId/:roomNo/writeReview",function(req,res){
            //render the review page and pass in all the relevant information about the hotel
            var types = [];
            var query = "select s.sType from Reservation r left join ReservationServices s on r.InvoiceNo=s.invoiceNo, Customer c where c.username=? and c.cid=r.cid;"
            connection.query(query,[req.params.username],function(err,rows){
                if(err){console.log(err)}
                else{
                    if(rows.length>0){
                        types.push("Service Review");
                    }
                        var breakfastQuery = "select b.bType from Reservation r left join ReservationBreakfast b on r.InvoiceNo=b.invoiceNo, Customer c where c.username=? and c.cid=r.cid;"
                        connection.query(breakfastQuery,[req.params.username],function(err,rows){
                            if(err){console.log(err);}
                            else{
                                if(rows.length>0){
                                    types.push("Breakfast Review");
                                }
                                res.render('review',
                                {
                                    reviewTypes: types,
                                    postRoute:"/profile/"+req.params.username+"/"+req.params.hotelId+"/"+req.params.roomNo+"/writeReview"
                                })
                            }
                        })
                }
            })
        });
        app.post("/profile/:username/:hotelId/:roomNo/writeReview",function(req,res){
            //implement logic to add a review to the database
            var reviewType = req.body.roomType;
            var rating = req.body.star;
            if(typeof(rating)=='undefined'){
                rating=0;
            }
            var comment = req.body.comment;
            var query = null;
            var parameters = [];
            var cid = null;
            var hotelId=req.params.hotelId;
            var roomNo = req.params.roomNo;
            //get the cid of the username
            var getCID = "select c.cid from Customer c where c.username=?";
            //GET CID
            connection.query(getCID,[req.params.username],function(err,rows){
                if(err){console.log(err)}
                else{
                    cid = rows[0].cid;
                    //check for type of review
                    if(reviewType=="Room Review"){
                        query = "insert into RoomReview(rate,Hotel_ID,comment,Room_no,cid) values(?,?,?,?,?)";

                        connection.query(query,[rating,hotelId,comment,roomNo,cid],function(err,rows){
                            if(err){console.log(err);}
                            else{
                                res.redirect('/profile/'+req.params.username+'/myroomreviews/reviews');
                            }
                        })
                    }else if(reviewType=="Service Review"){
                        query = "insert into ServiceReview(rate,comment,cid,sType,Hotel_ID) values(?,?,?,?,?)";
                        // get the type of service ordered by the current user
                        var serviceType = "select s.sType from Reservation r, ReservationServices s where r.cid=? and r.InvoiceNo=s.invoiceNo";
                        connection.query(serviceType,[cid],function(err,rows){
                            if(err){console.log(err)}
                            else{
                                var sType = rows[0].sType;
                                connection.query(query,[rating,comment,cid,sType,hotelId],function(err,rows){
                                    if(err){console.log(err)}
                                    else{
                                        res.redirect('/profile/'+req.params.username+'/myservicereviews/reviews');
                                    }
                                })
                            }
                        });
                    }else{
                        //review type is a Breakfast Review
                        query = "insert into BreakfastReview(rate,comment,cid,bType,Hotel_ID) values(?,?,?,?,?);"
                        //get the type of breakfast
                        var getTypeOfBreakfast = "select b.bType from Reservation r, ReservationBreakfast b where r.cid=? and r.InvoiceNo=b.invoiceNo;"
                        connection.query(getTypeOfBreakfast,[cid],function(err,rows){
                            if(err){console.log(err)}
                            else{
                                var bType = rows[0].bType;
                                connection.query(query,[rating,comment,cid,bType,hotelId],function(err,rows){
                                    if(err){console.log(err)}
                                    else{
                                        res.redirect('/profile/'+req.params.username+'/mybreakfastreviews/reviews');
                                    }
                                })
                            }
                        })
                    }
                }

            })
            console.log("post route hit");
        })
        app.get("/profile/:username/myroomreviews/reviews",function(req,res){
            //query the database for the cid of the user
            var getCID = "select c.cid from Customer c where c.username=?";
            connection.query(getCID,[req.params.username],function(err,rows){
                if(err){console.log(err)}
                else{
                    var cid = rows[0].cid;
                    //query the database for the reviews
                    var query = "select r.rate, r.comment, r.Room_no, h.imagePath, l.Street, l.City, l.State, l.Country, p.Phone from RoomReview r left join Customer c on c.cid=r.cid lefHotel h on r.Hotel_ID=h.Hotel_ID left join Location l on h.Hotel_ID=l.Hotel_ID  left join Phones p on p.Hotel_ID = l.Hotel_ID where r.cid=?;"
                    connection.query(query,[cid],function(err,rows){
                        if(err){console.log(err)}
                        else{
                            var reviews = rows;
                            res.render('myroomreviews',
                            {
                                originalUrl: "/profile/"+req.params.username,
                                myReservations: "/profile/"+req.params.username+"/myreservations",
                                myReviews: "/profile/"+req.params.username+"/myreviews",
                                hotelTitle: "My Room Reviews",
                                user: req.params.username,
                                searchRoute: "/profile/"+req.params.username+"/search",
                                myRoomReviews: "/profile/"+req.params.username+"/myroomreviews/reviews",
                                myBreakfastReviews: "/profile/"+req.params.username+"/mybreakfastreviews/reviews",
                                myServiceReviews: "/profile/"+req.params.username+"/myservicereviews/reviews",
                                reviews: reviews
                            })
                        }
                    })
                }
            })
        })
        app.get("/profile/:username/mybreakfastreviews/reviews",function(req,res){
            // res.render("mybreakfastreviews");
            var getCID = "select c.cid from Customer c where c.username=?";
            connection.query(getCID,[req.params.username],function(err,rows){
                if(err){console.log(err)}
                else{
                    var cid = rows[0].cid;
                    var query = "select r.rate, r.comment, r.bType, h.imagePath, l.Street, l.City, l.State, l.Country, p.Phone from BreakfastReview r join Customer c on c.cid=r.cid left join Hotel h on r.Hotel_ID=h.Hotel_ID left join Location l on h.Hotel_ID=l.Hotel_ID  left join Phones p on p.Hotel_ID = l.Hotel_ID where r.cid=?";
                    connection.query(query,[cid],function(err,rows){
                        if(err){console.log(err)}
                        else{
                            var reviews = rows;
                            res.render('mybreakfastreviews',
                            {
                                originalUrl: "/profile/"+req.params.username,
                                myReservations: "/profile/"+req.params.username+"/myreservations",
                                myReviews: "/profile/"+req.params.username+"/myreviews",
                                hotelTitle: "My Room Reviews",
                                user: req.params.username,
                                searchRoute: "/profile/"+req.params.username+"/search",
                                myRoomReviews: "/profile/"+req.params.username+"/myroomreviews/reviews",
                                myBreakfastReviews: "/profile/"+req.params.username+"/mybreakfastreviews/reviews",
                                myServiceReviews: "/profile/"+req.params.username+"/myservicereviews/reviews",
                                reviews: reviews
                            })
                        }
                    })
                }
            });
            console.log("get route hit")
        })
        app.get("/profile/:username/myservicereviews/reviews",function(req,res){
            // res.render("myservicereviews");
            var getCID = "select c.cid from Customer c where c.username=?";
            connection.query(getCID,[req.params.username],function(err,rows){
                if(err){console.log(err)}
                else{
                    var cid = rows[0].cid;
                    var query = "select r.rate, r.comment, r.sType, h.imagePath, l.Street, l.City, l.State, l.Country, p.Phone from ServiceReview r join Customer c on c.cid=r.cid left join Hotel h on r.Hotel_ID=h.Hotel_ID left join Location l on h.Hotel_ID=l.Hotel_ID  left join Phones p on p.Hotel_ID = l.Hotel_ID where r.cid=?;"
                    connection.query(query,[cid],function(err,rows){
                        if(err){console.log(err)}
                        else{
                            var reviews = rows;
                            res.render('myservicereviews',
                            {
                                originalUrl: "/profile/"+req.params.username,
                                myReservations: "/profile/"+req.params.username+"/myreservations",
                                myReviews: "/profile/"+req.params.username+"/myreviews",
                                hotelTitle: "My Room Reviews",
                                user: req.params.username,
                                searchRoute: "/profile/"+req.params.username+"/search",
                                myRoomReviews: "/profile/"+req.params.username+"/myroomreviews/reviews",
                                myBreakfastReviews: "/profile/"+req.params.username+"/mybreakfastreviews/reviews",
                                myServiceReviews: "/profile/"+req.params.username+"/myservicereviews/reviews",
                                reviews: reviews
                            })
                        }
                    })
                }
            });
        })


          //route for the reserve hotel page
        app.get("/profile/:username/:state/:hotelId/reserve",function(req,res){
            //query the database for the 
            var username = req.params.username
            console.log(req.params.hotelId)
            var query = "select h.Hotel_ID, h.imagePath, l.Street, l.City, l.State, l.Country, l.ZIP, p.Phone from Hotel h left join Location l on h.Hotel_ID=l.Hotel_ID left join Phones p on p.Hotel_ID = l.Hotel_ID where h.hotel_ID="+req.params.hotelId+";"
            connection.query(query,function(err,rows){
                if(err)
                {
                    console.log(err);
                }
                else{
                    var hotel = rows[0];
                    res.render('reserve',
                    {   
                        username: username,
                        hotel: hotel
                    }) 
                }
            })
        })
        app.post("/profile/:username/:state/:hotelId/reserve",function(req,res){
            //grab values inputted by the user
            var nameOnCard      = req.body.nameOnCard,
                cardNumber      = req.body.cardNumber,
                expirationMonth = req.body.expirationMonth,
                expirationYear  = req.body.expirationYear,
                securityCode    = req.body.securityCode,
                cardType        = req.body.ccRadio,
                roomType        = req.body.roomType,
                duration        = req.body.datefilter,
                breakfastType   = req.body.breakfastType,
                serviceType     = req.body.serviceType,
                billingAddress   = req.body.billingAddress;
            //grab the username and hotel Id from the url parameters
            var username = req.params.username;
            var hotelId = req.params.hotelId;
            
            //split the duration into start date and end date
            var startDate   = duration.split("/")[0].trim();
            var endDate     = duration.split("/")[1].trim();
            //determine number of days betweeen  date range
            var oneDay = 24*60*60*1000;
            var firstDate = new Date(startDate);
            var secondDate = new Date(endDate);
            var numberOfDays = (Math.round(Math.abs(firstDate.getTime()-secondDate.getTime())/(oneDay)));
            var totalPrice = 0;
            var customerID = 0;

            connection.query("select Room.price from Room where Room.Type=?;select Customer.cid from Customer where Customer.username=?;select Service.sCost from Service where Service.sType=?;select Breakfast.bprice from Breakfast where Breakfast.bType=?;",[roomType,req.params.username,serviceType,breakfastType],function(err,rows){
                if(err){console.log(err)}
                else{
                    var breakfastPrice = rows[3][0].bprice;
                    var servicePrice = rows[2][0].sCost;
                    totalPrice = (rows[0][0].price*numberOfDays)+breakfastPrice+servicePrice;
                    customerID = rows[1][0].cid;

                    var checkRooms = "select Room.Room_no, Room.Floor_no, Room.Capacity, Room.Type, Room.Description, Room.Price, Room.Hotel_ID, OfferRoom.Discount, OfferRoom.StartDate, OfferRoom.EndDate from Room left join OfferRoom on Room.Hotel_ID=OfferRoom.Hotel_ID and Room.Room_no=OfferRoom.Room_no where Room.Type=? and Room.Hotel_ID=?;"
                    connection.query(checkRooms,[roomType,req.params.hotelId],function(err,rows){
                        if(err){
                            console.log(err);
                            return;
                        }else if(rows.length==0){
                            //handle error here where there are no rooms left 
                            console.log("There are no rooms of that type for your selected hotel");
                        }else {
                            //there are rooms available so we check that the user's new reservation doesnt conflict with a reservation they have already made
                            var hotelRoom = rows[0];
                            
                            var checkConflictingReservation = ""
                            //insert reservation into db
                            var insertReservation = "insert into RoomReservation(Room_no,Hotel_ID,outDate,inDate,numDays) values(?,?,?,?,?);";
                            var variables = [hotelRoom.Room_no,req.params.hotelId,endDate,startDate,numberOfDays];
                            connection.query(insertReservation,variables,function(err,rows){
                                if(err){
                                    console.log(err);
                                }else{
                                    //rows is the returned inserted tuple
                                    var insertedReservation = rows[0];
                                    var rowInsertID = rows.insertId;
                                    //check if the user added a breakfast service
                                    if(breakfastType!="None"&&serviceType!="None"){
                                        var breakfastQuery = "insert into ReservationBreakfast values(?,?,?)";
                                        connection.query(breakfastQuery,[req.params.hotelId, rowInsertID, breakfastType],function(err,rows){
                                            if(err){
                                                console.log(err);
                                            }else{
                                                console.log("breakfast reservation inserted");
                                                var serviceQuery = "insert into ReservationServices values(?,?,?);"
                                                connection.query(serviceQuery,[rowInsertID,req.params.hotelId,serviceType],function(err,rows){
                                                    if(err){
                                                        console.log(err);
                                                    }else{
                                                        console.log("service reservation inserted");
                                                        var creditCardQuery = "select * from Credit_Card c where c.Cnumber=? and c.ExpMonth=? and c.ExpYear=? and c.Name=? and c.BillingAddr=? and c.SecCode=? and c.Type=?;";
                                                        connection.query(creditCardQuery,[cardNumber,expirationMonth,expirationYear,nameOnCard,billingAddress,securityCode,cardType],function(err,rows){
                                                            if(err){
                                                                console.log(err);
                                                            }else if(rows.length==0){
                                                                //add the credit card here
                                                                var insertCC="insert into Credit_Card values (?,?,?,?,?,?,?)";
                                                                connection.query(insertCC,[cardNumber,billingAddress,nameOnCard,securityCode,cardType,expirationMonth,expirationYear],function(err,rows){
                                                                    if(err){console.log(err)}
                                                                    else{
                                                                         var insertIntoReservationTable ="insert into Reservation values (?,?,?,?,?,?);"
                                                                        connection.query(insertIntoReservationTable,[rowInsertID,totalPrice,customerID,cardNumber,startDate,endDate],function(err,rows){
                                                                            if(err){
                                                                                console.log(err);
                                                                            }else{
                                                                                console.log("reservation table updated");
                                                                                addedReservation=true;
                                                                                res.redirect("/profile/"+req.params.username+"/myreservations");
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        })
                                    }else if(breakfastType!="None"){
                                        var breakfastQuery = "insert into ReservationBreakfast values(?,?,?)";
                                        connection.query(breakfastQuery,[req.params.hotelId, rowInsertID, breakfastType],function(err,rows){
                                            if(err){
                                                console.log(err);
                                            }else{
                                                var creditCardQuery = "select * from Credit_Card c where c.Cnumber=? and c.ExpMonth=? and c.ExpYear=? and c.Name=? and c.BillingAddr=? and c.SecCode=? and c.Type=?;";
                                                connection.query(creditCardQuery,[cardNumber,expirationMonth,expirationYear,nameOnCard,billingAddress,securityCode,cardType],function(err,rows){
                                                    if(err){
                                                        console.log(err);
                                                    }else if(rows.length==0){
                                                        //add the credit card here
                                                        var insertCC="insert into Credit_Card values (?,?,?,?,?,?,?)";
                                                        connection.query(insertCC,[cardNumber,billingAddress,nameOnCard,securityCode,cardType,expirationMonth,expirationYear],function(err,rows){
                                                            if(err){console.log(err)}
                                                            else{
                                                                 var insertIntoReservationTable ="insert into Reservation values (?,?,?,?,?,?);"
                                                                connection.query(insertIntoReservationTable,[rowInsertID,totalPrice,customerID,cardNumber,startDate,endDate],function(err,rows){
                                                                    if(err){
                                                                        console.log(err);
                                                                    }else{
                                                                        console.log("reservation table updated");
                                                                        addedReservation=true;
                                                                        res.redirect("/profile/"+req.params.username+"/myreservations");
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                });
                                            }
                                        });
                                    }else if(serviceType!="None"){
                                        var serviceQuery = "insert into ReservationServices values(?,?,?);"
                                        connection.query(serviceQuery,[rowInsertID,req.params.hotelId,serviceType],function(err,rows){
                                            if(err){
                                                console.log(err);
                                            }else{
                                                console.log("service reservation inserted");
                                                var creditCardQuery = "select * from Credit_Card c where c.Cnumber=? and c.ExpMonth=? and c.ExpYear=? and c.Name=? and c.BillingAddr=? and c.SecCode=? and c.Type=?;";
                                                connection.query(creditCardQuery,[cardNumber,expirationMonth,expirationYear,nameOnCard,billingAddress,securityCode,cardType],function(err,rows){
                                                    if(err){
                                                        console.log(err);
                                                    }else if(rows.length==0){
                                                        //add the credit card here
                                                        var insertCC="insert into Credit_Card values (?,?,?,?,?,?,?)";
                                                        connection.query(insertCC,[cardNumber,billingAddress,nameOnCard,securityCode,cardType,expirationMonth,expirationYear],function(err,rows){
                                                            if(err){console.log(err)}
                                                            else{
                                                                 var insertIntoReservationTable ="insert into Reservation values (?,?,?,?,?,?);"
                                                                connection.query(insertIntoReservationTable,[rowInsertID,totalPrice,customerID,cardNumber,startDate,endDate],function(err,rows){
                                                                    if(err){
                                                                        console.log(err);
                                                                    }else{
                                                                        console.log("reservation table updated");
                                                                        addedReservation=true;
                                                                        res.redirect("/profile/"+req.params.username+"/myreservations");
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                });
                                            }
                                        })
                                    }
                                }
                            })
                            
                        }
                    })
                }
            })
        })
        //route for the post of the search term for the states
        app.post("/profile/:username/search",function(req,res){
            res.redirect("/profile/"+req.params.username+"/"+req.body.state);
        })
        
        // =====================================
        // LOGOUT ==============================
        // =====================================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
    };
    
    // route middleware to make sure
    function isLoggedIn(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()){
            console.log("isloggedin")
            return next();  
        }else{
            console.log("not authneitcated")
            res.redirect('/')  
        }
    }
    