// const getEducations = (userId, token) => {
//   console.log("GETTING EDUCATIONS");
//   const headers = new Headers({
//     Authorization: `Bearer ${token}`,
//   });

//   // Create the request options object with headers
//   const requestOptions = {
//     method: "GET", // or 'POST', 'PUT', 'DELETE', etc.
//     headers: headers,
//   };
//   return fetch(
//     `http://localhost:3000/api/educations/user/${userId}`,
//     requestOptions
//   );
// };

const getEducations = (token) => {
  console.log("GETTING EDUCATIONS");
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  // Create the request options object with headers
  const requestOptions = {
    method: "GET", // or 'POST', 'PUT', 'DELETE', etc.
    headers: headers,
  };
  return fetch(`http://localhost:3000/api/educations`, requestOptions);
};

// const addEducation = (education, userId, token) => {
//   const headers = new Headers({
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   });

//   // Create the request options object with headers
//   const requestOptions = {
//     method: "POST", // or 'POST', 'PUT', 'DELETE', etc.
//     headers: headers,
//     body: JSON.stringify(education),
//   };
//   return fetch(
//     `http://localhost:3000/api/educations/user/${userId}`,
//     requestOptions
//   );
// };

const addEducation = (education, token) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  // Create the request options object with headers
  const requestOptions = {
    method: "POST", // or 'POST', 'PUT', 'DELETE', etc.
    headers: headers,
    body: JSON.stringify(education),
  };
  return fetch(`http://localhost:3000/api/educations`, requestOptions);
};

// const updateEducation = (education, educationId, token) => {
//   const headers = new Headers({
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   });

//   const requestOptions = {
//     method: "PUT",
//     headers: headers,
//     body: JSON.stringify(education),
//   };
//   return fetch(
//     `http://localhost:3000/api/educations/education/${educationId}`,
//     requestOptions
//   );
// };

const updateEducation = (education, educationId, token) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const requestOptions = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(education),
  };
  return fetch(
    `http://localhost:3000/api/educations/${educationId}`,
    requestOptions
  );
};

// const deleteEducation = (educationId, token) => {
//   const headers = new Headers({
//     Authorization: `Bearer ${token}`,
//   });

//   const requestOptions = {
//     method: "DELETE",
//     headers: headers,
//   };
//   return fetch(
//     `http://localhost:3000/api/educations/education/${educationId}`,
//     requestOptions
//   );
// };

const deleteEducation = (id, token) => {
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const requestOptions = {
    method: "DELETE",
    headers: headers,
  };
  return fetch(`http://localhost:3000/api/educations/${id}`, requestOptions);
};

// const deleteEducationsByUserId = (userId, token) => {
//   const headers = new Headers({
//     Authorization: `Bearer ${token}`,
//   });

//   const requestOptions = {
//     method: "DELETE",
//     headers: headers,
//   };
//   return fetch(
//     `http://localhost:3000/api/educations/user/${userId}`,
//     requestOptions
//   );
// };

export default {
  getEducations,
  addEducation,
  updateEducation,
  deleteEducation,
  // deleteEducationsByUserId
};
