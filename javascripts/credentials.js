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