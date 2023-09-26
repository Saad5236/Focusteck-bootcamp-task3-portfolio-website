const isValidUsername = (username) => /^[a-zA-Z.\s]+$/.test(username);
const isValidNumber = (phoneNumber) => /^[0-9+]+$/.test(phoneNumber);
const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);


export default {
    isValidUsername,
    isValidNumber,
    isValidEmail
}