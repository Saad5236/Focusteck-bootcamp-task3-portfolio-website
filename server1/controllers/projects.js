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

import requestBodyParser from "../utils/body-parser.js";
import projects from "../data/projects.json" assert { type: "json" };
import middlewares from "../utils/middleware.js";
import users from "../data/users.json" assert { type: "json" };
let projectsData = projects;

const getAllProjects = (req, res) => {
  middlewares.authenticateToken(req, res, () => {
    // let projects;
    console.log("role", req.user.userRole);
    if (req.user.userRole === "admin") {
      if (projectsData.length > 0) {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.write(JSON.stringify(projectsData));
        res.end();
      } else {
        middlewares.returnError(
          req,
          res,
          404,
          "project not found",
          "project you're trying to find does not exist."
        );
      }

      // projects = projectsData;
    } else if (req.user.userRole === "user") {
      middlewares.returnError(
        req,
        res,
        401,
        "user unauthorized",
        "user not authorized to acces this api"
      );
      // projects = projectsData.filter(
      //     (project) => project.userId === userId
      //   );
    }
    // if (projects.length > 0) {
    //     res.writeHead(201, { "Content-Type": "application/json" });
    //     res.write(JSON.stringify(projects));
    //     res.end();
    //   } else {
    //     middlewares.returnError(
    //       req,
    //       res,
    //       404,
    //       "projects not found",
    //       "projects you're trying to find does not exist."
    //     );
    //   }
  });
};

const getProjectByProjectId = (req, res, projectId) => {
  middlewares.authenticateToken(req, res, () => {
    if (req.user.userRole === "user") {
      let project = projectsData.find(
        (project) => project.projectId === projectId
      );
      if (project) {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.write(JSON.stringify(project));
        res.end();
      } else {
        middlewares.returnError(
          req,
          res,
          404,
          "Project not found",
          "Project you're trying to find does not exist."
        );
      }
    } else {
      middlewares.returnError(
        req,
        res,
        401,
        "admin unauthorized",
        "admin not authorized to acces this api"
      );
    }
  });
};

const getProjects = (req, res, userId) => {
  middlewares.authenticateToken(req, res, () => {
    let projects = [];
    if (req.user.userRole === "admin" && userId === null) {
      projects = projectsData;
    } else if (req.user.userRole === "user" && userId !== null) {
      projects = projectsData.filter(
        (project) => project.userId === userId
      );
    }
    if (projects.length > 0) {
      res.writeHead(201, { "Content-Type": "application/json" });
      res.write(JSON.stringify(projects));
      res.end();
    } else {
      middlewares.returnError(
        req,
        res,
        404,
        "project not found",
        "project you're trying to find does not exist."
      );
    }
  })
}

const getProjectsByUserId = (req, res, userId) => {
  middlewares.authenticateToken(req, res, () => {
    if (req.user.userRole === "user") {
      let projects = projectsData.filter(
        (project) => project.userId === userId
      );
      if (projects.length > 0) {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.write(JSON.stringify(projects));
        res.end();
      } else {
        middlewares.returnError(
          req,
          res,
          404,
          "project not found",
          "project you're trying to find does not exist."
        );
      }
    } else {
      middlewares.returnError(
        req,
        res,
        401,
        "admin unauthorized",
        "admin not authorized to acces this api"
      );
    }
  });
};

const addProjectByUserId = async (req, res, userId) => {
  middlewares.authenticateToken(req, res, async () => {
    if (req.user.userRole === "user") {
      if (!users.find((u) => u.userId === userId)) {
        console.log("USER IS NOT FOUND");
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            title: "User not found",
            message: "User for which you are adding project does not exist.",
          })
        );
      } else {
        console.log(
          "USER",
          users.find((u) => u.userId === userId)
        );

        try {
          let body = await requestBodyParser(req);
          body.projectId = generateProjectId();
          body.userId = userId;
          projectsData.push(body);
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify(body));
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
      }
    } else {
      middlewares.returnError(
        req,
        res,
        401,
        "user unauthorized",
        "user not authorized to acces this api"
      );
    }
  });
};

