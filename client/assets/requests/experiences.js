const getExperiences = (userId, token) => {
    console.log("GETTING experiences");
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });
  
    // Create the request options object with headers
    const requestOptions = {
      method: "GET", // or 'POST', 'PUT', 'DELETE', etc.
      headers: headers,
    };
    return fetch(
      `http://localhost:3000/api/experiences/user/${userId}`,
      requestOptions
    );
  };
  
  const addExperience = (experience, userId, token) => {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  
    // Create the request options object with headers
    const requestOptions = {
      method: "POST", // or 'POST', 'PUT', 'DELETE', etc.
      headers: headers,
      body: JSON.stringify(experience),
    };
    return fetch(
      `http://localhost:3000/api/experiences/user/${userId}`,
      requestOptions
    );
  };
  
  const updateExperience = (experience, experienceId, token) => {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  
    const requestOptions = {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(experience),
    };
    return fetch(
      `http://localhost:3000/api/experiences/experience/${experienceId}`,
      requestOptions
    );
  };
  
  const deleteExperience = (experienceId, token) => {
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });
  
    const requestOptions = {
      method: "DELETE",
      headers: headers,
    };
    return fetch(
      `http://localhost:3000/api/experiences/experience/${experienceId}`,
      requestOptions
    );
  };

  const deleteExperiencesByUserId = (userId, token) => {
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });
  
    const requestOptions = {
      method: "DELETE",
      headers: headers,
    };
    return fetch(
      `http://localhost:3000/api/experiences/user/${userId}`,
      requestOptions
    );
  };
  
  export default {
    getExperiences,
    addExperience,
    updateExperience,
    deleteExperience,
    deleteExperiencesByUserId
  };
  