const PORT = 3000;
import http from "http";
import url from "url"
import cors from "cors";
import middlewares from "./utils/middleware.js";
import authenticationRequests from "../../../../Resources/useless/authentication-requests.js";
import authenticationControllers from "./controllers/users.js";
import usersRequests from "./routes/users-requests.js";
import projectsRequests from "./routes/projects-requests.js";
import educationsRequests from "./routes/educations-requests.js";
import experiencesRequests from "./routes/experiences-requests.js";
import skillsRequests from "./routes/skills-requests.js";

let server = http.createServer((req, res) => {
  // const corsOptions = {
  //   origin: '*', // Replace with the actual origin of your frontend app
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow the HTTP methods you need
  //   optionsSuccessStatus: 204, // Send 204 No Content for preflight requests
  //   credentials: true, // Enable sending cookies and HTTP authentication
  // };
  // Use the cors middleware with the configured options
  cors()(req, res, () => {
    // res.writeHead(200, { 'Content-Type': 'application/json' });
    // res.end(JSON.stringify({ message: 'Hello, CORS is configured!' }));

    if (req.url.split("/")[1] === "api") {
      let urlType = req.url.split("/")[2];

      // if (urlType === "login" || urlType === "signup" || urlType === "logout") {
      //   authenticationRequests(req, res);
      // }
      if (req.url.split("/")[2] === "login" && req.method === "POST") {
        authenticationControllers.loginUser(req, res);
      } else if (req.url.split("/")[2] === "signup" && req.method === "POST") {
        console.log("SIGNUP user 1");
        // authenticationControllers.signupUser(req, res, "signup");
        authenticationControllers.addNewUser(req, res, "signup");
      } else if (
        req.url.split("/")[2] === "logout" &&
        req.method === "DELETE"
      ) {
        authenticationControllers.logoutUser(req, res);
      } else {
        // middlewares.authenticateToken(req, res, () => {});
        if (urlType === "users") {
          usersRequests(req, res);
        } else if (urlType === "projects") {
          projectsRequests(req, res);
        } else if (urlType === "experiences") {
          experiencesRequests(req, res);
        } else if (urlType === "educations") {
          educationsRequests(req, res);
        } else if (urlType === "skills") {
          skillsRequests(req, res);
        } else {
          console.log("SHAT");
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json"); // to send our response in json format then
          // res.writeHead(404, { "Content-Type": "application/json" });
          res.write(
            JSON.stringify({ title: "Not found", message: "Route not found" })
          );
          res.end();
        }
      }
    } else {
      console.log("SHiT");

      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json"); // to send our response in json format then

      // res.writeHead(404, { "Content-Type": "application/json" });
      res.write(
        JSON.stringify({ title: "Not found", message: "Route not found" })
      );
      res.end();
    }
  });
});

// running server on port 3000
server.listen(PORT, () => {
  console.log(`server connected on port ${PORT}`);
});
