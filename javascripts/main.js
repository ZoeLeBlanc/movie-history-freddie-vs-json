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
let searchedMovie = "";

let seenMoviesDiv = $("#seenMovies");
let unseenMoviesDiv = $("#unseenMovies");


function createLogoutButton(){
	firebaseUser.getUser(apiKeys, uid).then(function(userResponse){
		console.log("userResponse", userResponse);
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
		$("#movieSearchArea").html("");
		console.log("returned Movie: ", returnedMovie);
		searchedMovie = returnedMovie;
		let searchedMovieCard =
			`<div class="row">
				<div class="col s8 offset-s2">
			    <h4 class="header">${returnedMovie.Title} (${returnedMovie.Year})</h2>
			    <div class="card horizontal">
			      <div class="card-image">
			        <img src="${returnedMovie.Poster}" width="75%" height="75%">
			      </div>
			      <div class="card-stacked">
			        <div class="card-content">
							<p>Starring ${returnedMovie.Actors}</p><br />
							<p>Plot: ${returnedMovie.Plot}</p>
								<br />
							<p>IMDB Rating: ${returnedMovie.imdbRating}</p>
			        </div>
			        <div class="card-action">
								<p>
								<input type="checkbox" id="seenItCheckbox" />
								<label for="seenItCheckbox">I've seen it</label>
								</p>
								<p id="radio-wrapper" class="hide">
						      <input name="movieRating" type="radio" id="rating_1" value="1" />
									<label for="rating_1"><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_2" value="2"/>
									<label for="rating_2"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_3" value="3" />
									<label for="rating_3"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_4" value="4" />
									<label for="rating_4"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_5" value="5" />
									<label for="rating_5"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>
						    </p>

			          <button class="btn btn-primary save-btn">Save to My Collection</button>
			        </div>
			      </div>
			    </div>
			  </div>`;
		//get elements from data and append to DOM
		$("#movieSearchArea").html(searchedMovieCard);
		//add save button & rate button & seen/unseen checkbox? radio?
	});
}

// function displaySavedMovies(movieArray, divID){
// 	console.log("movieArray", movieArray);
	
// 	movieArray.forEach(function(item){
		
// 		let newMovieList =`<div><img src="${item.poster}"></div>`;
// 		//console.log("newMovieList", newMovieList);
// 		divID.append(newMovieList);
// 	});

// }

function getSavedMovies(){
	//getMovieSearches
	firebaseMethods.getMovies(apiKeys, uid).then((movies)=>{
		//console.log("savedMovies", movies);
		seenMoviesDiv.html("");
		unseenMoviesDiv.html("");

		movies.forEach( (function(movie){
			if (movie.watched === true){
				//seen movie list
				let newMovieList = 
				`<div class="col s4 offset-s1">
			    <h4 class="header">${movie.title} (${movie.year})</h2>
			    <div class="card horizontal">
			      
			      <div class="card-stacked">
			        <div class="card-content">
							<p>Starring ${movie.cast}</p><br />
							<p>Plot: ${movie.plot}</p>
								<br />
							<p>IMDB Rating: ${movie.imdbRating}</p>
			        </div>
			        <div class="card-action">
								<p>
								<input type="checkbox" id="seenItCheckbox" />
								<label for="seenItCheckbox">I've seen it</label>
								</p>
								<p id="radio-wrapper" class="hide">
						      <input name="movieRating" type="radio" id="rating_1" value="1" />
									<label for="rating_1"><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_2" value="2"/>
									<label for="rating_2"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_3" value="3" />
									<label for="rating_3"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_4" value="4" />
									<label for="rating_4"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_5" value="5" />
									<label for="rating_5"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>
						    </p>

			          <button class="btn btn-primary" id="delete-btn" data-fbid="${movie.id}">Delete </button>
			        </div>
			      </div>
			    </div>`;

				$("#seenMovies").append(newMovieList);
			} else {
				//unseen movie list
				let newMovieList = 
				`<div class="col s4 offset-s1">
			    <h4 class="header">${movie.title} (${movie.year})</h2>
			    <div class="card horizontal">
			      
			      <div class="card-stacked">
			        <div class="card-content">
							<p>Starring ${movie.cast}</p><br />
							<p>Plot: ${movie.plot}</p>
								<br />
							<p>IMDB Rating: ${movie.imdbRating}</p>
			        </div>
			        <div class="card-action">
								<p>
								<input type="checkbox" id="seenItCheckbox" />
								<label for="seenItCheckbox">I've seen it</label>
								</p>
								<p id="radio-wrapper" class="hide">
						      <input name="movieRating" type="radio" id="rating_1" value="1" />
									<label for="rating_1"><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_2" value="2"/>
									<label for="rating_2"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_3" value="3" />
									<label for="rating_3"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_4" value="4" />
									<label for="rating_4"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_5" value="5" />
									<label for="rating_5"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>
						    </p>

			          <button class="btn btn-primary delete-btn" data-fbid="${movie.id}">Delete</button>
			        </div>
			      </div>
			    </div>`;

				$("#unseenMovies").append(newMovieList);
			}
		}));
		//sortSavedMovies(savedMovies, sortCategory, sortType);
	}).catch( (error)=>{
		console.log("error", error);
	});
}
// function sortSavedMovies(savedMovies, sortCategory, sortType){
// 	let seenMovies= [];
// 	let unseenMovies= [];
// 		$.each(savedMovies, (index, movie)=>{
// 			if (movie.watched){
// 				seenMovies.push(movie);
// 				displaySavedMovies(seenMovies, seenMoviesDiv);
// 			}
// 			if (!movie.watched) {
// 				unseenMovies.push(movie);
// 				displaySavedMovies(unseenMovies, unseenMoviesDiv);
// 			}
// 		});
// }

