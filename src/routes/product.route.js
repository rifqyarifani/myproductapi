const express = require("express");
const {
  allProducts,
  productById,
} = require("../controllers/product.controller");
const { verifyToken } = require("../middlewares/verifytoken");

const router = express.Router();

router.get("/", verifyToken, allProducts);
router.get("/:id", verifyToken, productById);

module.exports = router;
