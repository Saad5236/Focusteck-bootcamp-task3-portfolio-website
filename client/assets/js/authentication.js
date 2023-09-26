import authenticationRequests from "../requests/authentication.js";
// ___________LOGIN SIGNUP SWITCH___________
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (loggedInUser) {
  console.log("userLoggedIn", loggedInUser);
  if(loggedInUser.userRole === "admin") {
    window.location.href = "./index1.html";
  } else if(loggedInUser.userRole === "user") {
    window.location.href = "./index.html";
  }
} 
// else {
//   window.location.href = "./authentication.html";
// }


const loginFormSection = document.querySelector(".login-form-section");
const signupFormSection = document.querySelector(".signup-form-section");
const loginSignupBtn = document.querySelector(".login-signup-btn");
const signupLoginBtn = document.querySelector(".signup-login-btn");

loginSignupBtn.addEventListener("click", () => {
  loginFormSection.style.display = "none";
  signupFormSection.style.display = "grid";
});

signupLoginBtn.addEventListener("click", () => {
  signupFormSection.style.display = "none";
  loginFormSection.style.display = "grid";
});

// ___________FUNCTIONS___________

const generateId = () => {
  let id;
  while (true) {
    id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    let usersData = JSON.parse(localStorage.getItem("usersData"));

    if (usersData && usersData.find((i) => i.userId === id)) {
      continue;
    } else {
      break;
    }
  }
  return id;
};

// _________SIGNUP USER IN LOCAL STORAGE__________

const signupForm = document.querySelector(".signup-form-section form");
const signupFormBtn = document.querySelector(
  ".signup-form-section form button"
);

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const signupFormData = new FormData(signupForm, signupFormBtn); // to fetch signup form data

  if (
    signupFormData.get("signup-fullname") === "" ||
    signupFormData.get("signup-phonenumber") === "" ||
    signupFormData.get("signup-email") === "" ||
    signupFormData.get("signup-password") === ""
  ) {
    alert("Some input fields are still empty. Fill them and try again.");
  } else {
    // if all fields are filled

    let newUserData = {
      // userId: generateId(),
      userRole: "user", // alternatively admin
      userName: signupFormData.get("signup-fullname"),
      userNumber: signupFormData.get("signup-phonenumber"),
      userEmail: signupFormData.get("signup-email"),
      userPassword: signupFormData.get("signup-password"),
      userProfession: "",
      userAbout: "",
      userImgSrc: "",
      userSkills: [],
    };
    const res = await authenticationRequests.signupUser(newUserData);

    if (res.status === 201 || res.status === 200) {
      const data = await res.json();
      console.log("LOGIN SUCCESSFUL", data.authToken, data.userData, data);
      localStorage.setItem("authToken", JSON.stringify(data.authToken));
      localStorage.setItem("loggedInUser", JSON.stringify(data.userData));
      console.log("login too");
      if (data.userData.userRole === "user") {
        window.location.href = "./index.html";
      } else {
        window.location.href = "./index1.html";
      }
    } else if (res.status === 409) {
      alert("Duplicate email found in database");
    }

    // let allUsersData = JSON.parse(localStorage.getItem("usersData"));

    // if (
    //   !allUsersData ||
    //   (allUsersData &&
    //     !allUsersData.find(
    //       (data) => data.userEmail === signupFormData.get("signup-email")
    //     ))
    // ) {
    //   let newUserData = {
    //     userId: generateId(),
    //     userRole: "user", // alternatively admin
    //     userName: signupFormData.get("signup-fullname"),
    //     userNumber: signupFormData.get("signup-phonenumber"),
    //     userEmail: signupFormData.get("signup-email"),
    //     userPassword: signupFormData.get("signup-password"),
    //     userProfession: "",
    //     userAbout: "",
    //     userImgSrc: "",
    //     userSkills: [],
    //   };

    //   console.log(newUserData);

    //   let usersData;

    //   if (localStorage.getItem("usersData") === null) {
    //     usersData = [
    //       {
    //         userId: 1,
    //         userRole: "admin", // alternatively admin
    //         userName: "Saad",
    //         userNumber: "89389236",
    //         userEmail: "d@d.com",
    //         userPassword: "d",
    //         userProfession: "Admin",
    //         userAbout:
    //           "I am new admin. I am new admin. I am new admin. I am new admin. I am new admin. I am new admin. I am new admin. I am new admin",
    //         userImgSrc: "assets/images/about-me-img.jpg",
    //         userSkills: [],
    //       },
    //     ];
    //     localStorage.setItem("userProjectsData", JSON.stringify([]));
    //     localStorage.setItem("userEducationsData", JSON.stringify([]));
    //     localStorage.setItem("userExperiencesData", JSON.stringify([]));
    //     localStorage.setItem("usersData", JSON.stringify(usersData));
    //   } else {
    //     usersData = JSON.parse(localStorage.getItem("usersData"));
    //   }
    //   usersData.push(newUserData);
    //   localStorage.setItem("usersData", JSON.stringify(usersData));
    //   localStorage.setItem("loggedInUser", JSON.stringify(newUserData));

    //   window.location.href = "./index.html";
    // } else {
    //   alert("email already exists");
    // }
  }
});

// _________LOGIN USER IN LOCAL STORAGE__________

const loginForm = document.querySelector(".login-form-section form");
const loginFormBtn = document.querySelector(".login-form-section form button");
// const authenticationRequests = require("../requests/authentication.js")

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("OHAYO");

  const loginFormData = new FormData(loginForm, loginFormBtn); // to fetch login form data

  let usersData = localStorage.getItem("usersData");
  let loginFormDataEmail = loginFormData.get("login-email");
  let loginFormDataPassword = loginFormData.get("login-password");

  try {
    // const res = await fetch("http://localhost:3000/api/login", {
    //   method: "POST",
    //   headers: { "Content-type": "application/json" },
    //   body: JSON.stringify({
    //     userEmail: loginFormDataEmail,
    //     userPassword: loginFormDataPassword,
    //   }),
    // });

    const res = await authenticationRequests.loginUser({
      userEmail: loginFormDataEmail,
      userPassword: loginFormDataPassword,
    });

    if (res.status === 200) {
      const data = await res.json();
      console.log("LOGIN SUCCESSFUL", data.authToken, data.userData, data);
      localStorage.setItem("authToken", JSON.stringify(data.authToken));
      localStorage.setItem("loggedInUser", JSON.stringify(data.userData));
      if (data.userData.userRole === "user") {
        window.location.href = "./index.html";
      } else {
        window.location.href = "./index1.html";
      }
    } else if (res.status === 401) {
      alert("User's email or/and password is/are incorrect.");
    }
  } catch (e) {
    console.log("ERROR", e);
  }

  // if (usersData !== null) {
  //   usersData = JSON.parse(usersData);

  //   if (loginFormDataEmail === "" || loginFormDataPassword === "") {
  //     alert("One or more fields are empty. Fill them and try again.");
  //   } else {
  //     let loggedInUser = usersData.find(
  //       (user) =>
  //         user.userEmail === loginFormDataEmail &&
  //         user.userPassword === loginFormDataPassword
  //     );
  //     if (loggedInUser) {
  //       console.log("user logged in", loggedInUser);
  //       localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
  //       if (loggedInUser.userRole === "admin") {
  //         window.location.href = "./index1.html";
  //       } else {
  //         window.location.href = "./index.html";
  //       }
  //     } else {
  //       alert("Your email or password or both are incorrect.");
  //     }
  //   }
  // } else {
  //   alert("No data in database in backend. Sign up first.");
  // }
});
