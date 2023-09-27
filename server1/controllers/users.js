const generateUserId = () => {
  let id;
  while (true) {
    id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    //   let usersData = req.users;

    if (users && users.find((i) => i.userId === id)) {
      continue;
    } else {
      break;
    }
  }
  return id;
};

import jwt from "jsonwebtoken";
import requestBodyParser from "../utils/body-parser.js";
import middlewares from "../utils/middleware.js";
import validations from "../utils/validations.js";
import sessions from "../data/sessions.json" assert { type: "json" };
import users from "../data/users.json" assert { type: "json" };
let usersData = users;

const logoutUser = (req, res) => {
  try {
    middlewares.authenticateToken(req, res, () => {
      let index = sessions.findIndex(
        (session) => session.userId === req.user.userId
      );
      if (index !== -1) {
        sessions.splice(index, 1);
        console.log("AFTER DELETION SESSION", sessions);
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(
          JSON.stringify({
            title: "Logged out successfully!",
            message: "Token is also deleted from backend.",
          })
        );
      } else {
        console.log("COULDN;t delete session");
        res.writeHead(404, { "Content-type": "application/json" });
        res.end(
          JSON.stringify({
            title: "Logged out Unsucessful",
            message: "Couldn't logout.",
          })
        );
      }
    });
  } catch (error) {
    console.log("ERROR LOGGING OUT", error);
  }
};

const loginUser = async (req, res) => {
  console.log("POST");
  try {
    let body = await requestBodyParser(req);
    if (!body.userEmail || !body.userPassword) {
      middlewares.returnError(
        req,
        res,
        400,
        "Incomplete credentials!",
        "Credentials are not complete."
      );
    } else {
      console.log(body);
      let foundUser = usersData.find(
        (user) =>
          user.userEmail === body.userEmail &&
          user.userPassword === body.userPassword
      );

      if (!foundUser) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            title: "Authentication Failed",
            message: "User's email or/and password is/are incorrect.",
          })
        );
      } else {
        // delete foundUser.userPassword;
        let user = {
          userId: foundUser.userId,
          userRole: foundUser.userRole,
          userEmail: foundUser.userEmail,
        };
        let authToken = jwt.sign(user, "my-secret-key", { expiresIn: "1h" });
        // let authToken = jwt.sign(user, "my-secret-key", { expiresIn: 30 });

        let newSession = { token: authToken, userId: foundUser.userId };
        sessions.push(newSession);
        console.log("CURRENT SESSIONS", sessions);

        let { userPassword, ...userWithoutPassword } = foundUser;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            authToken,
            userData: userWithoutPassword,
          })
        );
      }
    }
  } catch (err) {
    console.log(err);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        title: "Validation Failed",
        message: "Request body is not valid",
      })
    );
  }
};

