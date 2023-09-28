// const getSkills = (userId, token) => {
//     console.log("GETTING skills");
//     const headers = new Headers({
//       Authorization: `Bearer ${token}`,
//     });
  
//     // Create the request options object with headers
//     const requestOptions = {
//       method: "GET", // or 'POST', 'PUT', 'DELETE', etc.
//       headers: headers,
//     };
//     return fetch(
//       `http://localhost:3000/api/skills/user/${userId}`,
//       requestOptions
//     );
//   };

const getSkills = (token) => {
  console.log("GETTING skills");
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  // Create the request options object with headers
  const requestOptions = {
    method: "GET", // or 'POST', 'PUT', 'DELETE', etc.
    headers: headers,
  };
  return fetch(
    `http://localhost:3000/api/skills`,
    requestOptions
  );
};
  
  // const addSkill = (skill, userId, token) => {
  //   const headers = new Headers({
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   });
  
  //   // Create the request options object with headers
  //   const requestOptions = {
  //     method: "POST", // or 'POST', 'PUT', 'DELETE', etc.
  //     headers: headers,
  //     body: JSON.stringify(skill),
  //   };
  //   return fetch(
  //     `http://localhost:3000/api/skills/user/${userId}`,
  //     requestOptions
  //   );
  // };

  const addSkill = (skill, token) => {
    const headers = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  
    // Create the request options object with headers
    const requestOptions = {
      method: "POST", // or 'POST', 'PUT', 'DELETE', etc.
      headers: headers,
      body: JSON.stringify(skill),
    };
    return fetch(
      `http://localhost:3000/api/skills`,
      requestOptions
    );
  };
  
  // const deleteSkill = (skillId, token) => {
  //   const headers = new Headers({
  //     Authorization: `Bearer ${token}`,
  //   });
  
  //   const requestOptions = {
  //     method: "DELETE",
  //     headers: headers,
  //   };
  //   return fetch(
  //     `http://localhost:3000/api/skills/skill/${skillId}`,
  //     requestOptions
  //   );
  // };

  // const deleteSkillsByUserId = (skillId, token) => {
  //   const headers = new Headers({
  //     Authorization: `Bearer ${token}`,
  //   });
  
  //   const requestOptions = {
  //     method: "DELETE",
  //     headers: headers,
  //   };
  //   return fetch(
  //     `http://localhost:3000/api/skills/user/${skillId}`,
  //     requestOptions
  //   );
  // };

  const deleteSkills = (id, token) => {
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });
  
    const requestOptions = {
      method: "DELETE",
      headers: headers,
    };
    return fetch(
      `http://localhost:3000/api/skills/${id}`,
      requestOptions
    );
  };
  
  export default {
    getSkills,
    addSkill,
    deleteSkills
    // deleteSkill,
    // deleteSkillsByUserId
  };
  