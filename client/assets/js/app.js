// import authenticationRequests from "../requests/authentication.js";
import projectsRequests from "../requests/projects.js";
import usersRequests from "../requests/users.js";
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const authToken = JSON.parse(localStorage.getItem("authToken"));

const logoutAfterTokenExp = () => {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("authToken");
  window.location.href = "./authentication.html";
};

// let userProjectsData = JSON.parse(localStorage.getItem("userProjectsData"));
let userProjectsData;
try {
  // let projectsDataResponse = await projectsRequests.getProjectsByUserId(
  //   loggedInUser.userId,
  //   authToken
  // );
  let projectsDataResponse = await projectsRequests.getAllProjects(authToken);
  if (!projectsDataResponse.status === 201) {
    alert(`ERROR GETTING DATA`);
  } else if (projectsDataResponse.status === 403) {
    logoutAfterTokenExp();
  } else {
    userProjectsData = await projectsDataResponse.json();

    if (userProjectsData.length <= 0) {
      userProjectsData = [];
    }
    console.log("ALL USERS DATA", userProjectsData);
  }
} catch (e) {
  console.log("ERROR GETTING PROJECTS", e);
}

// __________CHECKING LOGIN & LOGOUT__________

// const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const navbarLogoutBtn = document.querySelector(".navbar-logout-btn");

if (loggedInUser && loggedInUser.userRole === "user") {
  console.log("userLoggedIn", loggedInUser);
} else {
  window.location.href = "./authentication.html";
}

navbarLogoutBtn.addEventListener("click", async () => {
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

  // localStorage.removeItem("loggedInUser");
  // localStorage.removeItem("authToken");

  // window.location.href = "./authentication.html";
});

// __________APPENDING PROJECTS DYNAMICALLY__________

const allProjectsSection = document.querySelector(
  ".projects .projects-inner .all-projects"
);
let updateProjectDataForm = document.querySelector(
  ".update-project-inner form"
);
let updateProjectDataFormBtn = document.querySelector(
  ".update-project-inner form button"
);
let updateProjectFrameworksContainer = document.querySelector(
  ".update-project-frameworks-container"
);
let updateProjectFrameworksInput = document.querySelector(
  ".update-project-frameworks-input input"
);
let updateProjectFrameworksAdd = document.querySelector(
  ".update-project-frameworks-input a"
);

let updateProjectLanguagesContainer = document.querySelector(
  ".update-project-languages-container"
);
let updateProjectLanguagesInput = document.querySelector(
  ".update-project-languages-input input"
);
let updateProjectLanguagesAdd = document.querySelector(
  ".update-project-languages-input a"
);

let updateProjectTagsContainer = document.querySelector(
  ".update-project-tags-container"
);
let updateProjectTagsInput = document.querySelector(
  ".update-project-tags-input input"
);
let updateProjectTagsAdd = document.querySelector(
  ".update-project-tags-input a"
);
// project's input field
let updateProjectFormTitleInput = document.querySelector(
  ".update-project-inner form #update-project-title"
);

let updateProjectFormDescriptionInput = document.querySelector(
  ".update-project-inner form #update-project-description"
);
let updateProjectFormImgSrcInput = document.querySelector(
  ".update-project-inner form #update-project-img-src"
);

let userProjectDataForUpdate;

updateProjectFrameworksAdd.addEventListener("click", (e) => {
  e.stopPropagation();
  console.log("FW ADDEVENTLISTENER");
  userProjectDataForUpdate.value.projectFrameworks.push(
    updateProjectFrameworksInput.value
  );
  updateDialogRefreshExtrasList(
    updateProjectFrameworksContainer,
    userProjectDataForUpdate.value.projectFrameworks
  );
});

updateProjectLanguagesAdd.addEventListener("click", (e) => {
  e.stopPropagation();
  userProjectDataForUpdate.value.projectLanguages.push(
    updateProjectLanguagesInput.value
  );
  updateDialogRefreshExtrasList(
    updateProjectLanguagesContainer,
    userProjectDataForUpdate.value.projectLanguages
  );
});

