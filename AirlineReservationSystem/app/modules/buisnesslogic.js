//Database configuration
	var mysql = require('mysql');
	var pool  = mysql.createPool({
	  connectionLimit : 10,
	  multipleStatements: true,
	  host            : 'localhost',
	  user            : 'root',
	  password        : 'password',
	  database        : 'ardb3'
	});

//Encrytion Configuration
	var simplecrypt = require("simplecrypt");
	var opt = {password:"password",salt:"salt"}; 
	var sc = simplecrypt(opt);

//Buissness Logic

	//Get all Users
	exports.getAllUser = (callback) => getAllUser(callback);

	function getAllUser(callback) {
		try
	    {	        
	        pool.getConnection(function(err, connection) {		 		
			  	var query = connection.query( 'SELECT * FROM users', function(err, result) {
				    connection.release();
				    console.log(query.sql);
				    if(err)
				    {
				    	callback('error');
				    	return;
				    }
				    callback(result);
			 	});
			});
		}
		catch(err)
		{
			console.log(err);
		}
	}

	//Check Email
	exports.checkEmail = (email,callback) => checkEmail(email,callback);

	function checkEmail(email,callback) {
		try
	        {
		        pool.getConnection(function(err, connection) {
		 		// Use the connection
				  	var query = connection.query( 'SELECT * FROM users  WHERE email = ? ', email, function(err, result) {
				    	connection.release();
					    console.log(query.sql);
					    if(err)
					    {
					    	callback('error');
					    	return;
					    }

					    if(result.length>0)
					    {
					    	callback({ isValid: false }); 
					    }
					    else
					    {
					    	callback({ isValid: true });
					    }
				 	});
				});
		    }
		    catch(err)
		    {
		    	console.log(err);
		    }       
	}

	//Register User
	exports.registerUser = (user,callback) => registerUser(user,callback);

	function registerUser(user, callback) {
		try
	        {	        
		        var unencryptedPassword = user.password;    
		        user.password = sc.encrypt(unencryptedPassword);
		        console.log(user);

		        checkEmail(user.email, function(returnValue) {
					if(returnValue=='error')
					{
						callback(returnValue);
						return;
					}
					else if(!returnValue.isValid)
					{
						callback('error : Username Already Exists');
						return;
					}
					else if(returnValue.isValid)
					{
						pool.getConnection(function(err, connection) {
					 		// Create user in data base
						  	var insertUserQuery = connection.query( 'INSERT INTO users SET ?', user,  function(err, result) {
						    
						    console.log(insertUserQuery.sql);
						    if(err)
						    {	
						    	console.log(err);
						    	callback('error');
						    	return;
						    }

						    //Email for Registration
						    var body =  '<b>Hello '+ user.first_name + ' ' + user.middle_name + ' ' + user.last_name + '</b>' +
						    			'</br><p>      You have been Successfully registered to our database.</p>' +
						    			'<p>Your user name is your email : '+ user.email + '</p>' +
						    			'<p>and your password is : '+ unencryptedPassword + '</p>'+
						    			'</br></br></br></br>'+
						    			'<p>Regards</p>'+ 
						    			'<p>Team ARS 🐴</p>';
						    var head = 'ARS (Airline Reservation) Registration success.';
						    var mail = require('../modules/mail.js');
							mail.prepareSendEmail(body,head, user.email);

					 		});

					 		var selectUserQuery = connection.query( 'SELECT user_id FROM users WHERE email = ?', user.email,  function(err, result) {
							    connection.release();
							    console.log(selectUserQuery.sql);
							    if(err)
							    {	
							    	console.log(err);
							    	callback('error');
							    	return;
							    }
							    callback(result);
							});
						});
					}
				});		       

		        
		    }
		    catch(err)
		    {
		    	console.log(err);
		    }
	}

	//Edit User
	exports.editUser = (user,callback) => editUser(user,callback);

	function editUser(user,callback) {
		try
	        {
		        var user_id = user.user_id;
		        delete user["user_id"];
		        delete user["email"];
		        var unencryptedPassword = user.password;
		        user.password = sc.encrypt(unencryptedPassword);
		        console.log(user);

		        pool.getConnection(function(err, connection) {
			 		// Use the connection
				  	var query = connection.query( 'Update users SET ?  WHERE user_id = ? ', [user, user_id],  function(err, result) {
					    connection.release();
					    console.log(query.sql);
					    if(err)
					    {	
					    	console.log(err);
					    	callback('error');
					    	return;
					    }
					    callback(result);
				 	});
				});
		    }
		    catch(err)
		    {
		    	console.log(err);
		    }
	}

	//View User
	exports.viewUser = (userid,callback) => viewUser(userid,callback);

	function viewUser(userid,callback) {
		try
	        {
		        pool.getConnection(function(err, connection) {
			 		// Use the connection
					var query = connection.query( 'SELECT * FROM users  WHERE user_id = ? ', userid, function(err, result) {
					    connection.release();
					    console.log(query.sql);
					    if(err)
					    {
					    	callback('error');
					    	return;
					    }
					    var user = result[0];
					    user.password = sc.decrypt(user.password);
					    callback(user);
				 	});
				});
		    }
		    catch(err)
		    {
		    	console.log(err);
		    }
	}

	//Login
	exports.login = (user,callback) => login(user,callback);

	function login(user, callback) {
		try
	    {
	        pool.getConnection(function(err, connection) {
		 		// Use the connection
				var query = connection.query( 'SELECT * FROM users  WHERE email = ? AND password = ?', [user.email,sc.encrypt(user.password)], function(err, result) {
				    connection.release();
				    console.log(query.sql);
				    if(err)
				    {
				    	callback('error');
				    	return;
				    }
				    if(result.length>0)
				    {
				    	callback({ message: 'Login Sucessful!', first_name: result[0].first_name,user_id: result[0].user_id});   
				    }
				    else
				    {
				    	callback({ message: 'invalid Credential' });   
				    }
			 	});
			});
	    }
	    catch(err)
	    {
	    	console.log(err);
	    }
	}

	//Flight Search
	exports.searchFlight = (searchDetails, callback) => searchFlight(searchDetails, callback);

	function searchFlight(searchDetails, callback) {
		try
	    {
	        pool.getConnection(function(err, connection) {
		 		// Use the connection
			  	
			  	var returnResult = {};
			  	var classType = 'eco_cls_fare';
			  	var seatClassType = 'eco_cls_avlb';
			  	if(searchDetails.seatClass=='b'){
			  		classType = 'bus_cls_fare';
			  		seatClassType = 'bus_cls_avlb';
			  	}
			  	else if (searchDetails.seatClass=='pe') {
			  		classType = 'prem_eco_fare';
			  		seatClassType = 'prem_eco_avlb';
			  	}
			  	else{
			  		classType = 'eco_cls_fare';
			  		seatClassType = 'eco_cls_avlb';
			  	}
			  	var seatCount = parseInt(searchDetails.seatCount);
			  	var origin_airport = searchDetails.origin_airport;//'JFK';
			  	var destination_airport = searchDetails.destination_airport;//'BOM';
			  	var depart_timestamp = searchDetails.depart_timestamp;//'2016-12-25';	
			  	var query1 = connection.query( `SELECT 
					    t1.origin_airport,
                        (select city_name from airports where iata_code = t1.origin_airport) as origin_airport_city,
                        (select airport_name from airports where iata_code = t1.origin_airport) as origin_airport_name,
                        t2.destination_airport,
                        (select city_name from airports where iata_code = t2.destination_airport) as destination_airport_city,
                        (select airport_name from airports where iata_code = t2.destination_airport) as destination_airport_name,
                        DATE_FORMAT(t1.depart_timestamp,'%Y-%m-%d') as depart_date,
                        DATE_FORMAT(t1.depart_timestamp,'%H:%i:%s') as depart_time,
                        t1.depart_timestamp,
                        DATE_FORMAT(t2.arrive_timestamp,'%Y-%m-%d') as arrive_date,
                        DATE_FORMAT(t2.arrive_timestamp,'%H:%i:%s') as arrive_time,
                        t2.arrive_timestamp,
                        t1.destination_airport AS stop_airport,
                        (select city_name from airports where iata_code = t1.destination_airport) as stop_airport_city,
                        (select airport_name from airports where iata_code = t1.destination_airport) as stop_airport_name,
                        DATE_FORMAT(t1.arrive_timestamp,'%Y-%m-%d') as stop_airport_arrival_date,
                        DATE_FORMAT(t1.arrive_timestamp,'%H:%i:%s') as stop_airport_arrival_time,
                        t1.arrive_timestamp AS stop_airport_arrival,
						DATE_FORMAT(t2.depart_timestamp,'%Y-%m-%d') as stop_airport_departure_date,
						DATE_FORMAT(t2.depart_timestamp,'%H:%i:%s') as stop_airport_departure_time,
					    t2.depart_timestamp AS stop_airport_departure,
					    t1.aircraft_name AS source_to_stop,
					    t1.flight_id AS flight_id1,
					    t2.aircraft_name AS stop_to_destination,
					    t2.flight_id AS flight_id2,
					    SEC_TO_TIME(TIMESTAMPDIFF(SECOND,
					                t1.arrive_timestamp,
					                t2.depart_timestamp)) AS layover,
		                SEC_TO_TIME(TIMESTAMPDIFF(SECOND,
                                    t1.depart_timestamp,
                                    t2.arrive_timestamp)) AS duration,
					    (t1.`+classType+` * t1.distance_miles) + (t2.`+classType+` * t2.distance_miles) AS Total_fare,
					    '' AS flight_id,
					    '' AS aircraft_name,
                        SEC_TO_TIME(TIMESTAMPDIFF(SECOND,
                        t1.depart_timestamp,
                        t1.arrive_timestamp)) AS flight_1_duration,
                        SEC_TO_TIME(TIMESTAMPDIFF(SECOND,
                        t2.depart_timestamp,
                        t2.arrive_timestamp)) AS flight_2_duration
					FROM
					    (SELECT 
					        r.origin_airport,
					            r.destination_airport,
					            f.depart_timestamp,
					            f.arrive_timestamp,
					            a.aircraft_name,
					            f.flight_id,
					            f.`+classType+`,
					            r.distance_miles
					    FROM
					        routes r
					    JOIN flights f
					    JOIN aircraft a ON r.route_id = f.route_id
					        AND r.aircraft_id = a.aircraft_id
					    WHERE
					        origin_airport = ?
					            AND DATE(f.depart_timestamp) = ? AND f.`+seatClassType+` >= ?) t1,
					    (SELECT 
					        r.destination_airport,
					            r.origin_airport,
					            f.arrive_timestamp,
					            f.depart_timestamp,
					            a.aircraft_name,
					            f.flight_id,
					            f.`+classType+`,
					            r.distance_miles
					    FROM
					        routes r
					    JOIN flights f
					    JOIN aircraft a ON r.route_id = f.route_id
					        AND r.aircraft_id = a.aircraft_id
					        AND destination_airport = ? AND f.`+seatClassType+` >= ?) t2
					WHERE
					    t2.origin_airport = t1.destination_airport
					        AND t2.depart_timestamp > t1.arrive_timestamp
					        AND (DATE(t2.depart_timestamp) = ?
					        OR DATE(t2.depart_timestamp) = DATE_ADD(?, INTERVAL 1 DAY))
					union all
					SELECT 
					    origin_airport,
                        (select city_name from airports where iata_code = origin_airport) as origin_airport_city,
                        (select airport_name from airports where iata_code = origin_airport) as origin_airport_name,
                        destination_airport,
                        (select city_name from airports where iata_code = destination_airport) as destination_airport_city,
                        (select airport_name from airports where iata_code = destination_airport) as destination_airport_name,
                        DATE_FORMAT(depart_timestamp,'%Y-%m-%d') as depart_date,
                        DATE_FORMAT(depart_timestamp,'%H:%i:%s') as depart_time,
                        depart_timestamp,
                        DATE_FORMAT(arrive_timestamp,'%Y-%m-%d') as arrive_date,
                        DATE_FORMAT(arrive_timestamp,'%H:%i:%s') as arrive_time,
                        arrive_timestamp,
                        '' AS stop_airport,
                        '' AS stop_airport_city,
                        '' AS stop_airport_name,
					    '' AS stop_airport_arrival_date,
                        '' AS stop_airport_arrival_time,
                        '' AS stop_airport_arrival,
                        '' AS stop_airport_departure_date,
                        '' AS stop_airport_departure_time,
					    '' AS stop_airport_departure,
					    '' as source_to_stop,
					    '' as flight_id1,
					    '' as stop_to_destination,
					    '' as flight_id2,
					    '' as layover,
					    SEC_TO_TIME(TIMESTAMPDIFF(SECOND,
                                    depart_timestamp,
                                    arrive_timestamp)) AS duration,
					    `+classType+` * distance_miles AS Total_fare,
					    flight_id,
					    aircraft_name,
                        '' as flight_1_duration,
                        '' as flight_2_duration
					FROM
					    routes r
					        JOIN
					    flights f
					        JOIN
					    aircraft a ON r.route_id = f.route_id
					        AND r.aircraft_id = a.aircraft_id
					WHERE
					    origin_airport = ?
					        AND destination_airport = ?
					        AND DATE(depart_timestamp) = ?  AND f.`+seatClassType+` >= ?;
					 `,[origin_airport,depart_timestamp,seatCount,destination_airport,seatCount,depart_timestamp,depart_timestamp,origin_airport,destination_airport,depart_timestamp,seatCount], function(err, result) {
				    //connection.release();
				    console.log(query1.sql);
				    if(err)
				    {
				    	callback('error');
				    	return;
				    }
				    returnResult.oneWay=result; //callback(result);

				    if(searchDetails.isBothway)
			 		{
				 		var return_origin_airport = searchDetails.destination_airport;//'BOM';
				  		var return_destination_airport = searchDetails.origin_airport;//'JFK';
				  		var return_depart_timestamp = searchDetails.return_depart_timestamp;//'2016-12-29'
				 		var query2 = connection.query( `SELECT 
						    t1.origin_airport,
                            (select city_name from airports where iata_code = t1.origin_airport) as origin_airport_city,
                            (select airport_name from airports where iata_code = t1.origin_airport) as origin_airport_name,
                            t2.destination_airport,
                            (select city_name from airports where iata_code = t2.destination_airport) as destination_airport_city,
                            (select airport_name from airports where iata_code = t2.destination_airport) as destination_airport_name,
                            DATE_FORMAT(t1.depart_timestamp,'%Y-%m-%d') as depart_date,
                            DATE_FORMAT(t1.depart_timestamp,'%H:%i:%s') as depart_time,
                            t1.depart_timestamp,
                            DATE_FORMAT(t2.arrive_timestamp,'%Y-%m-%d') as arrive_date,
                            DATE_FORMAT(t2.arrive_timestamp,'%H:%i:%s') as arrive_time,
                            t2.arrive_timestamp,
                            t1.destination_airport AS stop_airport,
                            (select city_name from airports where iata_code = t1.destination_airport) as stop_airport_city,
                            (select airport_name from airports where iata_code = t1.destination_airport) as stop_airport_name,
                            DATE_FORMAT(t1.arrive_timestamp,'%Y-%m-%d') as stop_airport_arrival_date,
                            DATE_FORMAT(t1.arrive_timestamp,'%H:%i:%s') as stop_airport_arrival_time,
                            t1.arrive_timestamp AS stop_airport_arrival,
							DATE_FORMAT(t2.depart_timestamp,'%Y-%m-%d') as stop_airport_departure_date,
							DATE_FORMAT(t2.depart_timestamp,'%H:%i:%s') as stop_airport_departure_time,
						    t2.depart_timestamp AS stop_airport_departure,
						    t1.aircraft_name AS source_to_stop,
						    t1.flight_id AS flight_id1,
						    t2.aircraft_name AS stop_to_destination,
						    t2.flight_id AS flight_id2,
						    SEC_TO_TIME(TIMESTAMPDIFF(SECOND,
						                t1.arrive_timestamp,
						                t2.depart_timestamp)) AS layover,
			                SEC_TO_TIME(TIMESTAMPDIFF(SECOND,
                                        t1.depart_timestamp,
                                        t2.arrive_timestamp)) AS duration,
						    (t1.`+classType+` * t1.distance_miles) + (t2.`+classType+` * t2.distance_miles) AS Total_fare,
						    '' AS flight_id,
						    '' AS aircraft_name,
	                        SEC_TO_TIME(TIMESTAMPDIFF(SECOND,
	                        t1.depart_timestamp,
	                        t1.arrive_timestamp)) AS flight_1_duration,
	                        SEC_TO_TIME(TIMESTAMPDIFF(SECOND,
	                        t2.depart_timestamp,
	                        t2.arrive_timestamp)) AS flight_2_duration
						FROM
						    (SELECT 
						        r.origin_airport,
						            r.destination_airport,
						            f.depart_timestamp,
						            f.arrive_timestamp,
						            a.aircraft_name,
						            f.flight_id,
						            f.`+classType+`,
						            r.distance_miles
						    FROM
						        routes r
						    JOIN flights f
						    JOIN aircraft a ON r.route_id = f.route_id
						        AND r.aircraft_id = a.aircraft_id
						    WHERE
						        origin_airport = ?
						            AND DATE(f.depart_timestamp) = ? AND f.`+seatClassType+` >= ?) t1,
						    (SELECT 
						        r.destination_airport,
						            r.origin_airport,
						            f.arrive_timestamp,
						            f.depart_timestamp,
						            a.aircraft_name,
						            f.flight_id,
						            f.`+classType+`,
						            r.distance_miles
						    FROM
						        routes r
						    JOIN flights f
						    JOIN aircraft a ON r.route_id = f.route_id
						        AND r.aircraft_id = a.aircraft_id
						        AND destination_airport = ? AND f.`+seatClassType+` >= ?) t2
						WHERE
						    t2.origin_airport = t1.destination_airport
						        AND t2.depart_timestamp > t1.arrive_timestamp
						        AND (DATE(t2.depart_timestamp) = ?
						        OR DATE(t2.depart_timestamp) = DATE_ADD(?, INTERVAL 1 DAY))
					union all
					SELECT 
					   origin_airport,
	                    (select city_name from airports where iata_code = origin_airport) as origin_airport_city,
	                    (select airport_name from airports where iata_code = origin_airport) as origin_airport_name,
	                    destination_airport,
	                    (select city_name from airports where iata_code = destination_airport) as destination_airport_city,
	                    (select airport_name from airports where iata_code = destination_airport) as destination_airport_name,
	                    DATE_FORMAT(depart_timestamp,'%Y-%m-%d') as depart_date,
	                    DATE_FORMAT(depart_timestamp,'%H:%i:%s') as depart_time,
	                    depart_timestamp,
	                    DATE_FORMAT(arrive_timestamp,'%Y-%m-%d') as arrive_date,
	                    DATE_FORMAT(arrive_timestamp,'%H:%i:%s') as arrive_time,
	                    arrive_timestamp,
	                    '' AS stop_airport,
	                    '' AS stop_airport_city,
	                    '' AS stop_airport_name,
					    '' AS stop_airport_arrival_date,
                        '' AS stop_airport_arrival_time,
                        '' AS stop_airport_arrival,
                        '' AS stop_airport_departure_date,
                        '' AS stop_airport_departure_time,
					    '' AS stop_airport_departure,
					    '' as source_to_stop,
					    '' as flight_id1,
					    '' as stop_to_destination,
					    '' as flight_id2,
					    '' as layover,
					    SEC_TO_TIME(TIMESTAMPDIFF(SECOND,
                                    depart_timestamp,
                                    arrive_timestamp)) AS duration,
					    `+classType+` * distance_miles AS Total_fare,
					    flight_id,
					    aircraft_name,
                        '' as flight_1_duration,
                        '' as flight_2_duration
					FROM
					    routes r
					        JOIN
					    flights f
					        JOIN
					    aircraft a ON r.route_id = f.route_id
					        AND r.aircraft_id = a.aircraft_id
					WHERE
					    origin_airport = ?
					        AND destination_airport = ?
					        AND DATE(depart_timestamp) = ? AND f.`+seatClassType+` >= ?;
						 `,[return_origin_airport,return_depart_timestamp,seatCount,return_destination_airport,seatCount,return_depart_timestamp,return_depart_timestamp,return_origin_airport,return_destination_airport,return_depart_timestamp,seatCount], function(err, result1) {
						    //connection.release();
						    console.log(query2.sql);
						    if(err)
						    {
						    	callback('error');
						    	return;
						    }
						    //console.log(JSON.stringify(result));
						    returnResult.returnWay=result1;//callback(result);		
						    //console.log(returnResult);	

						    connection.release();
						 	console.log(returnResult);
						 	callback(returnResult);	


					 	});
			 		}

			 		if(!searchDetails.isBothway){
					 	connection.release();
					 	console.log(returnResult);
					 	callback(returnResult);
				 	}

			 	});

			 	
			});
	    }
	    catch(err)
	    {
	    	console.log(err);
	    }
	}

	//Airport Search
	exports.searchAirport = (airport_key, callback) => searchAirport(airport_key, callback);

	function searchAirport(airport_key, callback) {
		try
	    {
	        pool.getConnection(function(err, connection) {
		 		// Use the connection
			  	var query = connection.query( 'SELECT ', airport_key, function(err, result) {
				    connection.release();
				    console.log(query.sql);
				    if(err)
				    {
				    	callback('error');
				    	return;
				    }
				    res.json(result);
			 	});
			});
	    }
	    catch(err)
	    {
	    	console.log(err);
	    }
	}

	//Flight Book
	exports.bookFlight = (bookDetails, callback) => bookFlight(bookDetails, callback);

	function bookFlight(bookDetails, callback) {
		try
	    {
	        pool.getConnection(function(err, connection) {
		 		// Use the connection
			  	var user_Id = bookDetails.user_Id;
			  	var passengerCount = bookDetails.passengerDetails.length;
			  	var class_id = 2;
			  	var seatClassType = 'eco_cls_avlb';
			  	var seatFareType = 'eco_cls_fare';
			  	if(bookDetails.seatClass=='b'){
			  		seatClassType = 'bus_cls_avlb';
			  		seatFareType = 'bus_cls_fare';
			  		class_id = 1;
			  	}
			  	else if (bookDetails.seatClass=='pe') {
			  		seatClassType = 'prem_eco_avlb';
			  		seatFareType = 'prem_eco_fare';
			  		class_id = 3;
			  	}
			  	else{
			  		seatClassType = 'eco_cls_avlb';
			  		seatFareType = 'eco_cls_fare';
			  		class_id = 2;
			  	}

			  	var seatCheckString = "";
			  	var flightIdListString = "";
			  	var loopedQuery = ``;

			  	for (var j =0; j<bookDetails.flightList.length; j++) {
			  	
			  		var flightDetail = bookDetails.flightList[j];

			  		if(j==0){
			  			flightIdListString = flightIdListString + flightDetail.flightId;
			  		}
			  		else
			  		{
			  			flightIdListString = flightIdListString + "," + flightDetail.flightId;
			  		}

	                var loopedQueryStructure = `
						insert into ticket(booking_id,flight_id,class_id,first_name,middle_name,last_name,age,gender,email,phone_primary)
						values(@bookingID,`+flightDetail.flightId+`,`+class_id+`,'@1','@2','@3',@4,'@5','@6',@7);
						UPDATE seats 
						SET 
						    seat_status = 2,
						    ticket_id = last_insert_id()
						WHERE
						    flight_id = `+flightDetail.flightId+` AND seat_number = '#3';
						UPDATE flights 
						SET 
						    `+seatClassType+` = `+seatClassType+` - 1
						WHERE
						    flight_id = `+flightDetail.flightId+`;

						    `;

					

					var seatListString = '';



				  	for (var i = 0, len = bookDetails.passengerDetails.length; i < len; i++) {
					  var passengerDetail = bookDetails.passengerDetails[i];
					  loopedQuery = loopedQuery + loopedQueryStructure.replace(/#1/,user_Id)
					  .replace(/#2/,flightDetail.flightId)
					  .replace(/#3/,flightDetail.seatList[i])
					  .replace(/@1/,passengerDetail.first_name)
					  .replace(/@2/,passengerDetail.middle_name)
					  .replace(/@3/,passengerDetail.last_name)
					  .replace(/@4/,passengerDetail.age)
					  .replace(/@5/,passengerDetail.gender)
					  .replace(/@6/,passengerDetail.email)
					  .replace(/@7/,passengerDetail.phone_primary);

					  if(i==len-1)
					  {
					  	seatListString = seatListString + "'" + flightDetail.seatList[i] + "'";
					  }
					  else
					  {
					  	seatListString = seatListString + "'" + flightDetail.seatList[i] + "',";
					  }
					}

					var seatCheckStringsubString = "(flight_id = "+flightDetail.flightId+" AND seat_number IN ("+seatListString+"))";

					if(j==0)
					{
						seatCheckString = seatCheckString + seatCheckStringsubString;
					}
					else
					{
						seatCheckString = seatCheckString + " OR " + seatCheckStringsubString;
					}
				}

				var seatCheckQuery = connection.query( `SELECT count(*) as count from seats where (`+seatCheckString+`) and seat_status=2 `, function(err, result) {
				    //connection.release();
				    console.log(seatCheckQuery.sql);
				    if(err)
				    {
				    	callback('error');
				    	return;
				    }
				    if(parseInt(result[0].count)>0)
				    {
				    	connection.release();
				    	callback({message:'Invalid Seats'});
				    	
				    }
				    else
				    {
				    	
				    	console.log(loopedQuery);
				    	console.log("### - >"+flightIdListString);
				    	//run transaction
				    	var transactionQuery = connection.query( `start transaction;
							SELECT 
							    *
							FROM
							    seats
							WHERE
							    `+seatCheckString+`
							FOR UPDATE;
							insert into booking(user_id,origin_airport,destination_airport,journey_date,
												return_journey_date,class_id,return_flag,No_of_tickets,total_price)
												 values (?,?,?,?,?,?,?,?,
												 (select sum(distance_miles*`+seatFareType+`) * `+passengerCount+` 
												  from flights,routes
												   where flights.route_id = routes.route_id
												    and flight_id in (`+flightIdListString+`))
												 );
							SET @bookingID = last_insert_id();
							`+loopedQuery+`
							commit;
					  	 `,[bookDetails.user_Id, bookDetails.origin_airport, bookDetails.destination_airport, bookDetails.journey_date,
					  	 (bookDetails.return_journey_date=="" ? "0000-00-00" : bookDetails.return_journey_date), class_id, bookDetails.return_flag, passengerCount]
					  	 , function(err, result1) {
						    //connection.release();
						    console.log(transactionQuery.sql);
						    if(err)
						    {
						    	callback(err);
						    	return;
						    }
						    

						    //send email
						    var emailQuery = connection.query(`SELECT 
							    ticket.ticket_id,
							    ticket.first_name,
							    ticket.last_name,
							    ticket.middle_name,
							    ticket.email,
							    users.first_name AS user_first_name,
							    users.last_name AS user_last_name,
							    users.middle_name AS user_middle_name,
							    users.email AS user_email,
							    booking.booking_id
							FROM
							    ticket,
							    booking,
							    users
							WHERE
							    ticket.booking_id = booking.booking_id
							        AND booking.user_id = users.user_id
							        AND ticket.booking_id = (SELECT 
							            booking_id
							        FROM
							            booking
							        WHERE
							            user_id = ?
							        ORDER BY booking_id DESC
							        LIMIT 1);`,bookDetails.user_Id,function(err,resultEmail){

							        	connection.release();
									    console.log(transactionQuery.sql);
									    if(err)
									    {
									    	callback(err);
									    	//return;
									    	console.log(err);
									    }

									    var user_email = resultEmail[0].user_email;
									    var user_first_name = resultEmail[0].user_first_name;
									    var user_last_name = resultEmail[0].user_last_name;
									    var user_middle_name = resultEmail[0].user_middle_name;
									    var booking_id = resultEmail[0].booking_id;
									    var ticketIdList = '';
									    

										for (var i = 0; i < resultEmail.length; i++) {
											var email = resultEmail[i].email;
											var first_name = resultEmail[i].first_name;
											var last_name = resultEmail[i].last_name;
											var middle_name = resultEmail[i].middle_name;
											var ticketId = resultEmail[i].ticket_id;
											if(i==0)
											{
												ticketIdList = ticketIdList + ticketId;
											}
											else
											{
												ticketIdList = ticketIdList + ", " + ticketId;
											}

											var body =  '<b>Hello '+ first_name + ' ' + middle_name + ' ' + last_name + '</b>' +
							    			'</br><p>     '+ user_first_name + ' ' + user_middle_name + ' ' + user_last_name + ' has booked you tickets </p>' +
							    			'<p>Your ticket id : '+ ticketId + '</p>' +
							    			'<p> your source is : '+ bookDetails.origin_airport + '</p>'+
							    			'<p> your destination is : '+ bookDetails.destination_airport + '</p>'+
							    			'<p> your journey Date is : '+ bookDetails.journey_date + '</p>'+
							    			'<p> is round trip : '+ (bookDetails.return_flag>0 ? 'Yes':'No') + '</p>'+
							    			'</br></br></br></br>'+
							    			'<p>Regards</p>'+ 
							    			'<p>Team ARS 🐴</p>';
							    			console.log(body);
										    var head = 'ARS (Airline Reservation) Booked Ticket '+ticketId+' ';
										    var mail = require('../modules/mail.js');
											mail.prepareSendEmail(body,head, email);
										}

										 var body =  '<b>Hello '+ user_first_name + ' ' + user_middle_name + ' ' + user_last_name + '</b>' +
						    			'</br><p>      You have Successfully booked tickets.</p>' +
						    			'<p>Your booking Id : '+ booking_id + '</p>' +
						    			'<p>Your list of tickets : '+ ticketIdList + '</p>' +
						    			'<p> your source is : '+ bookDetails.origin_airport + '</p>'+
						    			'<p> your destination is : '+ bookDetails.destination_airport + '</p>'+
						    			'<p> your journey Date is : '+ bookDetails.journey_date + '</p>'+
						    			'<p> is round trip : '+ (bookDetails.return_flag>0 ? 'Yes':'No') + '</p>'+
						    			'</br></br></br></br>'+
						    			'<p>Regards</p>'+ 
						    			'<p>Team ARS 🐴</p>';
						    			console.log(body);
									    var head = 'ARS (Airline Reservation) Booking confirmation booking Id : '+booking_id+' ';
									    var mail = require('../modules/mail.js');
										mail.prepareSendEmail(body,head, user_email);


									    callback({message:booking_id});

						    });
						    //send email
						    
					 	});
				    }
			 	});

			  	
			});
	    }
	    catch(err)
	    {
	    	console.log(err);
	    }
	}

	//Flight Seat Status
	exports.statusFlightSeat = (flightId,seatClass, callback) => statusFlightSeat(flightId,seatClass, callback);

	function statusFlightSeat(flightId,seatClass, callback) {
		try
	    {
	        pool.getConnection(function(err, connection) {
		 		// Use the connection
			  	console.log(flightId);
			  	console.log(seatClass);
			  	var class_id=2;
			  	if(seatClass=='b'){
			  		class_id = 1;
			  	}
			  	else if (seatClass=='pe') {
			  		class_id = 3;
			  	}
			  	else{
			  		class_id = 2;
			  	}
			  	var query = connection.query( `SELECT flight_id,seat_number,seat_status from seats where flight_id =`+flightId+` and class_id = `+class_id+` `, function(err, result) {
				    connection.release();
				    console.log(query.sql);
				    if(err)
				    {
				    	callback('error');
				    	return;
				    }
				    callback(result);
			 	}); 
			});
	    }
	    catch(err)
	    {
	    	console.log(err);
	    }
	}

	//Flight Status
	exports.statusFlight = (ticketId, callback) => statusFlight(ticketId, callback);

	function statusFlight(ticketId, callback) {
		try
	    {
	        pool.getConnection(function(err, connection) {
		 		// Use the connection
			  	var query = connection.query( 'SELECT ', ticketId, function(err, result) {
				    connection.release();
				    console.log(query.sql);
				    if(err)
				    {
				    	callback('error');
				    	return;
				    }
				    callback(result);
			 	});
			});
	    }
	    catch(err)
	    {
	    	console.log(err);
	    }
	}

	//Booking Status
	exports.statusBooking = (bookingId, callback) => statusBooking(bookingId, callback);

	function statusBooking(bookingId, callback) {
		try
	    {
	        pool.getConnection(function(err, connection) {
		 		// Use the connection
			  	var query = connection.query( `SELECT 
				    b.booking_id,
				    t.ticket_id,
				    f.flight_id,
				    t.first_name,
				    t.last_name,
				    r.origin_airport,
				    date_format(f.depart_timestamp,'%Y-%m-%d') as depart_date,
    				date_format(f.depart_timestamp,'%H:%i:%s') as depart_time,
				    f.depart_timestamp,
				    r.destination_airport,
				    date_format(f.arrive_timestamp,'%Y-%m-%d') as arrive_date,
    				date_format(f.arrive_timestamp,'%H:%i:%s') as arrive_time,
				    f.arrive_timestamp,
				    a.class_name,
				    s.seat_number,
				    CASE
				        WHEN t.class_id = 1 THEN (f.bus_cls_fare * r.distance_miles)
				        WHEN t.class_id = 2 THEN (f.eco_cls_fare * r.distance_miles)
				        ELSE (f.prem_eco_fare * r.distance_miles)
				    END AS fare
				FROM
				    booking b
				        JOIN
				    ticket t
				        JOIN
				    flights f
				        JOIN
				    air_class a
				        JOIN
				    routes r
						JOIN 
				    seats s ON b.booking_id = t.booking_id
				        AND t.flight_id = f.flight_id
				        AND t.class_id = a.class_id
				        AND r.route_id = f.route_id
				        AND s.ticket_id = t.ticket_id
				WHERE
				    b.booking_id = ?;
					`, bookingId, function(err, result) {
				    connection.release();
				    console.log(query.sql);
				    if(err)
				    {
				    	callback('error');
				    	return;
				    }
				    callback(result);
			 	});
			});
	    }
	    catch(err)
	    {
	    	console.log(err);
	    }
	}

	//Edit Booking
	exports.editBookedFlight = (bookDetails, callback) => editBookedFlight(bookDetails, callback);

	function editBookedFlight(bookDetails, callback) {
		try
	    {
	        pool.getConnection(function(err, connection) {
		 		// Use the connection
			  	var query = connection.query( `update ticket set 
							first_name = ?, 
							middle_name = ?, 
							last_name = ?, 
							age = ?, 
							phone_primary = ?
							where ticket_id = ?`, [bookDetails.first_name, bookDetails.middle_name, bookDetails.last_name,bookDetails.age,bookDetails.phone_primary,bookDetails.ticketId], function(err, result) {
				    connection.release();
				    console.log(query.sql);
				    if(err)
				    {
				    	callback('error');
				    	return;
				    }
				    callback(result);
			 	});
			});
	    }
	    catch(err)
	    {
	    	console.log(err);
	    }
	}

	//Cancel Booking
	exports.cancelBooking = (bookingId, callback) => cancelBooking(bookingId, callback);

	function cancelBooking(bookingId, callback) {
		try
	    {
	        pool.getConnection(function(err, connection) {
		 		// Use the connection

		 		var getseatClassQuery = connection.query(`SELECT No_of_tickets as count, class_id, return_flag FROM booking where booking_id = ?`,bookingId,function(err,result){
		 			//connection.release();
				    console.log(getseatClassQuery.sql);
				    if(err)
				    {
				    	callback('error');
				    	return;
				    }
				    var class_id = parseInt(result[0].class_id);
				    var returnFlag = parseInt(result[0].return_flag);
				    var seatCount = parseInt(result[0].count);
				    if(returnFlag>0)
				    {
				    	seatCount = seatCount/2;
				    }

				    var seatClassType = 'eco_cls_avlb';
				  	if(class_id==1){
				  		seatClassType = 'bus_cls_avlb';
				  	}
				  	else if (class_id==3) 	{
				  		seatClassType = 'prem_eco_avlb';
				  	}
				  	else{
				  		seatClassType = 'eco_cls_avlb';
				  	}

				  	console.log(class_id);
				  	console.log(seatCount);
				  	console.log(seatClassType);

				  	var query = connection.query( `start transaction;
						update seats set seat_status = 1, ticket_id = 0 where ticket_id in (select ticket_id from ticket where booking_id = ? );						
						update flights
						set `+seatClassType+` = `+seatClassType+` + `+seatCount+`
						where flight_id in (SELECT flight_id from ticket where booking_id = ?);
						delete from ticket where booking_id = ?;
						delete from booking where booking_id = ?;
						Commit;`, [bookingId, bookingId, bookingId, bookingId], function(err, result) {
					    connection.release();
					    console.log(query.sql);
					    if(err)
					    {
					    	callback('error');
					    	return;
					    }
					    callback(result);
			 		});
		 		});

			  	
			});
	    }
	    catch(err)
	    {
	    	console.log(err);
	    }
	}

	//Cancel flight
	exports.cancelFlight = (ticketId, callback) => cancelFlight(ticketId, callback);

	function cancelFlight(ticketId, callback) {
		try
	    {
	        pool.getConnection(function(err, connection) {
		 		// Use the connection
			  	var getseatClassQuery = connection.query(`select class_id, flight_id  from ticket where ticket.ticket_id= ?`,ticketId,function(err,result){
		 			//connection.release();
				    console.log(getseatClassQuery.sql);
				    if(err)
				    {
				    	callback('error');
				    	return;
				    }
				    var class_id = parseInt(result[0].class_id);
				    var flight_Id = parseInt(result[0].flight_id);
				    var seatClassType = 'eco_cls_avlb';
				  	if(class_id==1){
				  		seatClassType = 'bus_cls_avlb';
				  	}
				  	else if (class_id==3) 	{
				  		seatClassType = 'prem_eco_avlb';
				  	}
				  	else{
				  		seatClassType = 'eco_cls_avlb';
				  	}

				  	console.log(class_id);
				  	console.log(seatClassType);

				  	var query = connection.query( `start transaction;
						update seats set seat_status = 1, ticket_id = 0 where ticket_id  = ? );
						delete from ticket where ticket_id = ?;
						update flights
						set `+seatClassType+` = `+seatClassType+` + 1
						where flight_id = ?;
						Commit;`, [ticketId, ticketId, flight_Id], function(err, result) {
					    connection.release();
					    console.log(query.sql);
					    if(err)
					    {
					    	callback('error');
					    	return;
					    }
					    callback(result);
			 		});
		 		});
			});
	    }
	    catch(err)
	    {
	    	console.log(err);
	    }
	}

	//List Booking
	exports.listBooking = (userid, callback) => listBooking(userid, callback);

	function listBooking(userid, callback) {
		try
	    {
	        pool.getConnection(function(err, connection) {
		 		// Use the connection
			  	var query = connection.query( `SELECT booking_id,user_id,origin_airport, DATE_FORMAT(journey_date,'%Y-%m-%d') AS journey_date, DATE_FORMAT(return_journey_date,'%Y-%m-%d') AS return_journey_date,class_id,return_flag,No_of_tickets,total_price, 

					 (select city_name from airports where iata_code= origin_airport) as origin_airport_name, origin_airport,
                                        (select city_name from airports where iata_code= destination_airport) as destination_airport_name, destination_airport,
										(select city_name from airports where iata_code= origin_airport) as origin_city,
                                        (select city_name from airports where iata_code= destination_airport) as destination_city
					FROM booking WHERE user_id =?`, userid, function(err, result) {
				    connection.release();
				    console.log(query.sql);
				    if(err)
				    {
				    	callback('error');
				    	return;
				    }
				    callback(result);
			 	});
			});
	    }
	    catch(err)
	    {
	    	console.log(err);
	    }
	}