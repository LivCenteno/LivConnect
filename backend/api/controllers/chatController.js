const knex = require("../models/connection_db");
const util = require("./util");

const addChat = async (req, res, next) => {
  let user_id = req.body.user_id;
  let message = req.body.message;

  try {
    if (!user_id || !message) {
      return res.status(404).json({
        successful: false,
        message: "One or more details are missing",
      });
    } else {
      const userExist = await knex("user").where("id", user_id).first();

      if (!userExist) {
        return res.status(404).json({
          successful: false,
          message: "User Does not Exist",
        });
      } else {
        await knex("chat").insert({ user_id, message });
        return res.status(200).json({
          successful: true,
          message: "Successfully Chatted!",
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

module.exports = { addChat };
