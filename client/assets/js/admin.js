const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
let userProjectsData = JSON.parse(localStorage.getItem("userProjectsData"));
let user = JSON.parse(localStorage.getItem("loggedInUser"));
import usersRequests from "../requests/users.js";

// __________CHECKING LOGIN & LOGOUT__________

// const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const navbarLogoutBtn = document.querySelector(".navbar-logout-btn");

if (loggedInUser && loggedInUser.userRole === "admin") {
  console.log("userLoggedIn", loggedInUser);
} else {
  window.location.href = "./authentication.html";
}

let authToken = JSON.parse(localStorage.getItem("authToken"));

navbarLogoutBtn.addEventListener("click", async () => {
  // localStorage.removeItem("loggedInUser");
  // localStorage.removeItem("authToken");
  // window.location.href = "./authentication.html";
  try {
    let logoutUserResponse = await usersRequests.logoutUser(authToken);

    if (
      logoutUserResponse.status === 200 ||
      logoutUserResponse.status === 201 ||
      logoutUserResponse.status === 401 ||
      logoutUserResponse.status === 403
    ) {
      let deletedUser = await logoutUserResponse.json();
      console.log("LOGGED OUT SUCCESSFULL", deletedUser);

      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("authToken");
      window.location.href = "./authentication.html";
    } else {
      console.log("User session not updated");
    }
  } catch (error) {
    console.log("error sending User session deletion request", error);
  }
});

// _________________________
const logoutAfterTokenExp = () => {
  localStorage.removeItem("loggedInUser");
      localStorage.removeItem("authToken");
      window.location.href = "./authentication.html";
}

const refreshUserProfile = () => {
  document.querySelector(".hero-user-name").innerText = user.userName;
  document.querySelector(".hero-user-profession").innerText =
    user.userProfession;
  document.querySelector(".about-me-text p").innerText = user.userAbout;
  // document.querySelector(
  //   ".contact-links .user-whatsapp"
  // ).href = `https://wa.me/${user.userNumber}`;
  // document.querySelector(
  //   ".contact-links .user-email"
  // ).href = `mailto://${user.userEmail}`;

  let img = document.createElement("img");
  img.src = user.userImgSrc;
  document.querySelector(".about-me-user-image").innerHTML = "";
  document.querySelector(".about-me-user-image").appendChild(img);
};

refreshUserProfile();

// _________PROFILE____________

let updatePortfolioModal = document.querySelector("#update-portfolio-modal");
let updatePortfolioModalForm = document.querySelector(
  "#update-portfolio-modal form"
);
let updatePortfolioBtn = document.querySelector(".update-profile-btn");
let updatePortfolioModalClose = document.querySelector(
  ".update-portfolio-close-btn"
);

let updateUserNameInput = document.querySelector(".update-portfolio-user-name");
let updateUserNumberInput = document.querySelector(
  ".update-portfolio-user-number"
);
let updateUserAboutInput = document.querySelector(
  ".update-portfolio-user-about"
);
let updateUserEmailInput = document.querySelector(
  ".update-portfolio-user-email"
);
let updateUserPasswordInput = document.querySelector(
  ".update-portfolio-user-password"
);
let updateUserProfessionInput = document.querySelector(
  ".update-portfolio-user-profession"
);
let updateUserImgSrcInput = document.querySelector(".update-portfolio-img-src");

updatePortfolioBtn.addEventListener("click", (e) => {
  updateUserNameInput.value = user.userName || "";
  updateUserNumberInput.value = user.userNumber || "";
  // updateUserImgSrcInput.value = user.userImgSrc || "";
  updateUserAboutInput.value = user.userAbout || "";
  updateUserEmailInput.value = user.userEmail || "";
  updateUserPasswordInput.value = user.userPassword || "";
  updateUserProfessionInput.value = user.userProfession || "";

  updatePortfolioModal.showModal();
});

updatePortfolioModalForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    !updateUserNameInput.value ||
    !updateUserNumberInput.value ||
    !updateUserEmailInput.value ||
    !updateUserPasswordInput.value ||
    !updateUserProfessionInput.value ||
    !updateUserAboutInput.value
  ) {
    alert("Some fields are empty");
  } else {
    user.userName = updateUserNameInput.value;
    user.userNumber = updateUserNumberInput.value;
    user.userEmail = updateUserEmailInput.value;
    user.userPassword = updateUserPasswordInput.value;
    user.userProfession = updateUserProfessionInput.value;
    user.userAbout = updateUserAboutInput.value;
    // user.userImgSrc = updateUserImgSrcInput.value;
    // let userPortfolioImg = updateUserImgSrcInput.files[0]
    // if(userPortfolioImg) {
    //   user.userImgSrc = URL.createObjectURL(userPortfolioImg);
    // }

    let imgFile = updateUserImgSrcInput.files[0];
    // will user FileReader() to read and get base 64 image's link
    let reader = new FileReader();
    reader.onload = async function (e) {
      // storing base 64 image link generated
      user.userImgSrc = e.target.result;

      // Since reader.onload event function that is passed executes asynchronously and it executes when file reading process completes so due to that delat rest of the code (below) would run before it could save image's linkto user.userImgSrc that's why all the rest of the code (below) is dependent on the imgSrc to be sotred and tht's why instead writing rest of the code inside of onload event function instead of outside as rest of the code would execute first
      // let allUsersData = JSON.parse(localStorage.getItem("usersData"));
      // console.log("allusersdata", user, allUsersData);
      // allUsersData = allUsersData.filter(
      //   (userData) => userData.userId !== user.userId
      // );
      // console.log("allusersdata", user, allUsersData);
      // allUsersData.push(user);
      // localStorage.setItem("usersData", JSON.stringify(allUsersData));

      let authToken = JSON.parse(localStorage.getItem("authToken"));
      try {
        let updateUserResponse = await usersRequests.updateUser(
          user,
          user.userId,
          authToken
        );

        if (
          updateUserResponse.status === 201 ||
          updateUserResponse.status === 200
        ) {
          user = await updateUserResponse.json();
          localStorage.setItem("loggedInUser", JSON.stringify(user));
          // refreshUserProfile();
          refreshUserProfile();
        } else if (updateUserResponse.status === 403) {
          logoutAfterTokenExp();
        } else {
          alert("user not updated");
          console.log("user not updated");
        }
      } catch (error) {
        console.log("ERROR UPDATING USER", error);
        alert("ERROR UPDATING USER");
      }

      // localStorage.setItem("loggedInUser", JSON.stringify(user));

      // refreshUserProfile();

      updatePortfolioModal.close();
    };
    reader.readAsDataURL(imgFile);

    // let allUsersData = JSON.parse(localStorage.getItem("usersData"));
    // console.log("allusersdata", user, allUsersData);
    // allUsersData = allUsersData.filter(
    //   (userData) => userData.userId !== user.userId
    // );
    // console.log("allusersdata", user, allUsersData);
    // allUsersData.push(user);
    // localStorage.setItem("usersData", JSON.stringify(allUsersData));
    // localStorage.setItem("loggedInUser", JSON.stringify(user));

    // refreshUserProfile();
  }
});

updatePortfolioModalClose.addEventListener("click", (e) => {
  updatePortfolioModal.close();
});

// ________NAVIGATIONS HANDLE________
