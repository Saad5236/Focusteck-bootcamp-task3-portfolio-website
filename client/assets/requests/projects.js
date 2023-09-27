const getAllProjects = (token) => {
  console.log("GETTING PROJECTS");
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  // Create the request options object with headers
  const requestOptions = {
    method: "GET", // or 'POST', 'PUT', 'DELETE', etc.
    headers: headers,
  };
  return fetch(
    // `http://localhost:3000/api/projects`,
    `http://localhost:3000/api/projects`,
    requestOptions
  );
};

// const getProjectsByUserId = (userId, token) => {
//   console.log("GETTING PROJECTS");
//   const headers = new Headers({
//     Authorization: `Bearer ${token}`,
//   });

//   // Create the request options object with headers
//   const requestOptions = {
//     method: "GET", // or 'POST', 'PUT', 'DELETE', etc.
//     headers: headers,
//   };
//   return fetch(
//     `http://localhost:3000/api/projects/user/${userId}`,
//     requestOptions
//   );
// };

// const addProject = (project, userId, token) => {
//   const headers = new Headers({
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   });

//   // Create the request options object with headers
//   const requestOptions = {
//     method: "POST", // or 'POST', 'PUT', 'DELETE', etc.
//     headers: headers,
//     body: JSON.stringify(project),
//   };
//   return fetch(
//     `http://localhost:3000/api/projects/user/${userId}`,
//     requestOptions
//   );
// };

const addProject = (project, token) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  // Create the request options object with headers
  const requestOptions = {
    method: "POST", // or 'POST', 'PUT', 'DELETE', etc.
    headers: headers,
    body: JSON.stringify(project),
  };
  return fetch(
    `http://localhost:3000/api/projects`,
    requestOptions
  );
};

// const updateProject = (project, projectId, token) => {
//   const headers = new Headers({
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   });

//   const requestOptions = {
//     method: "PUT",
//     headers: headers,
//     body: JSON.stringify(project),
//   };
//   return fetch(
//     `http://localhost:3000/api/projects/project/${projectId}`,
//     requestOptions
//   );
// };

const updateProject = (project, projectId, token) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const requestOptions = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(project),
  };
  return fetch(
    `http://localhost:3000/api/projects/${projectId}`,
    requestOptions
  );
};

// const deleteProjectByProjectId = (projectId, token) => {
//   const headers = new Headers({
//     Authorization: `Bearer ${token}`,
//   });

//   const requestOptions = {
//     method: "DELETE",
//     headers: headers,
//   };
//   return fetch(
//     `http://localhost:3000/api/projects/project/${projectId}`,
//     requestOptions
//   );
// };

// const deleteProjectsByUserId = (userId, token) => {
//   const headers = new Headers({
//     Authorization: `Bearer ${token}`,
//   });

//   const requestOptions = {
//     method: "DELETE",
//     headers: headers,
//   };
//   return fetch(
//     `http://localhost:3000/api/projects/user/${userId}`,
//     requestOptions
//   );
// };

const deleteProjects = (id, token) => {
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const requestOptions = {
    method: "DELETE",
    headers: headers,
  };
  return fetch(
    `http://localhost:3000/api/projects/${id}`,
    requestOptions
  );
};

// export default { getAllProjects, getProjectsByUserId, addProject, updateProject, deleteProjectByProjectId, deleteProjectsByUserId };
export default { getAllProjects, addProject, updateProject, deleteProjects };
