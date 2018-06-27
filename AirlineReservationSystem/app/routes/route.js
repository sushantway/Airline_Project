//Set Up	
	var express = require('express');
	var router = express.Router();              

// middleware to use for all requests
	router.use(function(req, res, next) {
	    // do logging
	    res.header("Access-Control-Allow-Origin", "*");
  		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  		console.log(req.body);
  		console.log('Something is happening.');
	    next(); // make sure we go to the next routes and don't stop here
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
	    res.json({ message: 'hooray! welcome to our api!' });   
	});

// Routes
	var bal = require('../modules/buisnesslogic.js');

	//User

		//Get All Users
		router.route('/user')

		.get(function(req, res) {        		
			bal.getAllUser(function(returnValue) {
				res.json(returnValue);
			});

	    })
		
		//Check Email

		router.route('/user/checkemail/:email')

		.get(function(req, res) {        
		    bal.checkEmail(req.params.email, function(returnValue) {
				res.json(returnValue);
			});     
	    })


		//Register User

		router.route('/user/register')

		.post(function(req, res) {                
			bal.registerUser(req.body, function(returnValue) {
				res.json(returnValue);
			});         
	    })

		//Edit User

		router.route('/user/register/edit')

		.post(function(req, res) {
			bal.editUser(req.body, function(returnValue) {
				res.json(returnValue);
			});		       
	    })

		//View User

		router.route('/user/:user_id')

		.get(function(req, res) {
	        bal.viewUser(req.params.user_id, function(returnValue) {
				res.json(returnValue);
			});       
	    })

	 	//Login User

	 	router.route('/user/login')

		.post(function(req, res) {
			console.log("Login Route");
			bal.login(req.body, function(returnValue) {
				res.json(returnValue);
			});    
	    })

	//Booking

	    //Flight Search
	    
	    router.route('/flight/search')

		.post(function(req, res) {
			console.log("Flight Search Route");
		    bal.searchFlight(req.body, function(returnValue) {
				res.json(returnValue);
			});
	        
	    })

	    // Search flight Code

	    router.route('/search/airport/:airpot_key')

		.post(function(req, res) {
		    bal.searchAirport(req.params.airpot_key, function(returnValue) {
				res.json(returnValue);
			});      
	    })

		//book

		router.route('/flight/book')

		.post(function(req, res) {
	        bal.bookFlight(req.body, function(returnValue) {
				res.json(returnValue);
			});
	    })

		//check Status

		router.route('/flight/status/seats/:flight_id/:seatClass')

		.get(function(req, res) {
			bal.statusFlightSeat(req.params.flight_id,req.params.seatClass, function(returnValue) {
				res.json(returnValue);
			});
	    })

	    router.route('/flight/status/bookingid/:booking_id')

		.get(function(req, res) {
			bal.statusBooking(req.params.booking_id, function(returnValue) {
				res.json(returnValue);
			});
	    })

		router.route('/flight/status/flightid/:ticket_id')

		.get(function(req, res) {
			bal.statusFlight(req.params.ticket_id, function(returnValue) {
				res.json(returnValue);
			});
	    })


		//Edit Booking

		router.route('/flight/book/edit')

		.post(function(req, res) {
	        bal.editBookedFlight(req.body, function(returnValue) {
				res.json(returnValue);
			});
	    })



		//Cancel Booking

		router.route('/flight/book/cancel/:booking_id')

		.get(function(req, res) {
	        bal.cancelBooking(req.params.booking_id, function(returnValue) {
				res.json(returnValue);
			});
	    })

		//Cancel flight

		router.route('/flight/cancel/:ticket_id')

		.get(function(req, res) {
	        bal.cancelFlight(req.params.ticket_id, function(returnValue) {
				res.json(returnValue);
			});
	    })

		//Booking List

		router.route('/flight/book/list/:user_id')

		.get(function(req, res) {
	         bal.listBooking(req.params.user_id, function(returnValue) {
				res.json(returnValue);
			});
	    })

module.exports = router;