updateProjectTagsAdd.addEventListener("click", (e) => {
  e.stopPropagation();
  userProjectDataForUpdate.value.projectTags.push(updateProjectTagsInput.value);
  updateDialogRefreshExtrasList(
    updateProjectTagsContainer,
    userProjectDataForUpdate.value.projectTags
  );
});

const refreshProjects = (itemsContainer, items) => {
  if (items.length > 0)
    items = items.filter((item) => item.userId === loggedInUser.userId);
  items.forEach((item) => {
    let newProject = document.createElement("article");
    newProject.classList.add("project");
    newProject.id = item.projectId;

    newProject.innerHTML = `<div class="project-text">
    <h3>${item.projectHeading}</h3>
    <div>
      <p>${item.projectDescription}</p>
    </div>
    <div class="project-btns">
      <button class="btn-primary blue-gradient-text">See Live</button>
      <button class="blue-gradient-text">Source Code</button>
    </div>
    <div class="project-update-delete-btns">
      <button id=${item.projectId} class="project-delete-btn">Delete</button>
      <button class="project-update-btn">Update</button>
    </div>
  </div>
  <picture id=${item.projectId}>
    <img src=${item.projectImageLink} alt="">
  </picture>`;
    itemsContainer.appendChild(newProject);

    // UPDATING PROJECT

    let updateProjectModal = document.querySelector("#update-project-modal");
    let updateProjectBtn = newProject.querySelector(".project-update-btn");
    let updateProjectCloseBtn = document.querySelector(
      "#update-project-modal .update-project-close-btn"
    );

    updateProjectBtn.addEventListener("click", () => {
      let projectId = updateProjectBtn.parentNode.parentNode.parentNode.id;
      // let userProjectData = userProjectsData.find(
      //   (project) => project.projectId === Number(projectId)
      // );

      // storing project's data in an object rather than simply assigning it to a variable. as objects are passed (as a func arg or var) as reference which means when i change that func's or var's value the original object also changes and we needed it bcz we're implementing update frameworks, tags, etc outside of loop
      let userProjectData = {
        value: userProjectsData.find(
          (project) => project.projectId === Number(projectId)
        ),
      };

      userProjectDataForUpdate = userProjectData;

      updateProjectFormTitleInput.value = userProjectData.value.projectHeading;
      updateProjectFormDescriptionInput.value =
        userProjectData.value.projectDescription;
      // updateProjectFormImgSrcInput.value =
      //   userProjectData.value.projectImageLink;

      updateProjectFrameworksContainer.innerHTML = "";
      updateProjectLanguagesContainer.innerHTML = "";
      updateProjectTagsContainer.innerHTML = "";

      userProjectData.value.projectFrameworks.forEach((framework) => {
        console.log("FW FOREACH");
        updateProjectFrameworksContainer.innerHTML += `<span>${framework}</span>`;
        updateProjectFrameworksContainer.addEventListener("click", (e) => {
          if (e.target.tagName === "SPAN") {
            let spanContent = e.target.textContent;
            console.log(userProjectData.value.projectFrameworks);
            userProjectData.value.projectFrameworks =
              userProjectData.value.projectFrameworks.filter(
                (framework) => framework !== spanContent
              );
            console.log(userProjectData.value.projectFrameworks);

            updateDialogRefreshExtrasList(
              updateProjectFrameworksContainer,
              userProjectData.value.projectFrameworks
            );
          }
          e.stopPropagation();
        });
      });

      userProjectData.value.projectLanguages.forEach((framework) => {
        updateProjectLanguagesContainer.innerHTML += `<span>${framework}</span>`;
        updateProjectLanguagesContainer.addEventListener("click", (e) => {
          if (e.target.tagName === "SPAN") {
            let spanContent = e.target.textContent;
            console.log(userProjectData.value.projectLanguages);
            userProjectData.value.projectLanguages =
              userProjectData.value.projectLanguages.filter(
                (framework) => framework !== spanContent
              );
            console.log(userProjectData.value.projectLanguages);

            updateDialogRefreshExtrasList(
              updateProjectLanguagesContainer,
              userProjectData.value.projectLanguages
            );
          }
          e.stopPropagation();
        });
      });

      userProjectData.value.projectTags.forEach((framework) => {
        updateProjectTagsContainer.innerHTML += `<span>${framework}</span>`;
        updateProjectTagsContainer.addEventListener("click", (e) => {
          if (e.target.tagName === "SPAN") {
            let spanContent = e.target.textContent;
            console.log(userProjectData.value.projectTags);
            userProjectData.value.projectTags =
              userProjectData.value.projectTags.filter(
                (framework) => framework !== spanContent
              );
            console.log(userProjectData.value.projectTags);

            updateDialogRefreshExtrasList(
              updateProjectTagsContainer,
              userProjectData.value.projectTags
            );
          }
          e.stopPropagation();
        });
      });

      let updateProjectForm = document.querySelector(
        ".update-project-inner form"
      );
      updateProjectForm.addEventListener("submit", async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (
          updateProjectFormTitleInput.value === "" ||
          updateProjectFormDescriptionInput.value === "" ||
          updateProjectFormImgSrcInput.value === "" ||
          userProjectData.value.projectTags.length === 0 ||
          userProjectData.value.projectLanguages.length === 0 ||
          userProjectData.value.projectFrameworks.length === 0
        ) {
          alert("Fill in the empty fields.");
        } else {
          userProjectData.value.projectHeading =
            updateProjectFormTitleInput.value;
          userProjectData.value.projectDescription =
            updateProjectFormDescriptionInput.value;
          // userProjectData.value.projectImageLink =
          //   updateProjectFormImgSrcInput.value;
          let imgFile = updateProjectFormImgSrcInput.files[0];
          let reader = new FileReader();
          reader.onload = async function (e) {
            userProjectData.value.projectImageLink = e.target.result;

            let i = userProjectsData.findIndex(
              (p) => p.projectId === userProjectData.value.projectId
            );

            // userProjectsData[i] = userProjectData.value;
            // localStorage.setItem(
            //   "userProjectsData",
            //   JSON.stringify(userProjectsData)
            // );

            try {
              let updateProjectResponse = await projectsRequests.updateProject(
                userProjectData.value,
                projectId,
                authToken
              );

              if (
                updateProjectResponse.status === 201 ||
                updateProjectResponse.status === 200
              ) {
                userProjectData.value = await updateProjectResponse.json();
                userProjectsData[i] = userProjectData.value;
                // userProjectsData.push(userProjectData.value)
                console.log(userProjectData.value, "project data");
              } else if (updateProjectResponse.status === 403) {
                logoutAfterTokenExp();
              } else {
                alert("Project not updated");
                console.log("Project not updated");
              }
            } catch (e) {
              alert("update project request not send!");
              console.log("error sending update project request", e);
            }

            addNewDataAndRefresh(userProjectData.value, allProjectsContainer);

            updateProjectModal.close();
          };
          reader.readAsDataURL(imgFile);

          // let i = userProjectsData.findIndex(
          //   (p) => p.projectId === userProjectData.value.projectId
          // );
          // userProjectsData[i] = userProjectData.value;
          // localStorage.setItem(
          //   "userProjectsData",
          //   JSON.stringify(userProjectsData)
          // );

          // addNewDataAndRefresh(userProjectData.value, allProjectsContainer);

          // updateProjectModal.close();

          // updateProjectFormTitleInput.value = ""
          //     updateProjectFormDescriptionInput.value = ""
          //     updateProjectFormImgSrcInput.value = ""
          updateProjectLanguagesContainer.innerHTML = "";
          updateProjectFrameworksContainer.innerHTML = "";
          updateProjectTagsContainer.innerHTML = "";
        }
      });

      updateProjectModal.showModal();
    });

    updateProjectCloseBtn.addEventListener("click", () => {
      updateProjectModal.close();
    });

    // DELETING PROJECT
    let projectDelBtn = newProject.querySelector(".project-delete-btn");
    projectDelBtn.addEventListener("click", async (e) => {
      // console.log(projectId);
      console.log(userProjectsData);

      try {
        // let deleteProjectResponse =
        //   await projectsRequests.deleteProjectByProjectId(
        //     projectDelBtn.id,
        //     authToken
        //   );
        let deleteProjectResponse =
          await projectsRequests.deleteProjects(
            projectDelBtn.id,
            authToken
          );

        if (
          deleteProjectResponse.status === 201 ||
          deleteProjectResponse.status === 200
        ) {
          let deletedProject = await deleteProjectResponse.json();
          userProjectsData = userProjectsData.filter(
            (project) => project.projectId !== Number(projectDelBtn.id)
          );
        } else if (deleteProjectResponse.status === 403) {
          logoutAfterTokenExp();
        } else {
          alert("Project not updated");
          console.log("Project not updated");
        }
      } catch (error) {
        alert("delete project request not send!");
        console.log("error sending delete project request", e);
      }

      // userProjectsData = userProjectsData.filter(
      //   (project) => project.projectId !== Number(projectDelBtn.id)
      // );
      // localStorage.setItem(
      //   "userProjectsData",
      //   JSON.stringify(userProjectsData)
      // );

      allProjectsContainer.innerHTML = "";
      allProjectsDeleteBtns = document.querySelectorAll(".project-delete-btn");
      refreshProjects(allProjectsContainer, userProjectsData);

      console.log(userProjectsData);
    });

    // PROJECT MODAL DISPLAY

    let projectPicture = newProject.querySelector(".project picture");
    projectPicture.addEventListener("click", (event) => {
      console.log(event.currentTarget.id);
      const currentTargetId = event.currentTarget.id;
      const project = userProjectsData.find(
        (project) => project.projectId === Number(currentTargetId)
      );

      // Adding data in modal
      const projectModalH3 = document.querySelector(".project-modal h3");
      projectModalH3.innerText = project.projectHeading;

      const projectModalImg = document.querySelector(
        ".project-modal picture img"
      );
      projectModalImg.setAttribute("src", project.projectImageLink);

      const projectModalP = document.querySelector(".project-modal p");
      projectModalP.innerText = project.projectDescription;

      const projectModalLanguagesContainer = document.querySelector(
        ".project-languages .languages-container"
      );
      const projectModalFrameworksContainer = document.querySelector(
        ".project-frameworks .frameworks-container"
      );
      const projectModalTagsContainer = document.querySelector(
        ".project-tags .tags-container"
      );
      // resetting previous project's data from containers
      projectModalLanguagesContainer.innerHTML = "";
      projectModalFrameworksContainer.innerHTML = "";
      projectModalTagsContainer.innerHTML = "";
      project.projectLanguages.forEach(
        (i) => (projectModalLanguagesContainer.innerHTML += `<li>${i}</li>`)
      );
      project.projectFrameworks.forEach(
        (i) => (projectModalFrameworksContainer.innerHTML += `<li>${i}</li>`)
      );
      project.projectTags.forEach(
        (i) => (projectModalTagsContainer.innerHTML += `<li>${i}</li>`)
      );

      // Display modal to show all project's details
      projectDialog.showModal();
      event.stopPropagation();
    });
  });
};
refreshProjects(allProjectsSection, userProjectsData);

