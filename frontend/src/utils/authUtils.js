import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";

import {auth} from "./FirebaseConfig"
import { useNavigate, useLocation } from "react-router-dom";

export const register = (email, password) => {
  const auth = getAuth();

  return new Promise((resolve, reject) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        resolve({ response: "User created successfully", userID: user.uid });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const signIn = (email, password) => {
  const auth = getAuth();

  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        resolve({ result: "User signed in successfully", userID: user.uid });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        reject({
          result: "User sign-in failed",
          error: errorMessage,
          errorCode: errorCode
        });
      });
  });
};

export const handleGoogleLogin = () => {
    return new Promise((resolve, reject) => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    const userId = user.uid
    console.log(user.uid)
    resolve(userId); 
   

  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error?.customData?.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(errorMessage)
    alert(errorMessage)
    reject(error);
});
});
};

  export const handleFacebookLogin = () => {
    return new Promise((resolve, reject) => {
    const provider = new FacebookAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const userId = user.uid
      console.log(user.uid)
      alert("User signed in sucessfully")
      resolve(userId);
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error?.customData?.email;
      const credential = FacebookAuthProvider.credentialFromError(error);
      console.log(errorMessage)
      alert(errorMessage)
      reject(error); 

    });
});
};

export const handlePasswordReset = (email) => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent successfully. Please check your inbox.");
        resolve();
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        alert(errorMessage);
        reject(error);
      });
  });
};