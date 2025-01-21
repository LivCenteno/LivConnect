// util.js

// Checks for invalid characters in a string (numbers or special characters)
const checkNumbersAndSpecialChar = (input) => {
  const regex = /[^a-zA-Z]/;
  return regex.test(input);
};

// Validates the ID based on a specific pattern (e.g., alphanumeric only)
const checkId = (id) => {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(id);
};

// Validates the role (ensure it matches allowed roles)
const checkRole = (role) => {
  const allowedRoles = ["admin", "user", "teacher"];
  return allowedRoles.includes(role);
};

// Validates the email format
const checkEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validates the password (at least 8 characters, one uppercase, one lowercase, one digit, one special character)
const checkPassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Validates middle initial (one letter only, optional)
const checkMiddleInitial = (middleInitial) => {
  const regex = /^[a-zA-Z]?$/;
  return regex.test(middleInitial);
};

// Validates suffix (optional, should only contain letters and be short)
const checkSuffix = (suffix) => {
  const regex = /^[a-zA-Z]{0,5}$/;
  return regex.test(suffix);
};

// Comprehensive input validation for createUser
const checkUserInputs = (
  role,
  firstName,
  middleInitial,
  lastName,
  suffix,
  email,
  password,
  confirmPassword,
  username
) => {
  if (!checkRole(role)) {
    return "Invalid role";
  } else if (
    checkNumbersAndSpecialChar(firstName) ||
    checkNumbersAndSpecialChar(lastName)
  ) {
    return "Invalid name format";
  } else if (!checkMiddleInitial(middleInitial)) {
    return "Invalid middle initial";
  } else if (!checkSuffix(suffix)) {
    return "Invalid suffix";
  } else if (!checkEmail(email)) {
    return "Invalid email format";
  } else if (!checkPassword(password)) {
    return "Invalid password format. Password must contain at least one digit, one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long.";
  } else if (username.length > 30) {
    return "username's max is 30";
  } else if (password != confirmPassword) {
    return "Password and Confirm Password does not match";
  }

  return null; // All validations passed
};

module.exports = {
  checkUserInputs,
};
