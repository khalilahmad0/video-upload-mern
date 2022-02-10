const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegister(data) {
    let errors = {};
  
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
  
    // Name 
    if (Validator.isEmpty(data.name)) {
      errors.name = "Name field is required.";
    }
  
    // Email
    if (Validator.isEmpty(data.email)) {
      errors.email = "Email field is required.";
    } else if (!Validator.isEmail(data.email)) {
      errors.email = "Email is invalid.";
    }
  
    // Password 
    if (Validator.isEmpty(data.password)) {
      errors.password = "Password field is required.";
    }
  
    if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
      errors.password = "Password must be at least 8 characters.";
    }
  
    return {
      errors,
      isValid: isEmpty(errors),
    };
  };
  