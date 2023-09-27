const isValidUsername = (username) => /^[a-zA-Z.\s]+$/.test(username);
const isValidNumber = (phoneNumber) => /^[0-9+]+$/.test(phoneNumber);
const isValidEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const validateUser = (data) => {
  return (
    !data.userName ||
    !data.userEmail ||
    !data.userPassword ||
    !data.userRole ||
    !data.userNumber ||
    !isValidUsername(data.userName) ||
    !isValidNumber(data.userNumber) ||
    !isValidEmail(data.userEmail)
  );
};

const validateProject = (data) => {
  return (
    !data.projectHeading ||
    !data.projectDescription ||
    !data.projectImageLink ||
    data.projectTags.length <= 0 ||
    data.projectFrameworks.length <= 0 ||
    data.projectLanguages.length <= 0 ||
    !/^[a-zA-Z\d\-_ ]*$/.test(data.projectHeading)
  );
};
export default {
  isValidUsername,
  isValidNumber,
  isValidEmail,
  validateUser,
  validateProject,
};
