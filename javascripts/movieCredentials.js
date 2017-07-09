"use strict";

function movieCredentials (){
    return new Promise((resolve, reject)=> {
        $.ajax({
            method: 'GET',
            url: `omdbAPIKeys.json`
        }).then((response)=>{
            resolve(response);
        },(error)=>{
            reject(error);
        });
    });
}

module.exports = movieCredentials;