// __________Project's Modal to display all details of a project__________

const projectArticles = document.querySelectorAll(".project");
const projectArticlesPictures = document.querySelectorAll(".project picture");
const projectDialog = document.getElementById("project-modal-dialog");
const projectDialogCloseBtn = document.querySelector(
  "#project-modal-dialog .project-modal-close-btn"
);

// Closing project model
projectDialogCloseBtn.addEventListener("click", () => {
  console.log("closing modal");
  projectDialog.close();
});

// ________PROJECTS CRUD__________

// Update project

let allProjectsContainer = document.querySelector(".all-projects");
let allProjects = document.querySelectorAll(".project");
let allProjectsDeleteBtns = document.querySelectorAll(".project-delete-btn");

// Updating project

// Creating new project

const addNewProjectModal = document.querySelector("#add-new-project-modal");
const addNewProjectBtn = document.querySelector(".add-new-project-btn");
const addNewProjectCloseBtn = document.querySelector(
  "#add-new-project-modal .add-new-project-close-btn"
);

addNewProjectBtn.addEventListener("click", () => {
  addNewProjectModal.showModal();
  console.log("HEY ADD PROJECT");
});
console.log("ADNEWPROJBTN", addNewProjectBtn);

addNewProjectCloseBtn.addEventListener("click", () => {
  addNewProjectModal.close();
});

