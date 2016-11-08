"use strict";

function movieCredentials (){
	return new Promise( (resolve, reject)=> {
		$.ajax({
			method: 'GET',
			url: `../apiKeysMovie.json`
		}).then( (response)=> {
				console.log("response", response);
				resolve(response);
		}, (error)=>{
				reject(error);
		});
	});
};
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
};

module.exports = movieCredentials;
module.exports = firebaseCredentials;