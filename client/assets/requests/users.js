const updateUser = (userData, userId, token) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const requestOptions = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(userData),
  };
  return fetch(`http://localhost:3000/api/users/${userId}`, requestOptions);
};

const getAllUsers = (token) => {
  console.log("GETTING USERS");
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  // Create the request options object with headers
  const requestOptions = {
    method: "GET", // or 'POST', 'PUT', 'DELETE', etc.
    headers: headers,
  };
  return fetch(
    `http://localhost:3000/api/users`,
    requestOptions
  );
};

const deleteUser = (userId, token) => {
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const requestOptions = {
    method: "DELETE",
    headers: headers,
  };
  return fetch(
    `http://localhost:3000/api/users/${userId}`,
    requestOptions
  );
};

const logoutUser = (token) => {
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });

  const requestOptions = {
    method: "DELETE",
    headers: headers,
  };
  return fetch(
    `http://localhost:3000/api/logout`,
    requestOptions
  );
};

const addUser = (user, token) => {
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  // Create the request options object with headers
  const requestOptions = {
    method: "POST", // or 'POST', 'PUT', 'DELETE', etc.
    headers: headers,
    body: JSON.stringify(user),
  };
  return fetch(
    `http://localhost:3000/api/users`,
    requestOptions
  );
};

export default { getAllUsers, updateUser, deleteUser, logoutUser, addUser };
