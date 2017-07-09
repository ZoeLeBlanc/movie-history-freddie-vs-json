"use strict";

function getMovies(apiKeys, uid){
		return new Promise( (resolve, reject)=> {
			$.ajax({
				method:'GET',
				url:`${apiKeys.databaseURL}/movies.json?orderBy="uid"&equalTo="${uid}"`
			}).then( (response)=>{
				console.log("response", response);
				let movies = [];
				Object.keys(response).forEach( (key)=> {
					response[key].id = key;
					movies.push(response[key]);
				});
				resolve(movies);
			},(error)=>{
				reject(error);
			});
		});
}
function addMovie(apiKeys, newMovie) {
		return new Promise( (resolve, reject)=> {
			$.ajax({
				method:'POST',
				url:`${apiKeys.databaseURL}/movies.json`,
				data: JSON.stringify(newMovie),
				dataType: 'json'
			}).then( (response)=>{
				console.log("response", response);
				resolve(response);
			},(error)=>{
				reject(error);
			});
		});
}
function deleteMovie(apiKeys , movieID){
		return new Promise( (resolve, reject)=> {
			$.ajax({
				method:'DELETE',
				url:`${apiKeys.databaseURL}/movies/${movieID}.json`
			}).then( (response)=>{
				console.log("response from delete", response);
				resolve(response);
			},(error)=>{
				console.log("error from delete", error);
				reject(error);
			});
		});
}

function editMovie(apiKeys, itemId, editedMovie){
		return new Promise((resolve, reject)=>{
			$.ajax({
				method:'PUT',
				url:`${apiKeys.databaseURL}/movies/${itemId}.json`,
				data: JSON.stringify(editedMovie),
				dataType:'json'
			}).then((response)=>{
				console.log("response from PUT", response);
				resolve(response);
			}, (error)=>{
				reject(error);
			});
		});
}

let firebaseMethods = {
	getMovies, addMovie, deleteMovie, editMovie
};
module.exports = firebaseMethods;