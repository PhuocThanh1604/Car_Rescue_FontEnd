// import { useForm } from "react-hook-form";

// const LoginForm = () => {
//   const { register, handleSubmit } = useForm();
//   const submitForm = (data) => {
//     console.log(data);
//   };

//   return (
//     <form
//       className="login__login-container__main-container__form-container__form"
//       onSubmit={handleSubmit(submitForm)}
//     >
//       <input
//         className="login__login-container__main-container__form-container__form--email"
//         type="email"
//         placeholder="Email"
//         name="email"
//         {...register("email")}
//       />
//       <input
//         className="login__login-container__main-container__form-container__form--password"
//         type="password"
//         placeholder="Password"
//         name="password"
//         {...register("password")}
//       />
//       <button className="login__login-container__main-container__form-container__form--submit">
//         Sign In
//       </button>
//     </form>
//   );
// };

// export default LoginForm;

// LoginForm.jsx
// import React from "react";
// import { useForm } from "react-hook-form";
// import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { useAuth } from "../../context/AuthContext";

// const LoginForm = () => {
//   const { register, handleSubmit } = useForm();
//   const { user, auth } = useAuth(); // Sử dụng auth từ useAuth()

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, new GoogleAuthProvider());
//       // result.user chứa thông tin người dùng đã đăng nhập thành công
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const submitForm = (data) => {
//     console.log(data);
//     // Xử lý đăng nhập bằng email và mật khẩu
//   };

//   return (
//     <form onSubmit={handleSubmit(submitForm)}>
//       {user ? (
//         <div>
//           Đã đăng nhập với tên: {user.displayName}
//           {/* <button onClick={() => signOut(auth)}>Đăng xuất</button> */}
//         </div>
//       ) : (
//         <div>
//           <input type="email" placeholder="Email" name="email" {...register("email")} />
//           <input type="password" placeholder="Password" name="password" {...register("password")} />
//           <button type="submit">Đăng nhập</button>
//           <button onClick={handleGoogleSignIn}>Đăng nhập với Google</button>
//         </div>
//       )}
//     </form>
//   );
// };

// export default LoginForm;
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getRedirectResult, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { login } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const submitForm = async (data) => {
    try {
      if (!data.email) {
        setError("Please enter your email address.");
        return;
      }

    } catch (error) {
      setError("User not found. Please check your credentials and try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider(auth);

      // Sign in with Google using Firebase
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Retrieve the Firebase ID token
      const idToken = await user.getIdToken();

      // Dispatch the login action with the Firebase ID token
      dispatch(login(idToken));

      // Log user name and token ID
      console.log("User name:", user.displayName);
      console.log("Token ID:", idToken);

    } catch (error) {
      console.log(error);
    }
  };

  // Handle the redirect callback when returning from Google sign-in
  useEffect(() => {
    const handleRedirectCallback = async () => {
      try {
        // Get the Firebase ID token from the redirect result
        const result = await getRedirectResult(auth);
        const user = result.user;

        // Retrieve the Firebase ID token
        const idToken = await user.getIdToken();

        // Dispatch the login action with the Firebase ID token
        dispatch(login(idToken));

        // Log user name and token ID
        console.log("User name:", user.displayName);
        console.log("Token ID:", idToken);

      } catch (error) {
        console.log(error);
      }
    };

    handleRedirectCallback();
  }, []);

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {/* Form đăng nhập */}
      <input {...register("email")} type="email" placeholder="Email" />
      <input {...register("password")} type="password" placeholder="Password" />
      {error && <p>{error}</p>}
      <button type="submit">Đăng nhập</button>
      <button onClick={handleGoogleSignIn}>Đăng nhập với Google</button>
    </form>
  );
};

export default LoginForm;
