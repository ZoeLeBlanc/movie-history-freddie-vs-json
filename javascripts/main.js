"use strict";

let getMovie = require("./getMovie");
let credentials = require("./credentials");
let apiKeys = {};

$(document).ready(function() {
	credentials().then( (keys)=>{
		apiKeys = keys;
		console.log("keys", keys);
		firebase.initializeApp(keys);
	});
	getMovie("Top Gun").then((returnedMovie)=>{
		console.log("returned Movie: ", returnedMovie);
	});
});