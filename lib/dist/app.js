(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function firebaseCredentials (){
	return new Promise((resolve, reject)=> {
		$.ajax({
			method: 'GET',
			url: `apiKeysFirebase.json`
		}).then((response)=>{
			resolve(response);
		},(error)=>{
			reject(error);
		});
	});
}

module.exports = firebaseCredentials;
},{}],2:[function(require,module,exports){
'use strict';

  
function registerUser(credentials){
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then((authData) =>{
        resolve(authData);
      })
      .catch((error)=>{
        reject(error);
      });
    });
}

function loginUser(credentials){
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
      .then((authData) =>{
        resolve(authData);
      })
      .catch((error)=>{
        reject(error);
      });
    });
}

function credentialsCurrentUser(){
    return firebase.auth().currentUser;
}

function logoutUser(){
     firebase.auth().signOut();
}
let firebaseAuth = {
  registerUser, loginUser, credentialsCurrentUser, logoutUser
};
module.exports = firebaseAuth;
},{}],3:[function(require,module,exports){
"use strict";

function getUser(apiKeys, uid){
		return new Promise( (resolve, reject)=> {
			$.ajax({
				method:'GET',
				url:`${apiKeys.databaseURL}/users.json?orderBy="uid"&equalTo="${uid}"`
			}).then( (response)=>{
				let users = [];
				Object.keys(response).forEach( (key)=> {
					response[key].id = key;
					users.push(response[key]);
				});
				resolve(users[0]);
			},(error)=>{
				reject(error);
			});
		});
}
function addUser(apiKeys, newUser){
		return new Promise( (resolve, reject)=> {
			$.ajax({
				method:'POST',
				url:`${apiKeys.databaseURL}/users.json`,
				data: JSON.stringify(newUser),
				dataType: 'json'
			}).then( (response)=>{
				console.log("response", response);
				resolve(response);
			},(error)=>{
				reject(error);
			});
		});
}
let firebaseUser = {
	getUser, addUser
};
module.exports = firebaseUser;
},{}],4:[function(require,module,exports){
"use strict";

function getMovie(movieName) {
	return new Promise ((resolve, reject) => {
		$.ajax({
			method: 'GET',
			url: `http://www.omdbapi.com/?t=${movieName}`
		}).then((response) => {
			console.log("response", response);
			resolve(response);
		}, (errorResponse) => {
			console.log("movie fail", errorResponse);
		reject(errorResponse);
		});
	});
}

module.exports = getMovie;
},{}],5:[function(require,module,exports){
"use strict";

let getMovie = require("./getMovie");
let credentials = require("./credentials");
let firebaseUser = require("./firebaseUser");
let firebaseAuth = require("./firebaseAuth");
// let getUser = require("./firebaseUser");
// let loginUser = require("./firebaseAuth");
// let logoutUser = require("./firebaseAuth");

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

$(document).ready(function() {
	credentials().then( (keys)=>{
		apiKeys = keys;
		console.log("keys", keys);
		firebase.initializeApp(keys);
	});
	getMovie("Top Gun").then((returnedMovie)=>{
		console.log("returned Movie: ", returnedMovie);
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
			$("#list-container").removeClass("hide");
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
},{"./credentials":1,"./firebaseAuth":2,"./firebaseUser":3,"./getMovie":4}]},{},[5]);
