// __________CHECKING LOGIN & LOGOUT__________
import usersRequests from "../requests/users.js";
import projectsRequests from "../requests/projects.js";
import educationsRequests from "../requests/educations.js";
import experiencesRequests from "../requests/experiences.js";
import skillsRequests from "../requests/skills.js";
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const navbarLogoutBtn = document.querySelector(".navbar-logout-btn");

if (loggedInUser && loggedInUser.userRole === "admin") {
  console.log("userLoggedIn", loggedInUser);
} else {
  window.location.href = "./authentication.html";
}

navbarLogoutBtn.addEventListener("click", async () => {
  // localStorage.removeItem("loggedInUser");
  // localStorage.removeItem("authToken");
  // window.location.href = "./authentication.html";
  try {
    let logoutUserResponse = await usersRequests.logoutUser(authToken);

    if (
      logoutUserResponse.status === 200 ||
      logoutUserResponse.status === 201
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

// navbarLogoutBtn.addEventListener("click", () => {
//   localStorage.removeItem("loggedInUser");
//   window.location.href = "./authentication.html";
// });

// ___________CREATE ADMIN/USER___________

const deleteUserAllData = async (userId, authToken) => {
  try {
    const [projectsDelRes, educationsDelRes, experiencesDelRes, skillsDelRes] =
      await Promise.all([
        projectsRequests.deleteProjectsByUserId(userId, authToken),
        educationsRequests.deleteEducationsByUserId(userId, authToken),
        experiencesRequests.deleteExperiencesByUserId(userId, authToken),
        skillsRequests.deleteSkillsByUserId(userId, authToken),
      ]);
    if (projectsDelRes.status === 200) {
      let delProjects = await projectsDelRes.json();
      console.log("deleted projects", delProjects);
      // filterAndRefreshUsers(allUsersData);
    }
    if (educationsDelRes.status === 200) {
      let delEducations = await educationsDelRes.json();
      console.log("deleted educations", delEducations);
    }
    if (experiencesDelRes.status === 200) {
      let delExperiences = await experiencesDelRes.json();
      console.log("deleted experiences", delExperiences);
    }
    if (skillsDelRes.status === 200) {
      let delSkills = await skillsDelRes.json();
      console.log("deleted skills", delSkills);
    } else {
      console.log("UNABLE TO DELETE DATA FROM BACKEND");
      alert("UNABLE TO DELETE DATA FROM BACKEND");
    }
  } catch (error) {
    console.log("ERROR SENDING DELETE USER REQUEST");
    alert("ERROR SENDING DELETE USER REQUEST");
  }
};

const refreshUsers = (filteredUsers) => {
  allUsersContainer.innerHTML = "";

  filteredUsers.forEach((user) => {
    let newUserContent = `<h3 class="user-name">${user.userName}</h3>
        <div class="user-email">Email: <span>${user.userEmail}</span></div>
        <div class="user-role">Role: <span>${user.userRole}</span></div>
        <div class="user-number">Phone no: <span>${user.userNumber}</span></div>
        <div class="user-btns">
            <button class="user-delete">Delete</button>
            <button class="user-update" id=${user.userId}>Update</button>
        </div>`;

    let userContainer = document.createElement("div");
    userContainer.classList.add("user");
    userContainer.id = user.userId;
    userContainer.innerHTML = newUserContent;

    allUsersContainer.appendChild(userContainer);

    // DELETE FUNCTIONALITY
    const userDeleteBtn = userContainer.querySelector(".user-delete");
    userDeleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      let userId = userDeleteBtn.parentNode.parentNode.id;
      let foundUser = allUsersData.find((u) => u.userId === Number(userId));
      console.log("chidvochd", allUsersData);
      try {
        let deleteUserResponse = await usersRequests.deleteUser(
          userId,
          authToken
        );
        if (
          deleteUserResponse.status === 201 ||
          deleteUserResponse.status === 200 ||
          deleteUserResponse.status === 204
        ) {
          alert("USER DELETED");
          allUsersData = allUsersData.filter(
            (user) => user.userId !== Number(userId)
          );
          console.log("CHECKING USER ROLE", foundUser.userRole, foundUser);
          if (foundUser.userRole === "user") {
            deleteUserAllData(Number(userId), authToken);
          }
          filterAndRefreshUsers(allUsersData);
        } else if (deleteUserResponse.status === 403) {
          logoutAfterTokenExp();
        } else {
          console.log("UNABLE TO DELETE DATA FROM BACKEND");
          alert("UNABLE TO DELETE DATA FROM BACKEND");
        }
      } catch (error) {
        console.log("ERROR SENDING DELETE USER REQUEST");
        alert("ERROR SENDING DELETE USER REQUEST");
      }
      // allUsersData = allUsersData.filter(
      //   (user) => user.userId !== Number(userId)
      // );
      // allUsersProjects = allUsersProjects.filter(
      //   (project) => project.userId !== Number(userId)
      // );
      // allUsersEducations = allUsersEducations.filter(
      //   (education) => education.userId !== Number(userId)
      // );
      // allUsersExperiences = allUsersExperiences.filter(
      //   (experience) => experience.userId !== Number(userId)
      // );

      // localStorage.setItem("usersData", JSON.stringify(allUsersData));
      // localStorage.setItem(
      //   "userProjectsData",
      //   JSON.stringify(allUsersProjects)
      // );
      // localStorage.setItem(
      //   "userEducationsData",
      //   JSON.stringify(allUsersEducations)
      // );
      // localStorage.setItem(
      //   "userExperiencesData",
      //   JSON.stringify(allUsersExperiences)
      // );

      // refreshUsers(allUsersData);
    });

    // UPDATE FUNCTIONALITY
    const updateUserBtn = userContainer.querySelector(".user-update");
    updateUserBtn.addEventListener("click", (e) => {
      // e.stopPropagation();
      console.log("userid", user.userId);

      //getting id from html
      userIdForUpdate = user.userId;

      document.querySelector("#update-fullname").value = user.userName;
      document.querySelector("#update-phonenumber").value = user.userNumber;
      document.querySelector("#update-email").value = user.userEmail;
      // document.querySelector("#update-password").value = user.userPassword;
      document.querySelector("#update-password").value = "";
      console.log("UPDATE USER PASS", user.userPassword);

      updateUserModal.showModal();
    });
  });
};
const logoutAfterTokenExp = () => {
  localStorage.removeItem("loggedInUser");
      localStorage.removeItem("authToken");
      window.location.href = "./authentication.html";
}

const filterAndRefreshUsers = (allUsers) => {
  let currentLoggedInAdmin = JSON.parse(localStorage.getItem("loggedInUser"));
  refreshUsers(
    allUsers.filter((u) => u.userId !== currentLoggedInAdmin.userId) || []
  );
};

// const generateId = () => {
//   let id;
//   while (true) {
//     id = Math.floor(Math.random() * (999999 - 100000) + 100000);
//     let usersData = JSON.parse(localStorage.getItem("usersData"));

//     if (usersData && usersData.find((i) => i.userId === id)) {
//       continue;
//     } else {
//       break;
//     }
//   }
//   return id;
// };

const addUserBtn = document.querySelector(".add-user-btn button");
const addUserCloseBtn = document.querySelector(".add-user-close-btn");
const updateUserCloseBtn = document.querySelector(".update-user-close-btn");
const addUserModal = document.querySelector("#add-user-modal");
const updateUserModal = document.querySelector("#update-user-modal");
const addUserModalForm = document.querySelector("#add-user-modal form");
const updateUserModalForm = document.querySelector("#update-user-modal form");
const addUserModalFormBtn = document.querySelector(
  "#add-user-modal form button"
);
const updateUserModalFormBtn = document.querySelector(
  "#update-user-modal form button"
);

// let allUsersData = JSON.parse(localStorage.getItem("usersData"));
let authToken = JSON.parse(localStorage.getItem("authToken"));
let allUsersData;
try {
  let getUsersResponse = await usersRequests.getAllUsers(authToken);
  console.log("HEY", getUsersResponse.status);
  if (getUsersResponse.status === 200 || getUsersResponse.status === 201) {
    allUsersData = await getUsersResponse.json();
    console.log("HEY2", allUsersData);
  } else if (getUsersResponse.status === 403) {
    logoutAfterTokenExp();
  } else {
    console.log("NO DATA IN BACKEND OR COULDN'T FETCH");
    allUsersData = [];
  }
} catch (error) {
  console.log("ERROR GETTING EDUCATIONS", error);
  alert("ERROR GETTING EDUCATIONS");
}
let allUsersProjects = JSON.parse(localStorage.getItem("userProjectsData"));
let allUsersEducations = JSON.parse(localStorage.getItem("userEducationsData"));
let allUsersExperiences = JSON.parse(
  localStorage.getItem("userExperiencesData")
);

const allUsersContainer = document.querySelector(".users-container");
// stores id of user which I want to update, it's used in form submission
let userIdForUpdate;

filterAndRefreshUsers(allUsersData);
// refreshUsers(allUsersData);

// UPDATE USER
updateUserModalForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("HEY");
  const updateUserFormFields = new FormData(
    updateUserModalForm,
    updateUserModalFormBtn
  );

  const updateUserName = updateUserFormFields.get("update-fullname");
  const updateUserEmail = updateUserFormFields.get("update-email");
  const updateUserNumber = updateUserFormFields.get("update-phonenumber");
  const updateUserPassword = updateUserFormFields.get("update-password");
  const updateUserRole = updateUserFormFields.get("update-role");

  if (
    updateUserName === "" ||
    updateUserEmail === "" ||
    updateUserNumber === "" ||
    updateUserPassword === ""
  ) {
    alert("SOME FIELDS ARE EMPTY");
  } else {
    // if (!allUsersData.find((data) => data.userEmail === updateUserEmail)) {
    let index = allUsersData.findIndex((u) => {
      return u.userId === userIdForUpdate;
    });

    let user = allUsersData[index];
    let previousUserRole = user.userRole;
    user.userName = updateUserName;
    user.userNumber = updateUserNumber;
    user.userEmail = updateUserEmail;
    user.userPassword = updateUserPassword;
    user.userRole = updateUserRole;

    // let authToken = JSON.parse(localStorage.getItem("authToken"));
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
        allUsersData[index] = user;
        if (previousUserRole === "user" && user.userRole === "admin") {
          console.log("deleted user's data since he's ana dmin now");
          deleteUserAllData(user.userId, authToken);
        }
        filterAndRefreshUsers(allUsersData);

        updateUserModal.close();
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

    console.log("old", allUsersData, index);

    // allUsersData[index].userName = updateUserName;
    // allUsersData[index].userNumber = updateUserNumber;
    // allUsersData[index].userEmail = updateUserEmail;
    // allUsersData[index].userPassword = updateUserPassword;
    // allUsersData[index].userRole = updateUserRole;

    // console.log("new", allUsersData, index);

    // localStorage.setItem("usersData", JSON.stringify(allUsersData));

    // let user = JSON.parse(localStorage.getItem("loggedInUser"));
    // if (user.userId === allUsersData[index].userId) {
    //   user.userName = allUsersData[index].userName;
    //   user.userNumber = allUsersData[index].userNumber;
    //   user.userEmail = allUsersData[index].userEmail;
    //   user.userPassword = allUsersData[index].userPassword;
    //   user.userRole = allUsersData[index].userRole;
    //   localStorage.setItem("loggedInUser", JSON.stringify(user));
    // }

    // refreshUsers(allUsersData);
    // updateUserModal.close();
    // } else {
    //   alert("Email already exists for someone.");
    // }
  }
});