const addNewUser = async (req, res, status) => {
  try {
    let body = await requestBodyParser(req);
    body.userId = generateUserId();
    // if (
    //   body.userName &&
    //   body.userEmail &&
    //   body.userPassword &&
    //   body.userRole &&
    //   body.userNumber
    // ) {
      // if (
      //   !validations.isValidUsername(body.userName) ||
      //   !validations.isValidNumber(body.userNumber) ||
      //   !validations.isValidEmail(body.userEmail)
      // ) {
      //   middlewares.returnError(
      //     req,
      //     res,
      //     400,
      //     "Incorrect format!",
      //     "Input data is not in correct format."
      //   );
      // } 
      // else {
        if(validations.validateUser(body)) {
          middlewares.returnError(req, res, 400, "Wrong input", "Either input data is in wrong format or it is incomplete.")
        } else {
        if (usersData.some((user) => user.userEmail === body.userEmail)) {
          res.writeHead(409, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              title: "Duplicate email",
              message: "A user already exists with same email.",
            })
          );
        } else {
          console.log("POST signup");
          usersData.push(body);

          let { userPassword, ...userWithoutPassword } = body;

          console.log("login too 1", usersData);
          if (status === "signup") {
            let user = {
              userId: body.userId,
              userRole: body.userRole,
              userEmail: body.userEmail,
            };
            let authToken = jwt.sign(user, "my-secret-key", {
              expiresIn: "1h",
            });
            console.log("login too 2", authToken);

            let newSession = { token: authToken, userId: body.userId };
            sessions.push(newSession);
            console.log("CURRENT SESSIONS FROM SIGNUP", sessions);

            // let { userPassword, ...userWithoutPassword } = body;

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                authToken,
                userData: userWithoutPassword,
              })
            );
          } else if (status === "add") {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(userWithoutPassword));
          }
        }
      }
      // }
    // } else {
      // res.writeHead(404, { "Content-Type": "application/json" });
      // res.end(
      //   JSON.stringify({
      //     title: "Incomplete data!",
      //     message: "Data Contents are not complete.",
      //   })
      // );
    // }

    // res.writeHead(201, { "Content-Type": "application/json" });
    // res.end(JSON.stringify(body));
  } catch (err) {
    console.log(err);
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        title: "Validation Failed",
        message: "Request body is not valid",
      })
    );
  }
};

const signupUser = async (req, res, status) => {
  // try {
  //   let body = await requestBodyParser(req);
  //   body.userId = generateUserId();

  //   if (usersData.some((user) => user.userEmail === body.userEmail)) {
  //     res.writeHead(409, { "Content-Type": "application/json" });
  //     res.end(
  //       JSON.stringify({
  //         title: "Duplicate email",
  //         message: "A user already exists with same email.",
  //       })
  //     );
  //   } else {
  //     console.log("POST signup");
  //     usersData.push(body);

  //     console.log("login too 1", usersData);
  //     let user = {
  //       userId: body.userId,
  //       userRole: body.userRole,
  //       userEmail: body.userEmail,
  //     };
  //     let authToken = jwt.sign(user, "my-secret-key", { expiresIn: "1h" });
  //     console.log("login too 2", authToken);

  //     let { userPassword, ...userWithoutPassword } = body;

  //     res.writeHead(200, { "Content-Type": "application/json" });
  //     res.end(
  //       JSON.stringify({
  //         authToken,
  //         userData: userWithoutPassword,
  //       })
  //     );
  //   }
  //   // res.writeHead(201, { "Content-Type": "application/json" });
  //   // res.end(JSON.stringify(body));
  // } catch (err) {
  //   console.log(err);
  //   res.writeHead(400, { "Content-Type": "application/json" });
  //   res.end(
  //     JSON.stringify({
  //       title: "Validation Failed",
  //       message: "Request body is not valid",
  //     })
  //   );
  // }

  console.log("POST signup");

  // if (status === "add") {
  middlewares.authenticateToken(req, res, () => {
    if (req.user.userRole === "admin") {
      addNewUser(req, res, status);
    } else {
      res.writeHead(401, { "Content-type": "application/json" });
      res.end(
        JSON.stringify({
          title: "User unauthorized",
          message: "User is not authrized to access this api.",
        })
      );
    }
  });
  // } else if (status === "signup") {
  //   addNewUser(req, res, status);
  // }
};

const getAllUsers = async (req, res) => {
  middlewares.authenticateToken(req, res, () => {
    console.log("role", req.user.userRole);
    if (req.user.userRole === "admin") {
      res.statusCode = 200;
      res.setHeader("Content-type", "application/json");
      let usersDataWithoutPassword = usersData.map(
        ({ userPassword, ...user }) => user
      );
      res.write(JSON.stringify(usersDataWithoutPassword));
      res.end();
    } else if (req.user.userRole === "user") {
      res.writeHead(401, { "Content-type": "application/json" });
      res.end(
        JSON.stringify({
          title: "User unauthorized",
          message: "User is not authrized to access this api.",
        })
      );
    }
  });
  // res.statusCode = 200;
  //   res.setHeader("Content-type", "application/json");
  //   res.write(JSON.stringify(usersData));
  //   res.end();
};

