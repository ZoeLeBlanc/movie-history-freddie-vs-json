"use strict";

//load functions
function loadMovie(){
	searchMovie(movieTitle).then((returnedMovie)=>{
		console.log("returned Movie: ", returnedMovie);
	});
}