// SETUP OF ADDING, TAGS, LANGS:
const addNewProjectTagsInput = document.querySelector(
  ".add-new-project-tags-input input"
);
const addNewProjectTagsContainer = document.querySelector(
  ".add-new-project-tags-container"
);
const addNewProjectTags = document.querySelectorAll(
  ".add-new-project-tags-container span"
);
const addNewProjectTagsBtn = document.querySelector(
  ".add-new-project-tags-input a"
);
let userProjectTags = [];

addNewProjectTagsBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  let addNewProjectTagsInputValue = addNewProjectTagsInput.value;
  userProjectTags.push(addNewProjectTagsInputValue);

  addNewProjectTagsContainer.innerHTML += `<span>${addNewProjectTagsInputValue}</span>`;
  console.log(userProjectTags);

  addNewProjectTagsContainer.addEventListener("click", (e) => {
    event.stopPropagation();

    if (e.target.tagName === "SPAN") {
      let spanContent = e.target.textContent;
      userProjectTags = userProjectTags.filter((tag) => tag !== spanContent);
      console.log(userProjectTags);
      addNewProjectTagsContainer.removeChild(e.target);
    }
  });
});

const addNewProjectlanguagesInput = document.querySelector(
  ".add-new-project-languages-input input"
);
const addNewProjectlanguagesContainer = document.querySelector(
  ".add-new-project-languages-container"
);
const addNewProjectlanguages = document.querySelectorAll(
  ".add-new-project-languages-container span"
);
const addNewProjectlanguagesBtn = document.querySelector(
  ".add-new-project-languages-input a"
);
let userProjectlanguages = [];

addNewProjectlanguagesBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  let addNewProjectlanguagesInputValue = addNewProjectlanguagesInput.value;
  userProjectlanguages.push(addNewProjectlanguagesInputValue);

  addNewProjectlanguagesContainer.innerHTML += `<span>${addNewProjectlanguagesInputValue}</span>`;
  console.log(userProjectlanguages);

  addNewProjectlanguagesContainer.addEventListener("click", (e) => {
    event.stopPropagation();

    if (e.target.tagName === "SPAN") {
      let spanContent = e.target.textContent;
      userProjectlanguages = userProjectlanguages.filter(
        (tag) => tag !== spanContent
      );
      console.log(userProjectlanguages);
      addNewProjectlanguagesContainer.removeChild(e.target);
    }
  });
});

// add languages
const addNewProjectframeworksInput = document.querySelector(
  ".add-new-project-frameworks-input input"
);
const addNewProjectframeworksContainer = document.querySelector(
  ".add-new-project-frameworks-container"
);
const addNewProjectframeworks = document.querySelectorAll(
  ".add-new-project-frameworks-container span"
);
const addNewProjectframeworksBtn = document.querySelector(
  ".add-new-project-frameworks-input a"
);
let userProjectframeworks = [];

addNewProjectframeworksBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  let addNewProjectframeworksInputValue = addNewProjectframeworksInput.value;
  userProjectframeworks.push(addNewProjectframeworksInputValue);

  addNewProjectframeworksContainer.innerHTML += `<span>${addNewProjectframeworksInputValue}</span>`;
  console.log(userProjectframeworks);

  addNewProjectframeworksContainer.addEventListener("click", (e) => {
    event.stopPropagation();

    if (e.target.tagName === "SPAN") {
      let spanContent = e.target.textContent;
      userProjectframeworks = userProjectframeworks.filter(
        (tag) => tag !== spanContent
      );
      console.log(userProjectframeworks);
      addNewProjectframeworksContainer.removeChild(e.target);
    }
  });
});

