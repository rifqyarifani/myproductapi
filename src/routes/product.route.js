const express = require("express");
const {
  allProducts,
  productById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { verifyToken } = require("../middlewares/verifytoken");

const router = express.Router();

router.get("/", verifyToken, allProducts);
router.get("/:id", verifyToken, productById);
router.post("/createproduct", verifyToken, createProduct);
router.put("/updateproduct", verifyToken, updateProduct);
router.delete("/deleteproduct", verifyToken, deleteProduct);

module.exports = router;
