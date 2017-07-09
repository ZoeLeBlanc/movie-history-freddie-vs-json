"use strict";

function searchMovie(movieName, movieKey) {
	console.log(movieKey);
	return new Promise ((resolve, reject) => {
		$.ajax({
			method: 'GET',
			url: `https://www.omdbapi.com/?apikey=${movieKey}&?t=${movieName}`
		}).then((response) => {
			resolve(response);
		}, (errorResponse) => {
			console.log("movie fail", errorResponse);
		reject(errorResponse);
		});
	});
}

module.exports = searchMovie;