// ADD USER
addUserBtn.addEventListener("click", (e) => {
  addUserModal.showModal();
});

addUserCloseBtn.addEventListener("click", (e) => {
  addUserModal.close();
});
updateUserCloseBtn.addEventListener("click", (e) => {
  updateUserModal.close();
});

addUserModalForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const addUserFormFields = new FormData(addUserModalForm, addUserModalFormBtn); // to fetch signup form data
  const addUserName = addUserFormFields.get("signup-fullname");
  const addUserEmail = addUserFormFields.get("signup-email");
  const addUserNumber = addUserFormFields.get("signup-phonenumber");
  const addUserPassword = addUserFormFields.get("signup-password");
  const addUserRole = addUserFormFields.get("signup-role");

  if (
    addUserName === "" ||
    addUserEmail === "" ||
    addUserNumber === "" ||
    addUserPassword === ""
  ) {
    alert("Some input fields are still empty. Fill them and try again.");
  } else {
    if (
      allUsersData &&
      !allUsersData.find((data) => data.userEmail === addUserEmail)
    ) {
      let newUserData = {
        // userId: generateId(),
        userRole: addUserRole, // alternatively admin
        userName: addUserName,
        userNumber: addUserNumber,
        userEmail: addUserEmail,
        userPassword: addUserPassword,
        userProfession: "",
        userAbout: "",
        userImgSrc: "",
      };

      try {
        let addUserResponse = await usersRequests.addUser(
          newUserData,
          authToken
        );
        if (addUserResponse.status === 201 || addUserResponse.status === 200) {
          let addUserData = await addUserResponse.json();
          // usersExperienceData.push(addUserData);
          allUsersData.push(addUserData);
          alert("SUCCESSFULLY ADDED USER");
          console.log("OH GOD YES");

          filterAndRefreshUsers(allUsersData);
          // refreshExperienceContainer();

          addUserModal.close();
        } else if (addUserResponse.status === 403) {
          logoutAfterTokenExp();
        } else {
          alert("COULDN'T ADD USER");
        }
      } catch (error) {
        alert("COULDN'T SEND REQUEST TO ADD USER");
        console.log("OH GOD NO");
        console.log("COULDN'T SEND REQUEST TO ADD USER", error);
      }

      // console.log(allUsersData);
      // allUsersData.push(newUserData);
      // console.log(allUsersData);

      // localStorage.setItem("usersData", JSON.stringify(allUsersData));

      // refreshUsers(allUsersData);
      // addUserModal.close();
    } else {
      alert("email already exists");
    }
  }
});

// _____SEARCH USER______

const searchUserInput = document.querySelector(".users-search");
searchUserInput.addEventListener("input", (e) => {
  const searchQuery = searchUserInput.value.toLowerCase();
  filterUsers(searchQuery);
});

const filterUsers = (searchQuery) => {
  let filteredUsers = allUsersData.filter((user) => {
    let userName = user.userName.toLowerCase();
    let userEmail = user.userEmail.toLowerCase();
    let userNumber = user.userNumber.toLowerCase();

    return (
      userName.includes(searchQuery) ||
      userEmail.startsWith(searchQuery) ||
      userNumber.startsWith(searchQuery)
    );
  });

  filterAndRefreshUsers(filteredUsers);
  // refreshUsers(filteredUsers);
};
