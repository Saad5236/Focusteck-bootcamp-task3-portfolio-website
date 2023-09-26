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

import requestBodyParser from "../utils/body-parser.js";
import experiences from "../data/experiences.json" assert { type: "json" };
import middlewares from "../utils/middleware.js";
import users from "../data/users.json" assert { type: "json" };
let experiencesData = experiences;

const getExperiencesByUserId = (req, res, userId) => {
  middlewares.authenticateToken(req, res, () => {
    if (req.user.userRole === "user") {
      let experiences = experiencesData.filter(
        (experience) => experience.userId === userId
      );
      if (experiences.length > 0) {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.write(JSON.stringify(experiences));
        res.end();
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            title: "experience(s) not found",
            message: "experience(s) you're trying to find does not exist.",
          })
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

const getExperienceByExperienceId = (req, res, userExperienceId) => {
  middlewares.authenticateToken(req, res, () => {
    if (req.user.userRole === "user") {
      let experience = experiencesData.find(
        (experience) => experience.userExperienceId === userExperienceId
      );
      if (experience) {
        res.writeHead(201, { "Content-Type": "application/json" });
        res.write(JSON.stringify(experience));
        res.end();
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            title: "experience not found",
            message: "experience you're trying to find does not exist.",
          })
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

const addExperience = (req, res, userId) => {
  middlewares.authenticateToken(req, res, async () => {
    if (req.user.userRole === "user") {
      if (!users.find((u) => u.userId === userId)) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            title: "User not found",
            message: "User for which you are adding experience does not exist.",
          })
        );
      } else {
        try {
          let body = await requestBodyParser(req);
          body.userExperienceId = generateExperienceId();
          body.userId = userId;
          experiencesData.push(body);
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
        "admin unauthorized",
        "admin not authorized to acces this api"
      );
    }
  });
};

const deleteExperiencesByUserId = (req, res, userId) => {
  middlewares.authenticateToken(req, res, () => {
    if (req.user.userRole === "admin") {
      res.setHeader("Content-Type", "application/json");

      let removedExperiences = experiencesData.filter(
        (experience) => experience.userId === userId
      );
      if (removedExperiences.length > 0) {
        for (let i = 0; i < experiencesData.length; i++) {
          if (experiencesData[i].userId === userId) {
            experiencesData.splice(i, 1);
            i--;
          }
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(removedExperiences));
        res.end();
      } else {
        res.statusCode = 404;
        res.write(
          JSON.stringify({
            title: "Not Found",
            message: "User's experiences not found in database",
          })
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

const deleteExperienceByExperienceId = (req, res, userExperienceId) => {
  middlewares.authenticateToken(req, res, () => {
    if (req.user.userRole === "user") {
      res.setHeader("Content-Type", "application/json");

      let removedExperience = experiencesData.find(
        (experience) => experience.userExperienceId === userExperienceId
      );
      if (removedExperience) {
        for (let i = 0; i < experiencesData.length; i++) {
          if (experiencesData[i].userExperienceId === userExperienceId) {
            experiencesData.splice(i, 1);
            break;
          }
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(removedExperience));
        res.end();
        console.log("removedExperience", removedExperience);
      } else {
        res.statusCode = 404;
        res.write(
          JSON.stringify({
            title: "Not Found",
            message: "experience not found in database",
          })
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

const updateExperienceByExperienceId = (req, res, userExperienceId) => {
  middlewares.authenticateToken(req, res, async () => {
    if (req.user.userRole === "user") {
      try {
        let body = await requestBodyParser(req);
        let updateExperienceIndex = experiencesData.findIndex(
          (u) => u.userExperienceId === userExperienceId
        );

        if (updateExperienceIndex === -1) {
          console.log("NOOO");
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              title: "experience not found",
              message: "experience you're trying to update does not exist.",
            })
          );
          // res.statusCode = 404;
          // res.write(
          //   JSON.stringify({ title: "Not Found", message: "experience not found" })
          // );
        } else {
          console.log("YES");
          body.userExperienceId = userExperienceId;
          experiencesData[updateExperienceIndex] = body;
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(experiencesData[updateExperienceIndex]));
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

export default {
  getExperiencesByUserId,
  getExperienceByExperienceId,
  addExperience,
  deleteExperiencesByUserId,
  deleteExperienceByExperienceId,
  updateExperienceByExperienceId,
};
