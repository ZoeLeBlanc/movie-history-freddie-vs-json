"use strict";
//Set browersify requires
let searchMovie = require("./searchMovie");
let credentials = require("./credentials");
let firebaseMethods = require("./firebaseMethods");
let firebaseAuth = require("./firebaseAuth");
let firebaseUser = require("./firebaseUser");
//Set variables
let apiKeys = {};

//Load functions
function displaySearchMovie(movieSearched){
	//clear out DOM
	searchMovie(movieSearched).then((returnedMovie)=>{
		console.log("returned Movie: ", returnedMovie);
		//get elements from data and append to DOM
		//add save button & rate button & seen/unseen checkbox? radio?
	});
}
function getSavedMovies(){
	//getUser and use uid
	//getMovieSearches 
	//check if search is seen or unseen with true or false
	//displaySeenMovies
	//displayUnseenMovies
	
}
function displaySeenMovies(){
//append seen movies to $("#seenMovies")
}
function displayUnseenMovies(){
//append unseen movies to $("#unseenMovies")
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
		} 
	});
	//get Movie search title on button click
	$('#search-button').on("click", (event)=>{
		let movieTitle = $("#movie-input").val();
		displaySearchMovie(movieTitle);
	});
});