// import jwt from "jsonwebtoken";

import authenticationControllers from "../controllers/users.js";
// import requestBodyParser from "../utils/body-parser.js";
// import users from "../data/users.json" assert { type: "json" };
// let usersData = users;
// // const secretKey = "my-secret-key";

export default async (req, res) => {
  console.log("POST HELO");

  if (req.url.split("/")[3] === undefined) {
    if (req.url.split("/")[2] === "login" && req.method === "POST") {
      authenticationControllers.loginUser(req, res);
    } else if (req.url.split("/")[2] === "signup" && req.method === "POST") {
      console.log("SIGNUP user 1");
      authenticationControllers.signupUser(req, res, "signup");
    } else if (req.url.split("/")[2] === "logout" && req.method === "DELETE") {
      authenticationControllers.logoutUser(req, res);
    }
  } else {
    res.writeHead(404, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({ title: "Invalid route!", message: "Route not found!" })
    );
  }
};
