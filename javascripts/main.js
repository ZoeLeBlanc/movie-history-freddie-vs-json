"use strict";
//Set browersify requires
let searchMovie = require("./searchMovie");
let credentials = require("./credentials");

let firebaseMethods = require("./firebaseMethods");
let firebaseAuth = require("./firebaseAuth");
let firebaseUser = require("./firebaseUser");
//Set variables

let apiKeys = {};
let uid = "";


function createLogoutButton(){
	firebaseUser.getUser(apiKeys, uid).then(function(userResponse){
		$("#logout-container").html("");
		let currentUsername = userResponse.username;
		let logoutButton = `<button class="btn btn-danger" id="logoutButton">LOGOUT ${currentUsername}</button>`;
		$("#logout-container").append(logoutButton);
	});
}

//Load functions
function displaySearchMovie(movieSearched){
	//clear out DOM
	searchMovie(movieSearched).then((returnedMovie)=>{
		console.log("returned Movie: ", returnedMovie.Poster);
		//get elements from data and append to DOM
		//add save button & rate button & seen/unseen checkbox? radio?
		$("#movieSearchArea").append(`<img src="${returnedMovie.Poster}"><h6>${returnedMovie.Title}</h6>`);
	});
}
function getSavedMovies(){
	//getUser and use uid
	firebaseUser.getUser(apiKeys, uid).then((userResponse)=>{
		console.log("userResponse", userResponse);
	}).catch( (error)=>{
		console.log("error", error);
	});
	//getMovieSearches 
	firebaseMethods.getMovies(apiKeys, uid).then((savedMovies)=>{
		// console.log("savedMovies", savedMovies);
		let seenMovies = [];
		let unseenMovies = [];
		// seenMovies = savedMovies;
		$.each(savedMovies, (index, movie)=>{

			if (movie.watched){
				seenMovies.push(movie);
				
			} else if (!movie.watched) {
				unseenMovies.push(movie);
				// displayUnseenMovies(movie, unseenMovies);
			} else {
				console.log("no movies");
			}
			
		});
		
		displaySeenMovies(seenMovies);
		displayUnseenMovies(unseenMovies);
	}).catch( (error)=>{
		console.log("error", error);
	});
	//check if search is seen or unseen with true or false
	//displaySeenMovies
	//displayUnseenMovies
	
}
function displaySeenMovies(savedMovies, sortCategory){
//append seen movies to $("#seenMovies")
	let bysortCategoy = savedMovies.slice(0);
	bysortCategoy.sort( (a,b)=> {
		return b.sortCategoy - a.sortCategoy;
	});
	console.log("user Rating", bysortCategoy);
	// console.log("arrayOfMovies", savedMovies);
	
}
function displayUnseenMovies(savedMovie){
//append unseen movies to $("#unseenMovies")
	// console.log("unseenseen MOvie", savedMovie);
}

//Load page
$(document).ready(function() {
	credentials().then( (keys)=>{
		apiKeys = keys;
		console.log("keys", keys);
		firebase.initializeApp(keys);
	});

	//get Movie search title on enter key
	$('#movie-input').keypress( (event)=>{
		if (event.which == 13){
			let movieTitle = $("#movie-input").val();
			displaySearchMovie(movieTitle);
			$("#movie-input").val("");
		} 
	});
	//get Movie search title on button click
	$('#search-button').on("click", (event)=>{
		let movieTitle = $("#movie-input").val();
		displaySearchMovie(movieTitle);
		$("#movie-input").val("");
	});

	$("#registerButton").on("click", function(){
		let email = $("#inputEmail").val();
		let password = $("#inputPassword").val();
		let username = $("#inputUsername").val();

		let user = {
			"email": email,
			"password": password
		};

		firebaseAuth.registerUser(user).then(function(registerResponse){
			console.log("register response", registerResponse);
			let newUser = {
				"username": username,
				"uid": registerResponse.uid
			};
			
			return firebaseUser.addUser(apiKeys, newUser);
			//return FbAPI.loginUser(user);

		}).then(function(addUserResponse){
			return firebaseAuth.loginUser(user);
		}).then(function(loginResponse){
			console.log("login response", loginResponse);
			uid = loginResponse.uid;
			createLogoutButton();
			$("#login-container").addClass("hide");
			$("#movie-container").removeClass("hide");
			getSavedMovies();
		});
	});

	$("#loginButton").on("click", function(){
		let email = $("#inputEmail").val();
		let password = $("#inputPassword").val();

		let user = {
			"email": email,
			"password": password
		};

		firebaseAuth.loginUser(user).then(function(loginResponse){
			uid = loginResponse.uid;
			createLogoutButton();
			$("#login-container").addClass("hide");
			$("#movie-container").removeClass("hide");
			getSavedMovies();

		});
	});

	$("#logout-container").on("click", "#logoutButton", function(){
		firebaseAuth.logoutUser();
		uid="";
		
		$("#inputEmail").val("");
		$("#inputPassword").val("");
		$("#inputUsername").val("");
		$("#login-container").removeClass("hide");
		$("#movie-container").addClass("hide");
	});

});