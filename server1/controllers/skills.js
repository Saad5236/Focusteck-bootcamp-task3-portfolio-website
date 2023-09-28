const generateSkillId = () => {
  let id;
  while (true) {
    id = Math.floor(Math.random() * (999999 - 100000) + 100000);
    //   let usersData = req.users;

    if (skillsData && skillsData.find((i) => i.userSkillId === id)) {
      continue;
    } else {
      break;
    }
  }
  return id;
};

import requestBodyParser from "../utils/body-parser.js";
import skills from "../data/skills.json" assert { type: "json" };
import middlewares from "../utils/middleware.js";
import users from "../data/users.json" assert { type: "json" };
let skillsData = skills;

// const getSkillsByUserId = (req, res, userId) => {
//   middlewares.authenticateToken(req, res, () => {
//     if (req.user.userRole === "user") {
//       let skills = skillsData.filter((skill) => skill.userId === userId);
//       if (skills.length > 0) {
//         console.log("first", skills);
//         res.writeHead(201, { "Content-Type": "application/json" });
//         res.write(JSON.stringify(skills));
//         res.end();
//       } else {
//         res.writeHead(404, { "Content-Type": "application/json" });
//         res.end(
//           JSON.stringify({
//             title: "skills not found",
//             message: "skills you're trying to find do not exist.",
//           })
//         );
//       }
//     } else {
//       middlewares.returnError(
//         req,
//         res,
//         401,
//         "admin unauthorized",
//         "admin not authorized to acces this api"
//       );
//     }
//   });
// };

const getSkills = (req, res) => {
  middlewares.authenticateToken(req, res, () => {
    if (req.user.userRole === "user") {
      let skills = skillsData.filter(
        (skill) => skill.userId === req.user.userId
      );
      if (skills.length > 0) {
        console.log("first", skills);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(skills));
        res.end();
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            title: "skills not found",
            message: "skills you're trying to find do not exist.",
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

// const addSkill = (req, res, userId) => {
//   middlewares.authenticateToken(req, res, async () => {
//     if (req.user.userRole === "user") {
//         if (!users.find((u) => u.userId === userId)) {
//             res.writeHead(404, { "Content-Type": "application/json" });
//             res.end(
//               JSON.stringify({
//                 title: "User not found",
//                 message: "User for which you are adding skill does not exist.",
//               })
//             );
//           } else {
            
//             try {
//               let body = await requestBodyParser(req);
//               body.userSkillId = generateSkillId();
//               body.userId = userId;
//               skillsData.push(body);
//               res.writeHead(201, { "Content-Type": "application/json" });
//               res.end(JSON.stringify(body));
//             } catch (err) {
//               console.log(err);
//               middlewares.returnError(
//                 req,
//                 res,
//                 400,
//                 "validation failed",
//                 "Request body is not valid"
//               );
//             }
          
//           }
//     } else {
//       middlewares.returnError(
//         req,
//         res,
//         401,
//         "admin unauthorized",
//         "admin not authorized to acces this api"
//       );
//     }
//   });
// };

const addSkill = (req, res) => {
  middlewares.authenticateToken(req, res, async () => {
    if (req.user.userRole === "user") {
      if (!users.find((u) => u.userId === req.user.userId)) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            title: "User not found",
            message:
              "Your user data is not in db so you can't add new skill.",
          })
        );
      } else {
        try {
          let body = await requestBodyParser(req);
          body.userSkillId = generateSkillId();
          body.userId = req.user.userId;
          skillsData.push(body);
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

// const deleteSkillBySkillId = (req, res, userSkillId) => {
//   middlewares.authenticateToken(req, res, () => {
//     if (req.user.userRole === "user") {
//       res.setHeader("Content-Type", "application/json");

//       let removedSkill = skillsData.find(
//         (skill) => skill.userSkillId === userSkillId
//       );
//       if (removedSkill) {
//         for (let i = 0; i < skillsData.length; i++) {
//           if (skillsData[i].userSkillId === userSkillId) {
//             skillsData.splice(i, 1);
//             break;
//           }
//         }
//         res.writeHead(200, { "Content-Type": "application/json" });
//         res.write(JSON.stringify(removedSkill));
//         res.end();
//         console.log("removedSkill", removedSkill);
//       } else {
//         res.statusCode = 404;
//         res.write(
//           JSON.stringify({
//             title: "Not Found",
//             message: "skill not found in database",
//           })
//         );
//         res.end();
//       }
//     } else {
//       middlewares.returnError(
//         req,
//         res,
//         401,
//         "admin unauthorized",
//         "admin not authorized to access this api"
//       );
//     }
//   });
// };

// const deleteSkillsByUserId = (req, res, userId) => {
//   middlewares.authenticateToken(req, res, () => {
//     if (req.user.userRole === "admin") {
//       res.setHeader("Content-Type", "application/json");

//       let removedSkills = skillsData.filter(
//         (skill) => skill.userId === userId
//       );
//       if (removedSkills.length > 0) {
//         for (let i = 0; i < skillsData.length; i++) {
//           if (skillsData[i].userId === userId) {
//             skillsData.splice(i, 1);
//             i--;
//           }
//         }

//         res.writeHead(200, { "Content-Type": "application/json" });
//         res.write(JSON.stringify(removedSkills));
//         res.end();
//       } else {
//         res.statusCode = 404;
//         res.write(
//           JSON.stringify({
//             title: "Not Found",
//             message: "User's skills not found in database",
//           })
//         );
//         res.end();
//       }
//     } else {
//       middlewares.returnError(
//         req,
//         res,
//         401,
//         "user unauthorized",
//         "user not authorized to acces this api"
//       );
//     }
//   });
// };

const deleteSkills = async (req, res, id) => {
  middlewares.authenticateToken(req, res, () => {
    if (req.user.userRole === "admin") {
      res.setHeader("Content-Type", "application/json");

      let removedSkills = skillsData.filter(
        (skill) => skill.userId === id
      );
      if (removedSkills.length > 0) {
        for (let i = 0; i < skillsData.length; i++) {
          if (skillsData[i].userId === id) {
            skillsData.splice(i, 1);
            i--;
          }
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(removedSkills));
        res.end();
      } else {
        middlewares.returnError(
          req,
          res,
          404,
          "skills not found",
          "User's skills not found in database"
        );
        res.end();
      }
    } else if (req.user.userRole === "user") {
      let removedSkill = skillsData.find(
        (skill) => skill.userSkillId === id
      );
      skillsData.forEach(
        (skill) => console.log("CHECKING NA: ",skill.userSkillId, id)
      );
      if (removedSkill) {
        if (removedSkill.userId === req.user.userId) {
          for (let i = 0; i < skillsData.length; i++) {
            if (skillsData[i].userSkillId === id) {
              skillsData.splice(i, 1);
              break;
            }
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify(removedSkill));
          res.end();
          console.log("removedSkill", removedSkill);
        } else {
          middlewares.returnError(
            req,
            res,
            401,
            "User's unauthorized.",
            "User is unauthorized to delete this skill."
          );
        }
      } else {
        middlewares.returnError(
          req,
          res,
          404,
          "Not found.",
          "skill not found in database."
        );

        res.end();
      }
    }
  });
};

// export default {
//   getSkillsByUserId,
//   addSkill,
//   deleteSkillBySkillId,
//   deleteSkillsByUserId,
// };

export default {getSkills, addSkill, deleteSkills}