// function orderMovies(assortedMovies, sortCategory, sortType){
// 	let property = sortCategory;
// 	let sortedByRating = assortedMovies.slice(0);

// 	sortedByRating.sort( (a,b)=> {
// 		return a.property - b.property;
// 	});
// 	console.log("orderedMovie", sortedByRating);
// 	displaySavedMovies(sortedByRating, sortType);
// 	//sortedByRating == array of movies sorted by property
// 	//sortType = watched/unwatched

// }
//Load page
$(document).ready(function() {
	credentials().then( (keys)=>{
		apiKeys = keys;
		//console.log("keys", keys);
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
			//console.log("register response", registerResponse);
			let newUser = {
				"username": username,
				"uid": registerResponse.uid
			};

			return firebaseUser.addUser(apiKeys, newUser);
			//return FbAPI.loginUser(user);

		}).then(function(addUserResponse){
			return firebaseAuth.loginUser(user);
		}).then(function(loginResponse){
			//console.log("login response", loginResponse);
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
	$("#loginGoogleButton").on("click", function(){

		firebaseAuth.loginGoogle().then(function(loginResponse){
			console.log("loginResponse", loginResponse);
			uid = loginResponse.user.uid;
			let newUser = {
				"username": loginResponse.user.displayName,
				"uid": loginResponse.user.uid
			};
			console.log("newUser", newUser);

			firebaseUser.addUser(apiKeys, newUser).then(function(addUserResponse){
				console.log("addUserResponse", addUserResponse);
				createLogoutButton();
				$("#login-container").addClass("hide");
				$("#movie-container").removeClass("hide");
				getSavedMovies();
				
			});
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

	$("body").on("change", "#seenItCheckbox", function() {
		if($('#seenItCheckbox').prop('checked')) {
			$("#radio-wrapper").removeClass("hide");
		} else {
			$("#radio-wrapper").addClass("hide");

		}
	});

	$("body").on("click", ".save-btn", function() {
		let userRating = $('#radio-wrapper input[name=movieRating]:checked').val();
		let watched = "";
		console.log("userRating", userRating);
		if($('#seenItCheckbox').prop('checked')) {
			watched = true;
		} else {
			watched = false;
		}
		let newlySavedMovie = {
			"cast": searchedMovie.Actors,
			"director": searchedMovie.Director,
			"imdbRating": searchedMovie.imdbRating,
			"plot": searchedMovie.Plot,
			"poster": "https://images-na.ssl-images-amazon.com/images/M/MV5BNTUxOTdjMDMtMWY1MC00MjkxLTgxYTMtYTM1MjU5ZTJlNTZjXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg",
			"title": searchedMovie.Title,
			"uid": uid,
			"userRating": userRating,
			"watched": watched,
			"year": searchedMovie.Year
		};
		console.log("newlySavedMovie: ",newlySavedMovie);
		firebaseMethods.addMovie(apiKeys, newlySavedMovie);
		$("#movieSearchArea").html("");
		seenMoviesDiv.html("");
		unseenMoviesDiv.html("");
		getSavedMovies();
	});


	$("#savedMovies").on("click", ".delete-btn", function(){
		let movieId = $(this).data("fbid");
		console.log("movieid", movieId);
		firebaseMethods.deleteMovie(apiKeys, movieId).then(function(){
			getSavedMovies();
		});
	});

});
