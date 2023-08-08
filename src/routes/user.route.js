const express = require("express");
const {
  create,
  login,
  update,
  deleteUser,
  uploadFoto,
  changePassword,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/verifytoken");
const uploadDir = `${process.cwd()}/upload`;
const multer = require("multer");
const upload = multer({ dest: uploadDir });

const router = express.Router();

router.post("/register", create);
router.post("/login", login);
router.put("/update", verifyToken, update);
router.delete("/delete", verifyToken, deleteUser);
router.post(
  "/uploadfoto",
  verifyToken,
  upload.single("profilepic"),
  uploadFoto
);
router.put("/changepassword", verifyToken, changePassword);

module.exports = router;