const deleteProjectByProjectId = async (req, res, projectId) => {
  middlewares.authenticateToken(req, res, () => {
    if (req.user.userRole === "user") {
      res.setHeader("Content-Type", "application/json");

      let removedProject = projectsData.find(
        (project) => project.projectId === projectId
      );
      if (removedProject) {
        // projectsData = projectsData.filter(
        //   (project) => project.projectId !== projectId
        // );

        for (let i = 0; i < projectsData.length; i++) {
          if (projectsData[i].projectId === projectId) {
            projectsData.splice(i, 1);
            break;
          }
        }

        // projectsData.forEach((project, i) => {
        //   if (project.projectId === projectId) {
        //     projectsData.splice(i, 1);
        //   }
        // });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(removedProject));
        res.end();
        console.log("removedProject", removedProject);
      } else {
        middlewares.returnError(
          req,
          res,
          404,
          "Not found.",
          "Project not found in database."
        );

        res.end();
      }
    } else {
      middlewares.returnError(
        req,
        res,
        401,
        "admin unauthorized",
        "admin not authorized to acces this api"
      );
    }
  });
};

const deleteProjectByUserId = async (req, res, userId) => {
  middlewares.authenticateToken(req, res, () => {
    if (req.user.userRole === "admin") {
      res.setHeader("Content-Type", "application/json");

      let removedProjects = projectsData.filter(
        (project) => project.userId === userId
      );
      if (removedProjects.length > 0) {
        // projectsData = projectsData.filter(
        //   (project) => project.userId !== userId
        // );

        for (let i = 0; i < projectsData.length; i++) {
          if (projectsData[i].userId === userId) {
            projectsData.splice(i, 1);
            i--;
          }
        }

        // projectsData.forEach((project, i) => {
        //   if (project.userId === userId) {
        //     projectsData.splice(i, 1);
        //   }
        // });

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(removedProjects));
        res.end();
      } else {
        middlewares.returnError(
          req,
          res,
          404,
          "Projects not found",
          "User's Projects not found in database"
        );
        res.end();
      }
    } else {
      middlewares.returnError(
        req,
        res,
        401,
        "user unauthorized",
        "user not authorized to acces this api"
      );
    }
  });
};

const updateProjectByProjectId = (req, res, projectId) => {
  middlewares.authenticateToken(req, res, async () => {
    if (req.user.userRole === "user") {
      try {
        let body = await requestBodyParser(req);
        let updateProjectIndex = projectsData.findIndex(
          (u) => u.projectId === projectId
        );

        if (updateProjectIndex === -1) {
          console.log("NOOO");
          middlewares.returnError(
            req,
            res,
            404,
            "project not found",
            "project you're trying to update does not exist."
          );
          //   res.writeHead(404, { "Content-Type": "application/json" });
          //   res.end(
          //     JSON.stringify({
          //       title: "project not found",
          //       message: "project you're trying to update does not exist.",
          //     })
          //   );

          // res.statusCode = 404;
          // res.write(
          //   JSON.stringify({ title: "Not Found", message: "Project not found" })
          // );
        } else {
          console.log("YES");
          body.projectId = projectId;
          projectsData[updateProjectIndex] = body;
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(projectsData[updateProjectIndex]));
        }
      } catch (e) {
        console.log(e);
        // res.writeHead(400, { "Content-Type": "application/json" });
        // res.end(
        //   JSON.stringify({
        //     title: "Validation Failed",
        //     message: "Request body is not in valid format",
        //   })
        // );
        middlewares.returnError(
          req,
          res,
          400,
          "validation failed",
          "Request body is not in valid format."
        );
      }
    } else {
      middlewares.returnError(
        req,
        res,
        401,
        "admin is unauthorized",
        "Admin is not allowd to access this api."
      );
    }
  });
};

export default {
  getAllProjects,
  getProjects,
  getProjectByProjectId,
  getProjectsByUserId,
  addProjectByUserId,
  deleteProjectByProjectId,
  deleteProjectByUserId,
  updateProjectByProjectId,
};
