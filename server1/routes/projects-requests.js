const generateProjectId = () => {
  let id;
  while (true) {
    id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    //   let projectsData = req.users;

    if (projects && projects.find((i) => i.projectId === id)) {
      continue;
    } else {
      break;
    }
  }
  return id;
};

import projectControllers from "../controllers/projects.js";
import middlewares from "../utils/middleware.js";
import requestBodyParser from "../utils/body-parser.js";
import projects from "../data/projects.json" assert { type: "json" };
import users from "../data/users.json" assert { type: "json" };
let projectsData = projects;

// export default async (req, res) => {
//   if (req.url.split("/")[5] === undefined) {
//     // let userId, projectId;
//     if (req.url.split("/")[3] === "user")
//       var userId = Number(req.url.split("/")[4]);
//     if (req.url.split("/")[3] === "project")
//       var projectId = Number(req.url.split("/")[4]);

//     console.log(userId, projectId);

//     // get all projects
//     if (req.url === "/api/projects" && req.method === "GET") {
//       projectControllers.getAllProjects(req, res);
//       // projectControllers.getProjects(req, res, null);
//     } // get single project based on projectId
//     else if (projectId && req.method === "GET") {
//       projectControllers.getProjectByProjectId(req, res, projectId);
//     } // get multiple projects based on userId
//     else if (userId && req.method === "GET") {
//       projectControllers.getProjectsByUserId(req, res, userId);
//       // projectControllers.getProjects(req, res, userId);
//     } // post new project
//     else if (userId && req.method === "POST") {
//       projectControllers.addProjectByUserId(req, res, userId);
//     } // delete single project based on projectId
//     else if (projectId && req.method === "DELETE") {
//       projectControllers.deleteProjectByProjectId(req, res, projectId);
//     } // delete multiple projects based on userId
//     else if (userId && req.method === "DELETE") {
//       projectControllers.deleteProjectByUserId(req, res, userId);
//     } // update project
//     else if (projectId && req.method === "PUT") {
//       projectControllers.updateProjectByProjectId(req, res, projectId);
//     } // if user enters a non numeric project/user id
//     else if (
//       (!userId &&
//         !projectId &&
//         req.url === `/api/projects/user/${req.url.split("/")[4]}`) ||
//       req.url === `/api/projects/project/${req.url.split("/")[4]}`
//     ) {
//       console.log("FAILED TO GET VALID ID");

//       res.writeHead(400, { "Content-Type": "application/json" });
//       res.end(
//         JSON.stringify({
//           title: "Validation Failed",
//           message: "ID is not valid, so can't find user/project based on id",
//         })
//       );
//     } else {
//       res.writeHead(404, { "Content-type": "application/json" });
//       res.end(
//         JSON.stringify({ title: "No route", message: "Route not found!" })
//       );
//     }
//   } else {
//     res.writeHead(404, { "Content-type": "application/json" });
//     res.end(
//       JSON.stringify({ title: "Not found", message: "Route not found!" })
//     );
//   }
// };

export default async (req, res) => {
  let pathSegements = req.url.split("/");
  console.log("SEGMENTS",pathSegements);

  if(pathSegements[4] === undefined) {
    if(pathSegements[3] === undefined) {
      if(req.method === "GET") {
        projectControllers.getAllProjects(req, res);
      } else if (req.method === "POST") {
        projectControllers.addProject(req, res);
      } 
      // else if (req.method === "DELETE") {
        
      // } 
      else {
        console.log("path", pathSegements);
        middlewares.returnError(req, res, 404, "not found", "Route not found");
      }
    } else {
      let id = Number(pathSegements[3]);
      if(id) {
        
      // if (req.method === "GET") {

      // } 
      if (req.method === "PUT") {
        projectControllers.updateProjectByProjectId(req, res, id);
      } else if (req.method === "DELETE") {
        projectControllers.deleteProject(req, res, id);
      }
      } else {
        console.log("path", pathSegements);
        middlewares.returnError(req, res, 400, "Invalid ID", "Invalid project/user Id");
      }
    }
  } else {
    console.log("path", pathSegements);
    middlewares.returnError(req, res, 404, "not found", "Route not found");
  }
}