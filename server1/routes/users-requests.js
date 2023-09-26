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

import userControllers from "../controllers/users.js";
import requestBodyParser from "../utils/body-parser.js";
import users from "../data/users.json" assert { type: "json" };
let usersData = users;
export default async (req, res) => {
  if (!req.url.split("/")[4]) {
    let userId = Number(req.url.split("/")[3]);

    if (req.url === "/api/users" && req.method === "GET") {
      userControllers.getAllUsers(req, res);
    } else if (req.method === "POST") {
      console.log("POST");
      userControllers.signupUser(req, res, "add");
      // try {
      //   let body = await requestBodyParser(req);
      //   body.userId = generateUserId();
      //   usersData.push(body);
      //   res.writeHead(201, { "Content-Type": "application/json" });
      //   res.end(JSON.stringify(body));
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
    } else if (userId && req.method === "GET") {
      userControllers.getUser(req, res, userId);
    } else if (!userId) {
      userControllers.returnError(
        req,
        res,
        400,
        "Validation Failed",
        "ID is not valid, so can't find user based on userId"
      );
    } else if (userId && req.method === "DELETE") {
      userControllers.deleteUser(req, res, userId);
    } else if (userId && req.method === "PUT") {
      userControllers.updateUser(req, res, userId);
    }
  } else {
    userControllers.returnError(req, res, 404, "Not found", "Route not found!");
    // res.writeHead(404, { "Content-type": "application/json" });
    // res.end(
    //   JSON.stringify({ title: "Not found", message: "Route not found!" })
    // );
  }
};
