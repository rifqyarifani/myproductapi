// const knexQuery = require("../../modelknex/knex");
const { userNew } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const create = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  // const insertData = await knexQuery("users").insert({
  //   firstname: body.firstname,
  //   lastname: body.lastname,
  //   email: body.email,
  //   password: body.password,
  // });

  if (!firstname || !lastname || !username || !email || !password) {
    return res.status(400).send({
      message: "Some field must be filled, cannot be empty",
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  const input = await userNew.create({
    firstname: firstname,
    lastname: lastname,
    username: username,
    email: email,
    password: hashedPassword,
  });

  return res.status(201).send({
    message: "user created",
  });
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({
        message: "some field must be filled, cannot be empty",
      });
    }

    const getUser = await userNew.findOne({
      where: { username: username },
    });

    if (!getUser) {
      return res.status(400).send({
        message: "user not found",
      });
    }

    const isValidPassword = bcrypt.compareSync(password, getUser.password);

    const token = jwt.sign(
      {
        id: getUser.id,
        username: getUser.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: 3600 }
    );

    if (getUser.username !== username || !isValidPassword) {
      return res.status(400).send({
        message: "username atau password yang anda masukkan salah",
      });
    }

    return res.status(200).send({
      message: "login success",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      message: "error occured",
      data: error,
    });
  }
};

const update = async (req, res) => {
  try {
    const idUser = req.user.id;
    const { firstname, lastname, username } = req.body;

    const updatedData = await userNew.update(
      {
        firstname: firstname,
        lastname: lastname,
        username: username,
      },
      { where: { id: idUser } }
    );
    res.status(201).send({
      message: "user updated",
    });
  } catch (error) {
    res.send({
      message: "error occured",
      data: error,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const idUser = req.user.id;

    const deletedUser = await userNew.destroy({ where: { id: idUser } });
    res.status(200).send({
      message: "your account has been deleted",
      data: deletedUser,
    });
  } catch (error) {
    res.status(400).send({
      message: "error occured",
      data: error,
    });
  }
};

const uploadFoto = async (req, res) => {
  try {
    const idUser = req.user.id;
    const filename = req.file.filename;
    const getUser = await userNew.findOne({
      where: { id: idUser },
    });

    if (!getUser) {
      return res.status(400).send({
        message: "user not found",
      });
    }

    const updateFotoDb = await userNew.update(
      {
        profilepic: filename,
      },
      { where: { id: idUser } }
    );
    return res.status(201).send({
      message: "upload foto berhasil",
    });
  } catch (error) {
    console.log(error);
    res.send({
      message: "error occured",
      data: error,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const idUser = req.user.id;
    const { old_password, new_password } = req.body;

    const getUser = await userNew.findOne({
      where: { id: idUser },
    });

    if (!getUser) {
      return res.status(400).send({
        message: "user not found",
      });
    }
    const isValidPassword = bcrypt.compareSync(old_password, getUser.password);

    if (!isValidPassword) {
      return res.status(400).send({
        message: "Invalid Old Password",
      });
    }

    if (!validator.isStrongPassword(new_password)) {
      return res.status(400).send({
        message: "Password is not strong enough",
      });
    }

    const hashedPassword = bcrypt.hashSync(new_password, 8);

    const updatePwd = await userNew.update(
      { password: hashedPassword },
      { where: { id: idUser } }
    );

    return res.status(201).send({
      message: "password changed",
    });
  } catch (error) {
    return res.send({
      message: "error occured",
      data: error,
    });
  }
};

module.exports = {
  create,
  login,
  update,
  deleteUser,
  uploadFoto,
  changePassword,
};
