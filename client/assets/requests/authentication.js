const loginUser = (credentials) => {
  return fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(credentials),
  });
};

const signupUser = (userData) => {
  return fetch("http://localhost:3000/api/signup", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(userData),
  });
};
export default { loginUser, signupUser };
