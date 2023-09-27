// __________CHECKING LOGIN & LOGOUT__________
import projectsRequests from "../requests/projects.js";
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const navbarLogoutBtn = document.querySelector(".navbar-logout-btn");
import usersRequests from "../requests/users.js";

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

const logoutAfterTokenExp = () => {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("authToken");
  window.location.href = "./authentication.html";
};

// ____________REFRESH PROJECTS____________
let authToken = JSON.parse(localStorage.getItem("authToken"));
let allProjectsContainer = document.querySelector(".projects-container");
// let userProjects = JSON.parse(localStorage.getItem("userProjectsData"));
let userProjects;
try {
  let projectsDataResponse = await projectsRequests.getAllProjects(authToken);
  if (
    !projectsDataResponse.status === 201 ||
    !projectsDataResponse.status === 200
  ) {
    alert(`ERROR GETTING DATA`);
  } else if (projectsDataResponse.status === 403) {
    logoutAfterTokenExp();
  } else {
    userProjects = await projectsDataResponse.json();

    if (userProjects.title) {
      userProjects = [];
    }
    console.log("ALL USERS DATA", userProjects);
  }
} catch (e) {
  console.log("ERROR GETTING PROJECTS", e);
}

const refreshProjects = (filteredProjects) => {
  allProjectsContainer.innerHTML = "";
  filteredProjects.forEach((project) => {
    let newProject = `<div class="project">
        <picture class="project-img">
          <img
            src=${project.projectImageLink}
            alt=""
          />
        </picture>
        <div class="project-text">
          <h2>${project.projectHeading}</h2>
          <div class="project-description">${project.projectDescription}</div>
        </div>
      </div>`;

    allProjectsContainer.innerHTML += newProject;
  });
};

refreshProjects(userProjects);

// __________SEARCH PROJECTS FUNCTIONALITY____________

const searchProjectsInput = document.querySelector(".search-projects input");
searchProjectsInput.addEventListener("input", (e) => {
  const searchQuery = searchProjectsInput.value.toLowerCase();
  filterProjects(searchQuery);
});

const filterProjects = (searchQuery) => {
  let filteredProjects = userProjects.filter((project) => {
    // const projectName = project.projectHeading.toLowerCase();
    const projectTags = project.projectTags.map((tag) => tag.toLowerCase());
    const projectLanguages = project.projectLanguages.map((tag) =>
      tag.toLowerCase()
    );
    const projectFrameworks = project.projectFrameworks.map((tag) =>
      tag.toLowerCase()
    );

    return (
      //   projectName.startsWith(searchQuery) ||
      projectTags.some((tag) => tag.startsWith(searchQuery)) ||
      projectLanguages.some((language) => language.startsWith(searchQuery)) ||
      projectFrameworks.some((framework) => framework.startsWith(searchQuery))
    );
  });

  refreshProjects(filteredProjects);
};
