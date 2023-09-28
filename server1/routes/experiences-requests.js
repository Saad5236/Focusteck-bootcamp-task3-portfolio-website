// export default async (req, res) => {};
const generateExperienceId = () => {
  let id;
  while (true) {
    id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    //   let usersData = req.users;

    if (experiences && experiences.find((i) => i.userExperienceId === id)) {
      continue;
    } else {
      break;
    }
  }
  return id;
};

import experienceControllers from "../controllers/experiences.js";
import requestBodyParser from "../utils/body-parser.js";
import middlewares from "../utils/middleware.js";
import experiences from "../data/experiences.json" assert { type: "json" };
import users from "../data/users.json" assert { type: "json" };
let experiencesData = experiences;

// export default async (req, res) => {
//   if (req.url.split("/")[5] === undefined) {
//     if (req.url.split("/")[3] === "user")
//       var userId = Number(req.url.split("/")[4]);
//     if (req.url.split("/")[3] === "experience")
//       var userExperienceId = Number(req.url.split("/")[4]);

//     // if (req.url === "/api/experiences" && req.method === "GET") {
//     //   res.statusCode = 200;
//     //   res.setHeader("Content-type", "application/json");
//     //   res.write(JSON.stringify(experiencesData));
//     //   res.end();
//     // }

//     // // if (userId && req.method === "GET") {

//     if (userId && req.method === "GET") {
//       experienceControllers.getExperiencesByUserId(req, res, userId);
//     }
//     // if(userId) {userIdBasedApis(req, res, userId)}
//     // else if(userExperienceId) {experienceIdBasedApis(req, res, userExperienceId)}
//     else if (userExperienceId && req.method === "GET") {
//       experienceControllers.getExperienceByExperienceId(
//         req,
//         res,
//         userExperienceId
//       );
//     } else if (userId && req.method === "POST") {
//       experienceControllers.addExperience(req, res, userId);
//     } else if (userExperienceId && req.method === "DELETE") {
//       experienceControllers.deleteExperienceByExperienceId(
//         req,
//         res,
//         userExperienceId
//       );
//     } else if (userId && req.method === "DELETE") {
//       experienceControllers.deleteExperiencesByUserId(req, res, userId);
//     } else if (userExperienceId && req.method === "PUT") {
//       experienceControllers.updateExperienceByExperienceId(
//         req,
//         res,
//         userExperienceId
//       );
//     } else if (
//       (!userId &&
//         !userExperienceId &&
//         req.url === `/api/experiences/user/${req.url.split("/")[4]}`) ||
//       req.url === `/api/experiences/experience/${req.url.split("/")[4]}`
//     ) {
//       console.log("FAILED TO GET VALID ID");

//       res.writeHead(400, { "Content-Type": "application/json" });
//       res.end(
//         JSON.stringify({
//           title: "Validation Failed",
//           message: "ID is not valid, so can't find user/experience based on id",
//         })
//       );
//     } else {
//       res.writeHead(404, { "Content-type": "application/json" });
//       res.end(
//         JSON.stringify({ title: "Not found", message: "Route not found!" })
//       );
//     }
//   } else {
//     res.writeHead(404, { "Content-type": "application/json" });
//     res.end(
//       JSON.stringify({ title: "Not found", message: "Route not found!" })
//     );
//   }
// };

// const experienceIdBasedApis = (req, res, userExperienceId) => {
//   if (req.method === "GET") {
//     experienceControllers.getExperienceByExperienceId(
//       req,
//       res,
//       userExperienceId
//     );
//   } else if (req.method === "DELETE") {
//     experienceControllers.deleteExperienceByExperienceId(
//       req,
//       res,
//       userExperienceId
//     );
//   } else if (req.method === "PUT") {
//     experienceControllers.updateExperienceByExperienceId(
//       req,
//       res,
//       userExperienceId
//     );
//   } else {
//     res.writeHead(404, { "Content-type": "application/json" });
//     res.end(
//       JSON.stringify({
//         title: "not a valid route!",
//         message: "Route not found!",
//       })
//     );
//   }
// };

export default async (req, res) => {
  let pathSegements = req.url.split("/");
  console.log("SEGMENTS", pathSegements);

  if (pathSegements[4] === undefined) {
    if (pathSegements[3] === undefined) {
      if (req.method === "GET") {
        experienceControllers.getExperiences(req, res);
      } else if (req.method === "POST") {
        experienceControllers.addExperience(req, res);
      } else {
        console.log("path", pathSegements);
        middlewares.returnError(req, res, 404, "not found", "Route not found");
      }
    } else {
      let id = Number(pathSegements[3]);
      if (id) {
        if (req.method === "PUT") {
          experienceControllers.updateExperience(req, res, id);
        } else if (req.method === "DELETE") {
          experienceControllers.deleteExperiences(req, res, id);
        }
      } else {
        console.log("path", pathSegements);
        middlewares.returnError(
          req,
          res,
          400,
          "Invalid ID",
          "Invalid experience/user Id"
        );
      }
    }
  } else {
    console.log("path", pathSegements);
    middlewares.returnError(req, res, 404, "not found", "Route not found");
  }
};
