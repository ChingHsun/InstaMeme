import firebase from "./firebase-config.js";
export const auth = firebase.auth();

export const login = async ({ email, password }) => {
  return auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;

      return user;
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      return { error: errorMessage };
    });
};

export const signup = async ({ email, password, displayName }) => {
  return auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log("Update successful.", user);

      return user;
    })
    .then((user) => {
      user
        .updateProfile({
          displayName: displayName,
          // photoURL: "",
        })
        .catch(function (error) {
          console.log("Update profile error.", error);
        });
      return user;
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      return { error: errorMessage };
      // ..
    });
};
