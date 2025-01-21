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
    let confirmPassword = req.body.confirmPassword;
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
      confirmPassword,
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

const viewUserviaId = async (req, res, next) => {
  try {
    let id = req.params.id;

    if (!id) {
      return res.status(404).json({
        successful: false,
        message: "Id is missing",
      });
    } else {
      let idExist = await knex("user").where({ id }).first();

      if (!idExist) {
        return res.status(400).json({
          successful: false,
          message: "Id does not exist",
        });
      } else {
        let userData = await knex("user").where({ id });
        return res.status(200).json({
          successful: true,
          message: "Successfully Retrieved User Details",
          data: userData,
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

const updateUsername = async (req, res, next) => {
  try {
    let id = req.params.id;
    let username = req.body.username;

    const validationError = util.updateEmail(id, username);

    if (validationError) {
      return res.status(400).json({
        successful: false,
        message: validationError,
      });
    } else {
      let idExist = await knex("user").where({ id }).first();
      let usernameExist = await knex("user").where({ username }).first();

      if (!idExist) {
        return res.status(400).json({
          successful: false,
          message: "Id does not exist",
        });
      } else if (usernameExist) {
        return res.status(400).json({
          successful: false,
          message: `Username:${username} already exist`,
        });
      } else {
        await knex("user")
          .update({ username, updatedAt: knex.fn.now() })
          .where({ id });
        return res.status(200).json({
          successful: true,
          message: "Successfully Updated Username",
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      successful: false,
      message: err.message,
    });
  }
};

const changePassword = async (req, res, next) => {
  try {
    let id = req.params.id;
    let password = req.body.password;
    let newPassword = req.body.newPassword;
    let confirmPassword = req.body.confirmPassword;

    const validationError = util.changePassword(
      id,
      password,
      newPassword,
      confirmPassword
    );

    if (validationError) {
      return res.status(400).json({
        successful: false,
        message: validationError,
      });
    } else {
      let idExist = await knex("user").where({ id }).first();

      if (!idExist) {
        return res.status(400).json({
          successful: false,
          message: "Id does not Exist",
        });
      } else {
        let oldPassword = idExist.password;

        const isMatch = await bcrypt.compare(password, oldPassword);
        const oldAndNewPasswordIsMatch = await bcrypt.compare(
          newPassword,
          oldPassword
        );
        if (!isMatch) {
          return res.status(400).json({
            successful: false,
            message: "Old password is incorrect",
          });
        } else if (oldAndNewPasswordIsMatch) {
          return res.status(400).json({
            successful: false,
            message: "New Password Cannot be the same as the Old Passowrd",
          });
        } else {
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);

          // Update the password in the database
          await knex("user")
            .update({
              password: hashedNewPassword,
              updatedAt: knex.fn.now(),
            })
            .where({ id });

          return res.status(200).json({
            successful: true,
            message: "Password successfully updated",
          });
        }
      }
    }
  } catch (err) {
    return res.status(500).json({
      successful: false,
      message: err.message,
    });
  }
};
module.exports = {
  createUser,
  viewUserviaId,
  updateUsername,
  changePassword,
};
