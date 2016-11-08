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
};

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
};

function credentialsCurrentUser(){
    return firebase.auth().currentUser;
};

function logoutUser(){
     firebase.auth().signOut();
};
let firebaseAuth = {
  registerUser, loginUser, credentialsCurrentUser, logoutUser
};
module.exports = firebaseAuth;