let addNewProjectSubmitBtn = document.querySelector(
  ".add-new-project-inner button"
);
let addNewProjectForm = document.querySelector(".add-new-project-inner form");
addNewProjectForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let addNewProjectTitle = document.querySelector("#add-new-project-title");
  let addNewProjectImgSrc = document.querySelector("#add-new-project-img-src");
  let addNewProjectDescription = document.querySelector(
    "#add-new-project-description"
  );

  if (
    addNewProjectTitle.value === "" ||
    addNewProjectDescription.value === "" ||
    addNewProjectTitle.value === "" ||
    userProjectTags.length === 0 ||
    userProjectlanguages.length === 0 ||
    userProjectframeworks.length === 0
  ) {
    alert("Fill in the empty fields.");
  } else {
    let imgFile = addNewProjectImgSrc.files[0];
    let reader = new FileReader();
    reader.onload = async function (e) {
      let projectData = {
        userId: loggedInUser.userId,
        projectId: generateId(),
        projectHeading: addNewProjectTitle.value,
        projectDescription: addNewProjectDescription.value,
        projectImageLink: e.target.result,
        projectTags: userProjectTags,
        projectLanguages: userProjectlanguages,
        projectFrameworks: userProjectframeworks,
      };

      // userProjectsData.push(data);
      // localStorage.setItem(
      //   "userProjectsData",
      //   JSON.stringify(userProjectsData)
      // );
      try {
        // let addProjectResponse = await projectsRequests.addProject(
        //   projectData,
        //   loggedInUser.userId,
        //   authToken
        // );

        let addProjectResponse = await projectsRequests.addProject(
          projectData,
          authToken
        );
        // let addProjectResponse = await projectsRequests.addProject(projectData, 33, authToken);

        if (
          addProjectResponse.status === 201 ||
          addProjectResponse.status === 200
        ) {
          projectData = await addProjectResponse.json();
          userProjectsData.push(projectData);
          console.log(projectData, "project data");
        } else if (addProjectResponse.status === 403) {
          logoutAfterTokenExp();
        } else {
          alert("Project not added");
          console.log("Project not added");
        }
      } catch (e) {
        alert("add project request not send!");
        console.log("error sending add project request", e);
      }

      addNewDataAndRefresh(projectData, allProjectsContainer);
      addNewProjectModal.close();
    };
    reader.readAsDataURL(imgFile);
  }
});

// __________FUNCTIONS_________

const generateId = () => {
  let id;
  while (true) {
    id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    if (userProjectsData.find((i) => i.projectId === id)) {
      continue;
    } else {
      break;
    }
  }
  return id;
};

const updateDialogRefreshExtrasList = (extrasContainer, extrasData) => {
  extrasContainer.innerHTML = "";
  extrasData.forEach(
    (projectExtra) =>
      (extrasContainer.innerHTML += `<span>${projectExtra}</span>`)
  );
};

const addNewDataAndRefresh = (data, container) => {
  container.innerHTML = "";
  refreshProjects(container, userProjectsData);
  addNewProjectModal.close();
};
