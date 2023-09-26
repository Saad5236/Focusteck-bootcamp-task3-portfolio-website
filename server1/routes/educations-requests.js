const generateEducationId = () => {
  let id;
  while (true) {
    id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    //   let usersData = req.users;

    if (educations && educations.find((i) => i.userEducationId === id)) {
      continue;
    } else {
      break;
    }
  }
  return id;
};

import educationControllers from "../controllers/educations.js";
import requestBodyParser from "../utils/body-parser.js";
import educations from "../data/educations.json" assert { type: "json" };
import users from "../data/users.json" assert { type: "json" };
let educationsData = educations;

export default async (req, res) => {
  if (req.url.split("/")[5] === undefined) {
    if (req.url.split("/")[3] === "user")
      var userId = Number(req.url.split("/")[4]);
    if (req.url.split("/")[3] === "education")
      var userEducationId = Number(req.url.split("/")[4]);

    // // if (req.url === "/api/educations" && req.method === "GET") {
    // //   educationControllers.getAllEducations(req, res);
    // // }

    if (userId && req.method === "GET") {
      educationControllers.getEducationsByUserId(req, res, userId);
    } 
    // if (userId) {userIdBasedApis(req, res, userId)}
    // else if (userEducationId) {educationIdBasedApis(req, res, userEducationId)}

    else if (userEducationId && req.method === "GET") {
      educationControllers.getEducationByEducationId(req, res, userEducationId);
    }

    // // else if (userId && req.method === "GET") {
    // //   let educations = educationsData.filter(
    // //     (education) => education.userId === userId
    // //   );
    // //   if (educations.length > 0) {
    // //     res.writeHead(201, { "Content-Type": "application/json" });
    // //     res.write(JSON.stringify(educations));
    // //     res.end();
    // //   } else {
    // //     res.writeHead(404, { "Content-Type": "application/json" });
    // //     res.end(
    // //       JSON.stringify({
    // //         title: "user not found",
    // //         message: "user you're trying to find does not exist.",
    // //       })
    // //     );
    // //   }
    // // }

    else if (userId && req.method === "POST") {
      educationControllers.addEducation(req, res, userId);
    } 

    else if (userEducationId && req.method === "DELETE") {
      educationControllers.deleteEducationByEducationId(
        req,
        res,
        userEducationId
      );
    } 

    else if (userId && req.method === "DELETE") {
      educationControllers.deleteEducationByUserId(req, res, userId);
    } 
    else if (userEducationId && req.method === "PUT") {
      educationControllers.updateEducation(req, res, userEducationId);
    } 
    else if (
      (!userId &&
        !userEducationId &&
        req.url === `/api/educations/user/${req.url.split("/")[4]}`) ||
      req.url === `/api/educations/education/${req.url.split("/")[4]}`
    ) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          title: "Validation Failed",
          message: "ID is not valid, so can't find user/education based on id",
        })
      );
    } else {
      res.writeHead(404, { "Content-type": "application/json" });
      res.end(
        JSON.stringify({ title: "No route!", message: "Route not found!" })
      );
    }
  } else {
    res.writeHead(404, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({ title: "Invalid route!", message: "Route not found!" })
    );
  }
};

const educationIdBasedApis = (req, res, userEducationId) => {
  if(req.method === "GET") {
      educationControllers.getEducationByEducationId(req, res, userEducationId);
  } else if(req.method === "DELETE") {
  educationControllers.deleteEducationByEducationId(
        req,
        res,
        userEducationId
      );
  } else if (req.method === "PUT") {
      educationControllers.updateEducation(req, res, userEducationId);
  } else {
    res.writeHead(404, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({ title: "not a valid route!", message: "Route not found!" })
    );
  }
}

const userIdBasedApis = (req, res, userId) => {
  if(req.method === "GET") {
    educationControllers.getEducationsByUserId(req, res, userId);
  } else if(req.method === "DELETE") {
    educationControllers.deleteEducationByUserId(req, res, userId);
  } else if (req.method === "POST") {
    educationControllers.addEducation(req, res, userId);
  } else {
    res.writeHead(404, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({ title: "not valid route!", message: "Route not found!" })
    );
  }
}