const getUser = async (req, res, userId) => {
  middlewares.authenticateToken(req, res, () => {
    if (req.user.userRole === "admin") {
      res.setHeader("Content-Type", "application/json");
      let user = usersData.find((u) => u.userId === userId);

      if (user) {
        res.statusCode = 200;
        let { userPassword, ...userWithoutPassword } = user;
        res.write(JSON.stringify(userWithoutPassword));
        res.end();
      } else {
        res.statusCode = 404;
        res.write(
          JSON.stringify({
            title: "Not Found",
            message: "User not found in database",
          })
        );
        res.end();
      }
    } else {
      returnError(
        req,
        res,
        401,
        "Unauthorized user",
        "User is not authrized to access this api."
      );
    }
  });
};

const deleteUser = async (req, res, userId) => {
  middlewares.authenticateToken(req, res, () => {
    if (req.user.userRole === "admin") {
      res.setHeader("Content-Type", "application/json");

      let removedUser = usersData.find((u) => u.userId === userId);
      // usersData = usersData.filter((u) => u.userId !== userId);

      // if (usersData.length > 0) {
      if (removedUser) {
        // res.statusCode = 200;
        // res.write(JSON.stringify(removedUser));
        // res.end();
        // usersData = usersData.filter((u) => u.userId !== userId);

        // usersData.forEach((user, i) => {
        //   if (user.userId === userId) {
        //     usersData.splice(i, 1);
        //   }
        // });

        for (let i = 0; i < usersData.length; i++) {
          if (usersData[i].userId === userId) {
            usersData.splice(i, 1);
            break;
          }
        }
        res.writeHead(204, { "Content-Type": "application/json" });
        res.end(JSON.stringify(removedUser));
      } else {
        res.statusCode = 404;
        res.write(
          JSON.stringify({
            title: "Not Found",
            message: "User not found in database",
          })
        );
        res.end();
      }
    } else {
      returnError(
        req,
        res,
        401,
        "Unauthorized user",
        "User is not authrized to access this api."
      );
    }
  });
};

const updateUser = async (req, res, userId) => {
  middlewares.authenticateToken(req, res, async () => {
    // if (req.user.userRole === "admin") {
    try {
      let body = await requestBodyParser(req);
      if (
        body.userName &&
        body.userEmail &&
        body.userPassword &&
        body.userRole &&
        body.userNumber
      ) {
        if (
          !validations.isValidUsername(body.userName) ||
          !validations.isValidNumber(body.userNumber) ||
          !validations.isValidEmail(body.userEmail)
        ) {
          middlewares.returnError(
            req,
            res,
            400,
            "Incorrect format!",
            "Input data is not in correct format."
          );
        } else {
          let updateUserIndex = usersData.findIndex((u) => u.userId === userId);

          if (updateUserIndex === -1) {
            console.log("NOOO");
            res.statusCode = 404;
            res.write(
              JSON.stringify({ title: "Not Found", message: "User not found" })
            );
          } else {
            console.log("YES");
            body.userId = userId;
            usersData[updateUserIndex] = body;
            let { userPassword, ...usersDataWithoutPassword } =
              usersData[updateUserIndex];
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(usersDataWithoutPassword));
          }
        }
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            title: "Incomplete data!",
            message: "Data Contents are not complete.",
          })
        );
      }
    } catch (e) {
      console.log(e);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          title: "Validation Failed",
          message: "Request body is not in valid format",
        })
      );
    }
    // } else {
    //   returnError(
    //     req,
    //     res,
    //     401,
    //     "Unauthorized user",
    //     "User is not authrized to access this api."
    //   );
    // }
  });
};

const returnError = (req, res, statusCode, title, message) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      title: title,
      message: message,
    })
  );
};

export default {
  loginUser,
  logoutUser,
  signupUser,
  addNewUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  returnError,
};
