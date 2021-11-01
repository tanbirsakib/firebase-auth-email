import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import './App.css';
import initAuth from './Firebase/firebase.init';

// intitializing firebase auth 
initAuth();
const auth = getAuth()
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");

  const handleRegistration = e => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be six character")
      return;
    }

    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError("Password should contain two uppercase letters")
      return;
    }
    
    isLoggedIn ?  loginUser(email, password) : registerNewUser(email, password) 
    

  }
  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError("")
        emailVerification();
        setUsername();
      })
      .catch(error => {
        setError(error.message);
      })
      
  }

  const loginUser = ()=> {
    signInWithEmailAndPassword(auth, email, password)
    .then(result =>{
      // const user = result.user;
      setError("");
    })
    .catch(error => {
      setError(error.message);
    })
  }

  const handleEmailChange = e => {
    setEmail(e.target.value);
  }
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  }
  const toggleLogin = e => {
    setIsLoggedIn(e.target.checked);
  }

  // email verificatin 
  const emailVerification = () => {
    sendEmailVerification(auth.currentUser)
    .then(() => {
     //email verification sent
    })
  }
  //reset password
  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
    .then(() =>{
      //passwordreste email sent
    })
  }
  const handleUserName = (e) => {
    setName(e.target.value);
  }
  const setUsername = () => {
    updateProfile(auth.currentUser, {
      displayName : name
    })
    .then(()=>{
      //profile name updated
    })
    .catch((error) => {
      // An error occurred
      // ...
    });
  }
  return (
    <div className="mx-5">
      <form onSubmit={handleRegistration} >
        <h3 className="text-primary">{isLoggedIn ? "Login" :  "Register"}</h3>
       {!isLoggedIn && <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input onBlur={handleUserName} type="text" className="form-control" id="name" required />
          </div>
        </div>}
        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>
        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3"
              required />
          </div>
          <div className="form-check">
            <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
            <label className="form-check-label" htmlFor="gridCheck1">
              Already Registered?
            </label>
          </div>
          <h4 className="text-danger text-center">{error}</h4>
        </div>
        <button type="submit" className="btn btn-primary">{isLoggedIn ? "Login" :  "Register"}</button>
        <button onClick={handleResetPassword} className="btn-primary p-1 m-1">Reset Password</button>
      </form>

    </div>
  );
}

export default App;
