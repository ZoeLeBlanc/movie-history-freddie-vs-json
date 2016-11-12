'use strict';

function loginGoogle(){
  var provider = new firebase.auth.GoogleAuthProvider();
  return new Promise( (resolve, reject)=>{
      firebase.auth().signInWithPopup(provider)

      .then(function(result) {
        console.log("Google result", result);
        console.log("Google user", result.user.providerData[0].displayName);
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user.providerData[0].displayName;

        resolve(result);
      }).catch(function(error) {
        // Handle Errors here.
        console.log("error", error);
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        reject(error);
      });
  });
}

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
  registerUser, loginUser, credentialsCurrentUser, logoutUser, loginGoogle
};
module.exports = firebaseAuth;
