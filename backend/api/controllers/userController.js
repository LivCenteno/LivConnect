const knex = require("../models/connection_db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const util = require("./util");

const createUser = async (req, res, next) => {
  try {
    let role = req.body.role;
    let firstName = req.body.firstName;
    let middleInitial = req.body.middleInitial;
    let lastName = req.body.lastName;
    let suffix = req.body.suffix;
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    let profilePicture = req.body.profilePicture;

    const validationError = util.checkUserInputs(
      role,
      firstName,
      middleInitial,
      lastName,
      suffix,
      email,
      password,
      username
    );

    if (validationError) {
      return res.status(400).json({
        successful: false,
        message: validationError,
      });
    } else {
      const EmailExist = await knex("user").where({ email }).first();
      const usernameExist = await knex("user").where({ username }).first();
      if (EmailExist) {
        return res.status(400).json({
          successful: false,
          message: "Email Already Exist",
        });
      } else if (usernameExist) {
        return res.status(400).json({
          successful: false,
          message: "Username Already Exist",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await knex("user").insert({
          role,
          firstName,
          middleInitial,
          lastName,
          suffix,
          email,
          password: hashedPassword,
          username,
          profilePicture,
        });
        return res.status(200).json({
          successful: true,
          message: "Successfully Created User!",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      successful: false,
      message: err,
    });
  }
};

module.exports = {
  createUser,
};
