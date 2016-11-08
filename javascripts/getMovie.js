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