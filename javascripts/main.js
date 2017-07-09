"use strict";
//Set browersify requires
let searchMovie = require("./searchMovie");
let credentials = require("./credentials");
let movieCredentials = require("./movieCredentials");
let firebaseMethods = require("./firebaseMethods");
let firebaseAuth = require("./firebaseAuth");
let firebaseUser = require("./firebaseUser");
//Set variables
let apiKeys = {};
let movieKey = "";
let uid = "";
let searchedMovie = "";
let currentUser = "";
let returnedMovies = "";
//Get elements
let seenMoviesDiv = $("#seenMovies");
let unseenMoviesDiv = $("#unseenMovies");
//Create Logout Button
function createLogoutButton(){
	firebaseUser.getUser(apiKeys, uid).then(function(userResponse){
		console.log("userResponse", userResponse);
		$("#logout-container").html("");
		let logoutButton = `<button class="btn btn-danger" id="logoutButton">LOGOUT ${currentUser}</button>`;
		$("#logout-container").append(logoutButton);
	});
}
//Load initial display search Movie
function displaySearchMovie(movieSearched, movieKey){
	console.log(movieKey);
	//clear out DOM
	searchMovie(movieSearched, movieKey).then((returnedMovie)=>{
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
							<button class="btn btn-primary youtube-btn">Trailer</button>
			        </div>
			        <div class="card-action">
			        <div id="twitterBtn">
			        <a href="https://twitter.com/share" class="twitter-share-button" data-text="Share your love for ${returnedMovie.Title} that you found with Freddy VS JSON" data-url="https://freddy-vs-json.firebaseapp.com" data-show-count="false">Tweet</a><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
			        </div>
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
//Sort Movies on click
function sortMovies(sortCategory){
	//getMovieSearches
		let allSavedMovies = [];
		$.each(returnedMovies, (index, movie)=> {
			movie.imdbRating = movie.imdbRating * 1;
			movie.userRating = movie.userRating * 1;
			allSavedMovies.push(movie);
		});
		sortSavedMovies(allSavedMovies, sortCategory);
}
function sortSavedMovies(allMovies, sortCategory) {
	if (sortCategory === "imdbRating") {
		allMovies.sort( (a,b)=> {
		return b.imdbRating - a.imdbRating;
		});
	}
	if (sortCategory === "userRating"){
		allMovies.sort( (a,b)=> {
		return b.userRating - a.userRating;
		});
	}
	if (sortCategory === "alphabetical") {
		allMovies.sort( (a,b)=> {
			return a.title.localeCompare(b.title);
		});
	}
	allMovies.reduce(function (result, item){
		var key = Object.keys(item)[0];
		result[key] = item[key];
		return result;
	}, {});
	console.log("allMovies", allMovies);
	displayMovies(allMovies);
}
//Get Movies from firebase
function getSavedMovies() {
	firebaseMethods.getMovies(apiKeys, uid).then((movies)=>{
		returnedMovies = "";
		returnedMovies = movies;
		console.log("get MOvies", returnedMovies);
		displayMovies(returnedMovies);
	}).catch( (error)=>{
		console.log("error", error);
	});
}
function displayMovies(allMovies){
	//getMovieSearches
	let movies = allMovies;
	console.log("display Movies", allMovies);
		seenMoviesDiv.html("");
		unseenMoviesDiv.html("");
		$.each(movies, (index, movie)=>{
			if (movie.watched === true){
				//seen movie list
				let newMovieList =
				`<div class="col s4 offset-s1" data-seen="${movie.watched}">

			    <div class="card horizontal">

			      <div class="card-stacked">
			        <div class="card-content" data-fbid="${movie.id}">
			    	<h4 class="header">${movie.title} (${movie.year})</h2>
							<p>Starring: ${movie.cast}</p><br />
							<p>Plot: ${movie.plot}</p>
								<br />
							<p>IMDB Rating: ${movie.imdbRating}</p>
			        </div>
			        <div class="card-action">

								<p id="radio-wrapper">
						      	<h5>User Rating: ${movie.userRating} Stars</h5>
						    </p>

			          <button class="btn btn-primary delete-btn" data-fbid="${movie.id}">Delete </button>
			        </div>
			      </div>
			    </div>`;
				$("#seenMovies").append(newMovieList);
			} else {
				//unseen movie list
				let newMovieList =
				`<div class="col s4 offset-s1" data-seen="${movie.watched}">

			    <div class="card horizontal">

			      <div class="card-stacked">
			        <div class="card-content">
			    	<h4 class="header">${movie.title} (${movie.year})</h2>
							<p>Starring: ${movie.cast}</p><br />
							<p>Plot: ${movie.plot}</p>
								<br />
							<p>IMDB Rating: ${movie.imdbRating}</p>
			        </div>
			        <div class="card-action">
								<p>
								<input type="checkbox" id="seenIt_${movie.id}" />
								<label for="seenIt_${movie.id}">I've seen it</label>
								</p>
								<p class="radio-wrapper hide">
						      <input name="movieRating" type="radio" id="rating_1_${movie.id}" value="1" />
									<label for="rating_1_${movie.id}"><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_2_${movie.id}" value="2"/>
									<label for="rating_2_${movie.id}"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_3_${movie.id}" value="3" />
									<label for="rating_3_${movie.id}"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_4_${movie.id}" value="4" />
									<label for="rating_4_${movie.id}"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>

						      <input name="movieRating" type="radio" id="rating_5_${movie.id}" value="5" />
									<label for="rating_5_${movie.id}"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></label>
						    </p>

			          <button class="btn btn-primary delete-btn" data-fbid="${movie.id}">Delete</button>
			        </div>
			      </div>
			    </div>`;
				//get updates from ratings
				$("body").on("change", `#rating_1_${movie.id}`, function() {
					let movieId = $(this).parent().next().data("fbid");
					let userRating = 1;
					let newlySavedMovie = {
						"cast": movie.cast,
						"director": movie.director,
						"imdbRating": movie.imdbRating,
						"plot": movie.plot,
						"title": movie.title,
						"uid": uid,
						"userRating": userRating,
						"watched": true,
						"year": movie.year
					};
					firebaseMethods.deleteMovie(apiKeys, movieId).then(function(){
						getSavedMovies();
					});
					firebaseMethods.addMovie(apiKeys, newlySavedMovie);
				});
				$("body").on("change", `#rating_2_${movie.id}`, function() {
					let movieId = $(this).parent().next().data("fbid");
					let userRating = 2;
					let newlySavedMovie = {
						"cast": movie.cast,
						"director": movie.director,
						"imdbRating": movie.imdbRating,
						"plot": movie.plot,
						"title": movie.title,
						"uid": uid,
						"userRating": userRating,
						"watched": true,
						"year": movie.year
					};
					firebaseMethods.deleteMovie(apiKeys, movieId).then(function(){
						getSavedMovies();
					});
					firebaseMethods.addMovie(apiKeys, newlySavedMovie);
				});
				$("body").on("change", `#rating_3_${movie.id}`, function() {
					let movieId = $(this).parent().next().data("fbid");
					let userRating = 3;
					let newlySavedMovie = {
						"cast": movie.cast,
						"director": movie.director,
						"imdbRating": movie.imdbRating,
						"plot": movie.plot,
						"title": movie.title,
						"uid": uid,
						"userRating": userRating,
						"watched": true,
						"year": movie.year
					};
					firebaseMethods.deleteMovie(apiKeys, movieId).then(function(){
						getSavedMovies();
					});
					firebaseMethods.addMovie(apiKeys, newlySavedMovie);
				});
				$("body").on("change", `#rating_4_${movie.id}`, function() {
					let movieId = $(this).parent().next().data("fbid");
					let userRating = 4;
					let newlySavedMovie = {
						"cast": movie.cast,
						"director": movie.director,
						"imdbRating": movie.imdbRating,
						"plot": movie.plot,
						"title": movie.title,
						"uid": uid,
						"userRating": userRating,
						"watched": true,
						"year": movie.year
					};
					firebaseMethods.deleteMovie(apiKeys, movieId).then(function(){
						getSavedMovies();
					});
					firebaseMethods.addMovie(apiKeys, newlySavedMovie);
				});
				$("body").on("change", `#rating_5_${movie.id}`, function() {
					let movieId = $(this).parent().next().data("fbid");
					let userRating = 5;
					let newlySavedMovie = {
						"cast": movie.cast,
						"director": movie.director,
						"imdbRating": movie.imdbRating,
						"plot": movie.plot,
						"title": movie.title,
						"uid": uid,
						"userRating": userRating,
						"watched": true,
						"year": movie.year
					};
					firebaseMethods.deleteMovie(apiKeys, movieId).then(function(){
						getSavedMovies();
					});
					firebaseMethods.addMovie(apiKeys, newlySavedMovie);
				});
				$("#unseenMovies").append(newMovieList);

			}
		});
}
//Load page
$(document).ready(function() {
	//initilize credentials
	credentials().then( (keys)=>{
		apiKeys = keys;
		firebase.initializeApp(keys);
	});
	movieCredentials().then( (keys)=>{
		console.log("first key", keys);
		movieKey = Object.values(keys)[0];
		console.log("second key", movieKey);
	});
	//Initialize select elements for materialize
	$("select").material_select();
	//get Movie search title on enter key
	$('#movie-input').keypress( (event)=>{
		if (event.which == 13){
			let movieTitle = $("#movie-input").val();
			displaySearchMovie(movieTitle, movieKey);
			$("#movie-input").val("");
		}
	});
	//get Movie search title on button click
	$('#search-button').on("click", (event)=>{
		let movieTitle = $("#movie-input").val();
		displaySearchMovie(movieTitle, movieKey);
		$("#movie-input").val("");
	});
	//get register click
	$("#registerButton").on("click", function(){
		let email = $("#inputEmail").val();
		let password = $("#inputPassword").val();
		let username = $("#inputUsername").val();
		currentUser = $("#inputUsername").val();

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
	//Get login click
	$("#loginButton").on("click", function(){
		let email = $("#inputEmail").val();
		let password = $("#inputPassword").val();

		let user = {
			"email": email,
			"password": password
		};

		firebaseAuth.loginUser(user).then(function(loginResponse){
			uid = loginResponse.uid;
			currentUser = email;
			createLogoutButton();
			$("#login-container").addClass("hide");
			$("#movie-container").removeClass("hide");
			getSavedMovies();

		});
	});
	//get google Login
	$("#loginGoogleButton").on("click", function(){

		firebaseAuth.loginGoogle().then(function(loginResponse){//shit
			console.log("loginResponse", loginResponse);
			currentUser = loginResponse.user.providerData[0].displayName;
			uid = loginResponse.user.uid;
				createLogoutButton();
				$("#login-container").addClass("hide");
				$("#movie-container").removeClass("hide");
			getSavedMovies();
		});
	});
	//Logout click and clear values
	$("#logout-container").on("click", "#logoutButton", function(){
		firebaseAuth.logoutUser();
		uid="";

		$("#inputEmail").val("");
		$("#inputPassword").val("");
		$("#inputUsername").val("");
		$("#login-container").removeClass("hide");
		$("#movie-container").addClass("hide");
	});
	//Get change on checkbox
	$("body").on("change", "#seenItCheckbox", function() {
		if($('#seenItCheckbox').prop('checked')) {
			$("#radio-wrapper").removeClass("hide");
		} else {
			$("#radio-wrapper").addClass("hide");

		}
	});
	//Get saved movie and send to database
	$("body").on("click", ".save-btn", function() {
		let userRating = $('input[name=movieRating]:checked').val();
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
		console.log("userRating", userRating);
		firebaseMethods.addMovie(apiKeys, newlySavedMovie);
		$("#movieSearchArea").html("");
		seenMoviesDiv.html("");
		unseenMoviesDiv.html("");
		getSavedMovies();
	});

	//delete buttons
	$("#seenMovies").on("click", ".delete-btn", function(){
		let movieId = $(this).data("fbid");
		console.log("movieid", movieId);
		firebaseMethods.deleteMovie(apiKeys, movieId).then(function(){
			getSavedMovies();
		});
	});


	$("#unseenMovies").on("click", ".delete-btn", function(){
		let movieId = $(this).data("fbid");
		console.log("movieid", movieId);
		firebaseMethods.deleteMovie(apiKeys, movieId).then(function(){
			getSavedMovies();
		});
	});

	//checkbox in saved & to watch
	$("#unseenMovies").on("change", "input[type='checkbox']", function(){
		if($(this).closest("input[type='checkbox']").prop("checked")) {
			$(this).parent().next().removeClass("hide");
			console.log("should show it");
		} else {
			$(this).parent().next().addClass("hide");
			console.log("should hide it");

		}
	});
	//Get Youtube trailers
	$("body").on("click", ".youtube-btn", function() {
		var win = window.open(`https://www.youtube.com/results?search_query=${searchedMovie.Title}+trailer`);
		if (win) {
		    //Browser has allowed it to be opened
		    win.focus();
		} else {
		    //Browser has blocked it
		    alert('Please allow popups for this website');
		}
	});
	//Get change on select elements
	$("body").on("change", "#sortSeen", function(event) {
		let sortingCategory = "";
		sortingCategory = event.target.value;
		console.log("event seen", sortingCategory);
		sortMovies(sortingCategory);
	});
	$("body").on("change", "#sortUnseen", function(event) {
		let sortingCategory = "";
		sortingCategory = event.target.value;
		console.log("event seen", sortingCategory);
		sortMovies(sortingCategory);
	});

});
